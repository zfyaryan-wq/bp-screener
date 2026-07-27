from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .config import FEISHU_APP_ID, FEISHU_APP_SECRET


FEISHU_API_BASE = "https://open.feishu.cn/open-apis"


class FeishuApiError(RuntimeError):
    pass


@dataclass
class FeishuFile:
    token: str
    name: str
    type: str
    url: str
    parent_token: str = ""


class FeishuClient:
    def __init__(self, app_id: str = FEISHU_APP_ID, app_secret: str = FEISHU_APP_SECRET) -> None:
        if not app_id or not app_secret:
            raise FeishuApiError("FEISHU_APP_ID and FEISHU_APP_SECRET must be configured.")
        self.app_id = app_id
        self.app_secret = app_secret
        self._tenant_access_token: str | None = None

    @property
    def tenant_access_token(self) -> str:
        if not self._tenant_access_token:
            response = self.request(
                "POST",
                "/auth/v3/tenant_access_token/internal",
                payload={"app_id": self.app_id, "app_secret": self.app_secret},
                authenticated=False,
            )
            token = str(response.get("tenant_access_token") or "")
            if not token:
                raise FeishuApiError(f"Could not get tenant_access_token: {response}")
            self._tenant_access_token = token
        return self._tenant_access_token

    def request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        query: dict[str, Any] | None = None,
        authenticated: bool = True,
    ) -> dict[str, Any]:
        url = f"{FEISHU_API_BASE}{path}"
        if query:
            url += "?" + urllib.parse.urlencode({k: v for k, v in query.items() if v is not None})
        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        headers = {"Content-Type": "application/json; charset=utf-8"}
        if authenticated:
            headers["Authorization"] = f"Bearer {self.tenant_access_token}"
        request = urllib.request.Request(url, data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                body = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise FeishuApiError(f"Feishu API {method} {path} failed: {exc.code} {body}") from exc

        result = json.loads(body) if body else {}
        code = result.get("code", 0)
        if code not in {0, "0"}:
            raise FeishuApiError(f"Feishu API {method} {path} returned code={code}: {result.get('msg')}")
        return result

    def list_folder_files(self, folder_token: str, recursive: bool = True) -> list[FeishuFile]:
        result: list[FeishuFile] = []
        page_token = ""
        while True:
            data = self.request(
                "GET",
                "/drive/v1/files",
                query={"folder_token": folder_token, "page_size": 200, "page_token": page_token or None},
            ).get("data") or {}
            items = data.get("files") or data.get("items") or []
            for item in items:
                file = FeishuFile(
                    token=str(item.get("token") or ""),
                    name=str(item.get("name") or ""),
                    type=str(item.get("type") or ""),
                    url=str(item.get("url") or ""),
                    parent_token=str(item.get("parent_token") or folder_token),
                )
                if file.token and file.name:
                    result.append(file)
                    if recursive and file.type == "folder":
                        result.extend(self.list_folder_files(file.token, recursive=True))
            if not data.get("has_more"):
                break
            page_token = str(data.get("next_page_token") or "")
            if not page_token:
                break
        return result

    def upload_file(self, path: Path, folder_token: str) -> FeishuFile:
        if not folder_token:
            raise FeishuApiError("FEISHU_BP_FOLDER_TOKEN must be configured.")
        if not path.exists() or not path.is_file():
            raise FeishuApiError(f"File does not exist: {path}")

        boundary = f"----bp-screener-{path.stat().st_mtime_ns:x}"
        file_bytes = path.read_bytes()

        def part(name: str, value: str) -> bytes:
            return (
                f"--{boundary}\r\n"
                f'Content-Disposition: form-data; name="{name}"\r\n\r\n'
                f"{value}\r\n"
            ).encode("utf-8")

        body = b"".join(
            [
                part("file_name", path.name),
                part("parent_type", "explorer"),
                part("parent_node", folder_token),
                part("size", str(len(file_bytes))),
                (
                    f"--{boundary}\r\n"
                    f'Content-Disposition: form-data; name="file"; filename="{path.name}"\r\n'
                    "Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n"
                ).encode("utf-8"),
                file_bytes,
                b"\r\n",
                f"--{boundary}--\r\n".encode("utf-8"),
            ]
        )

        url = f"{FEISHU_API_BASE}/drive/v1/files/upload_all"
        request = urllib.request.Request(
            url,
            data=body,
            method="POST",
            headers={
                "Authorization": f"Bearer {self.tenant_access_token}",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                response_body = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            response_body = exc.read().decode("utf-8", errors="replace")
            raise FeishuApiError(f"Feishu file upload failed: {exc.code} {response_body}") from exc

        payload = json.loads(response_body) if response_body else {}
        code = payload.get("code", 0)
        if code not in {0, "0"}:
            raise FeishuApiError(f"Feishu file upload returned code={code}: {payload.get('msg')}")

        data = payload.get("data") or {}
        token = str(data.get("file_token") or data.get("token") or "")
        if not token:
            raise FeishuApiError(f"Feishu upload returned no file token: {payload}")

        listed = next((file for file in self.list_folder_files(folder_token, recursive=False) if file.token == token), None)
        return listed or FeishuFile(token=token, name=path.name, type=path.suffix.lstrip("."), url="", parent_token=folder_token)

    def download_file(self, file_token: str, output_path: Path) -> Path:
        if not file_token:
            raise FeishuApiError("Feishu file token is required for download.")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        url = f"{FEISHU_API_BASE}/drive/v1/files/{urllib.parse.quote(file_token)}/download"
        request = urllib.request.Request(
            url,
            method="GET",
            headers={"Authorization": f"Bearer {self.tenant_access_token}"},
        )
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                output_path.write_bytes(response.read())
        except urllib.error.HTTPError as exc:
            response_body = exc.read().decode("utf-8", errors="replace")
            raise FeishuApiError(f"Feishu file download failed: {exc.code} {response_body}") from exc
        return output_path

    def list_bitable_records(self, app_token: str, table_id: str, page_size: int = 100) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []
        page_token = ""
        while True:
            data = self.request(
                "GET",
                f"/bitable/v1/apps/{app_token}/tables/{table_id}/records",
                query={"page_size": page_size, "page_token": page_token or None},
            ).get("data") or {}
            result.extend(data.get("items") or [])
            if not data.get("has_more"):
                break
            page_token = str(data.get("page_token") or "")
            if not page_token:
                break
        return result
