from __future__ import annotations

import hashlib
import math
import re
from array import array


EMBEDDING_DIM = 384


def embed_text(text: str, dim: int = EMBEDDING_DIM) -> list[float]:
    vector = [0.0] * dim
    for token in tokens(text):
        digest = hashlib.blake2b(token.encode("utf-8"), digest_size=8).digest()
        value = int.from_bytes(digest, "big")
        index = value % dim
        sign = 1.0 if (value >> 63) == 0 else -1.0
        vector[index] += sign
    norm = math.sqrt(sum(value * value for value in vector))
    if not norm:
        return vector
    return [value / norm for value in vector]


def tokens(text: str) -> list[str]:
    normalized = text.lower()
    words = re.findall(r"[a-z0-9_]{2,}|[\u4e00-\u9fff]", normalized)
    chinese_chars = re.findall(r"[\u4e00-\u9fff]", normalized)
    chinese_bigrams = ["".join(chinese_chars[i : i + 2]) for i in range(max(0, len(chinese_chars) - 1))]
    return words + chinese_bigrams


def pack_vector(vector: list[float]) -> bytes:
    return array("f", vector).tobytes()


def unpack_vector(blob: bytes) -> array:
    vector = array("f")
    vector.frombytes(blob)
    return vector


def cosine_packed(query_vector: list[float], packed_vector: bytes) -> float:
    vector = unpack_vector(packed_vector)
    if len(vector) != len(query_vector):
        return 0.0
    return float(sum(left * right for left, right in zip(query_vector, vector)))
