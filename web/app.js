const labels = {
  en: {
    eyebrow: "BP Review Workspace",
    title: "VRT BP Screener",
    subtitle: "Review pitch decks, filter profiles, and inspect source evidence.",
    keyword: "Keyword",
    industry: "Industry",
    stage: "Stage",
    recommendation: "Recommendation",
    country: "Country / region",
    customerType: "Customer type",
    revenueStage: "Revenue stage",
    riskLevel: "Risk level",
    tagFilter: "Tags / keywords",
    aiRelatedFilter: "Technology-related",
    any: "Any",
    high: "High",
    medium: "Medium",
    low: "Low",
    unknown: "Unknown",
    sortBy: "Sort by",
    sortUpdated: "Newest updated",
    sortAiRanked: "VRT Agent ranked",
    sortScreening: "Screening score",
    sortRecommendation: "Recommendation",
    sortTeam: "Team strength",
    sortTraction: "Traction",
    sortRisk: "Lower risk first",
    sortCustomWeight: "Personal weight ranking",
    sortPersonalScoring: "My confirmed scores",
    search: "Search",
    resetFilters: "Reset",
    vrtAsk: "VRT Ask",
    projects: "Projects",
    projectName: "Project name",
    sourceSearch: "Source Snippet Search",
    sourceSearchHint: "Secondary evidence lookup",
    sourceSearchPlaceholder: "Search source text or reuse the keyword filter",
    searchSnippets: "Search snippets",
    charts: "Workbench Overview",
    personalWorkspace: "Personal Workspace",
    personalWorkspaceHint: "Current user, personal repository, weights, and personal activity.",
    bpLibraryOverview: "BP Library Overview",
    bpLibraryOverviewHint: "Portfolio-wide metrics and activity snapshots.",
    bpLibraryList: "BP Library List",
    projectListLoading: "Loading BP library...",
    projectListRefreshing: "Refreshing latest projects...",
    projectListCachedRefreshing: "Showing cached list · refreshing...",
    projectListLoadError: "Unable to load BP library.",
    overviewLoading: "Loading library overview...",
    overviewRefreshing: "Refreshing overview...",
    overviewCachedRefreshing: "Showing cached overview · refreshing...",
    overviewLoadError: "Unable to load library overview.",
    overviewEmpty: "No overview data yet.",
    retry: "Retry",
    libraryNumber: "Library #",
    libraryNumberHint: "Stable intake number, oldest first",
    untitledBp: "Untitled BP",
    notParsedYet: "Not parsed yet",
    sourceDocument: "Source document",
    noSummaryYet: "No summary parsed yet.",
    noTagsYet: "No tags yet",
    hideDiscussed: "Discussed",
    hideNotInterested: "Not interested",
    highlightOnly: "Highlighted",
    hiddenOnly: "Hidden",
    visibilityFilter: "Visibility",
    visibilityActive: "Active BPs",
    hiddenFiltersHint: "UI-only filters",
    moreFilters: "More filters",
    hideDiscussedTitle: "Hide discussed projects",
    hideNotInterestedTitle: "Hide not interested projects",
    highlightOnlyTitle: "Show highlighted projects only",
    hiddenOnlyTitle: "Show hidden projects only",
    highlight: "Highlight",
    unhighlight: "Remove highlight",
    highlightedBy: "Highlighted by",
    aiFinder: "VRT Agent Project Finder",
    askAi: "Ask VRT Agent",
    aiPlaceholder: "Example: Which AI/tech healthcare projects have strong teams and early traction?",
    aiThinking: "VRT Agent is reading the project library...",
    aiNoRecommendations: "No recommendations returned.",
    aiClarifyingQuestion: "Refine the search",
    aiSuggestedQueries: "Try one of these searches",
    aiFallbackNotice: "Finder note",
    recommendedProjects: "Recommended projects",
    filtersUsed: "Criteria used",
    loginTitle: "Choose your name",
    loginHint: "Select a team member to enter the BP workspace.",
    loginContinueHint: "Last session found for {name}. Select Enter to continue as this member, or choose another member.",
    loginButton: "Enter",
    loginContinueButton: "Continue as {name}",
    loginFailed: "Please choose a valid team member.",
    switchUserTitle: "Switch user",
    switchUserHint: "Choose a team member, then confirm before operating as that person.",
    switchUserAria: "Switch current user",
    switchUserCurrent: "Current user",
    switchUserConfirm: "Switching will make future actions operate as {name}. Continue?",
    switchAccessCodeLabel: "Access code is no longer required",
    switchAccessCodeHint: "Choose a team member and confirm to switch.",
    confirmSwitchUser: "Confirm switch",
    cancelSwitchUser: "Cancel",
    closeUserSwitch: "Close user switcher",
    industryChart: "Industry",
    stageChart: "Financing Stage",
    recommendationChart: "Recommendation",
    noProjects: "No projects found. Add BP files locally, analyze them, then sync data to D1.",
    view: "View details",
    openFile: "Open file",
    file: "File",
    company: "Company",
    industryRegion: "Industry / region",
    projectCompanyColumn: "Project / company",
    stageCustomerColumn: "Stage / customer",
    scoreColumn: "Score",
    riskRecommendationColumn: "Risk / recommendation",
    teamLikesColumn: "Team status / likes",
    tagsSummary: "Tags / summary",
    actions: "Actions",
    yes: "Yes",
    no: "No",
    stageLabel: "Stage",
    businessModel: "Business Model",
    screeningScore: "Screening Score",
    teamScore: "Team Score",
    tractionScore: "Traction Score",
    customerTypeLabel: "Customer Type",
    revenueStageLabel: "Revenue Stage",
    riskLevelLabel: "Risk Level",
    team: "Team Highlights",
    traction: "Traction",
    risks: "Risks",
    evidence: "Evidence",
    page: "Page",
    uploadTitle: "Upload BP",
    uploadHint: "Drag a PDF, PPT, PPTX, DOC, or DOCX here, or click to choose a file. The file will be archived to Feishu Drive.",
    uploadButton: "Choose file",
    uploadDropReady: "Drop the BP to upload",
    uploadIdle: "Waiting for a BP file.",
    uploadUploading: "Uploading to Feishu Drive...",
    uploadSuccess: "Uploaded to Feishu Drive. VRT Agent parsing will run in the downstream pipeline.",
    uploadFailed: "Upload failed",
    uploadLimit: "PDF, PPT, PPTX, DOC, DOCX. Default limit: 20 MB.",
    uploadInvalidType: "Unsupported file type. Please choose PDF, PPT, PPTX, DOC, or DOCX.",
    uploadTooLarge: "File is too large. Current limit is 20 MB.",
    uploadEmpty: "The selected file is empty.",
    uploadNetworkError: "Network error while uploading. Please try again.",
    uploadWarnings: "Warnings",
    closeUpload: "Close",
    scoringProfileTitle: "My scoring profile",
    scoringProfileHint: "Your final-score habits and current scoring lens.",
    scoringProfileLoading: "Loading scoring profile...",
    scoringProfileEmpty: "No scoring lens data yet. Confirm BP scores to build your profile.",
    scoringProfileLoadError: "Unable to load scoring profile.",
    scoringTemplateTitle: "Scoring template",
    scoringTemplateHint: "Choose the template VRT Agent should draft against.",
    templateTypeA: "Type A",
    templateTypeB: "Type B",
    templateTypeC: "Type C",
    templateMyCustom: "My custom",
    currentTemplate: "Template",
    scoringTemplateSwitched: "Scoring template switched to {template}",
    currentWeightSummary: "Weight preference",
    learnedFrom: "Learned from {count} BP adjustments",
    lastUpdated: "Last updated",
    vrtDraftsTitle: "VRT drafts",
    vrtDraftModeTitle: "VRT draft mode",
    vrtDraftModeCopy: "VRT Agent only drafts scores. You make the final call.",
    generateDraftScores: "Generate current BP draft",
    reviewPendingDrafts: "Review pending drafts",
    noDraftsForTemplate: "No drafts for this template yet.",
    pendingDraftCount: "{count} drafts",
    nextPendingDraft: "Next: {project}",
    reviewNextDraft: "Review next",
    noDraftsShort: "No draft scores yet",
    draftsShort: "drafts",
    adjustedShort: "adjusted",
    confirmedShort: "confirmed",
    nextShort: "Next",
    currentBpOnlyHint: "Current implementation drafts the selected BP first; queue review is ready for pending drafts.",
    reviewQueueTitle: "My review queue",
    draftsWaiting: "Drafts waiting",
    adjustedThisWeek: "Adjusted this week",
    confirmedScores: "Confirmed",
    advancedScoringSettings: "Advanced scoring settings",
    advancedScoringHint: "Weights, factor pools, personal factors, chart, and drag ordering.",
    scoreReviewTitle: "Score review",
    vrtSuggested: "VRT suggested",
    vrtReason: "Reason",
    vrtUncertainty: "Uncertainty",
    userFinalScore: "User final",
    adjustmentReason: "Adjustment reason",
    adjustmentReasonPlaceholder: "Optional: why you adjusted this score",
    saveFinalScore: "Save final score",
    noDraftYet: "No draft yet. Generate a VRT draft for this BP.",
    scoreSaved: "Final score saved.",
    draftGenerated: "Draft score generated.",
    finalScore: "Final score",
    draftScore: "Draft score",
    baseScore: "Base score",
    weightTitle: "Personal Weight Ranking",
    weightSubtitle: "Pick five factors in order, or ask VRT Agent to turn your preference into factors.",
    weightQuickHint: "Current lens and fast profile switching.",
    editWeights: "Edit weights",
    closeWeights: "Close weight editor",
    noActiveProfile: "No active weight profile yet.",
    quickSwitchWeights: "Quick switch",
    profileTitle: "Profile title",
    aiWeightPrompt: "Ask VRT Agent to build factors",
    weightPromptPlaceholder: "Example: I care about AI infrastructure, strong founders, early paid pilots, and low regulatory risk.",
    generateFactors: "Generate factors",
    saveAiFactorsPersonal: "Save AI factors to mine",
    publishAiFactorsPublic: "Publish AI factors",
    saveProfile: "Save profile",
    applyWeight: "Apply ranking",
    availableFactors: "Available factors",
    publicFactorPool: "Public factor pool",
    myFactors: "My factors",
    systemFactors: "System base factors",
    publicScope: "Public",
    personalScope: "Personal",
    systemScope: "System",
    selectFactor: "Select",
    publishFactor: "Publish",
    copyFactor: "Copy to mine",
    noFactors: "No factors in this pool yet.",
    factorSaved: "Factors saved.",
    selectedFactors: "Selected order",
    weightDragHint: "Drag the five priority slots to reorder. You can also use the arrow buttons.",
    weightChartTitle: "Weight mix",
    weightChartHint: "Drag a dot between two sectors to resize adjacent weights. Sliders below are a precise fallback.",
    weightChartEmpty: "Choose at least two factors to preview the weight chart.",
    emptyPrioritySlot: "Empty priority slot",
    moveUp: "Move up",
    moveDown: "Move down",
    removeFactor: "Remove",
    factorCategoryOverall: "Overall fit",
    factorCategoryFinancial: "Financial condition",
    factorCategoryFounderTeam: "Founder team",
    factorCategoryMarketIndustry: "Market / industry",
    factorCategoryProductTechnology: "Product / technology",
    factorCategoryBusinessCustomer: "Business model / customers",
    factorCategoryRisk: "Risk",
    weightBoard: "Weight profiles",
    weightBoardHint: "My saved lenses and the team's reusable ranking profiles.",
    myWeights: "My weights",
    teamWeights: "Team weights",
    profileDetails: "Details / history",
    profileEmptyMine: "No saved personal weight profile yet.",
    profileEmptyTeam: "No team profiles yet.",
    factorLimit: "Choose exactly five factors.",
    activeProfile: "Active profile",
    customRankScore: "Weight score",
    breakdown: "Breakdown",
    copy: "Copy",
    like: "Like",
    unlike: "Unlike",
    likes: "Likes",
    likedBy: "Liked by",
    dislike: "Dislike",
    undislike: "Remove dislike",
    dislikes: "Dislikes",
    dislikedBy: "Disliked by",
    comment: "Comment",
    commentPlaceholder: "Add a comment or question",
    editHistory: "Edit history",
    applyProfile: "Apply",
    editProfile: "Edit",
    generatedByAi: "VRT Agent generated factors are ready. Review, edit the title, then save or apply.",
    profileSaved: "Profile saved.",
    accessCodePlaceholder: "No access code required",
    accessCodeHint: "Choose your name and select Enter to continue.",
    accessCodeRequired: "No access code is required. Please choose a valid team member.",
    invalidAccessCode: "Unable to verify this team member.",
    accountAccessTitle: "Personal access code",
    accountAccessHint: "Each member's second confirmation code for switching identity and protecting personal actions.",
    oldAccessCodeLabel: "Current code",
    oldAccessCodePlaceholder: "Only needed when changing an existing code",
    newAccessCodeLabel: "New code",
    newAccessCodePlaceholder: "At least 4 characters",
    confirmNewAccessCodeLabel: "Confirm new code",
    confirmNewAccessCodePlaceholder: "Repeat new code",
    saveAccessCode: "Save access code",
    accessCodeMismatch: "The new codes do not match.",
    accessCodeTooShort: "Use at least 4 characters.",
    accessCodeSaved: "Personal access code saved.",
    rightContext: "BP Context",
    selectProjectHint: "Select a project to review the BP and team context here.",
    bpPreview: "BP Preview",
    openInNew: "Open in new window",
    feishuEmbedHint: "Feishu may block iframe embedding. If the preview is blank, open it in a new window.",
    openProjectRow: "Open details",
    openProjectRowHint: "Click row or project name to open details",
    projectActionFailed: "Update failed. Please try again.",
    teamPresence: "Team status",
    commentsQuestions: "Comments & Questions",
    addComment: "Add comment",
    askAboutBp: "Ask VRT Agent about this BP",
    markNotInterested: "Not interested",
    askProjectAi: "Ask project VRT Agent",
    projectQuestionPlaceholder: "Ask about this BP and team comments",
    teamViewSummary: "Team view summary",
    commentsEmpty: "No comments or questions yet.",
    viewed: "Viewed",
    commented: "Commented",
    asked: "Asked",
    notInterested: "Not interested",
    notVisited: "Not visited",
    collaboration: "Collaboration",
    reviewOps: "Review Ops",
    refresh: "Refresh",
    bpOps: "BP Review Ops",
    globalStatus: "Global status",
    statusNew: "New",
    statusDiscussed: "Discussed",
    statusEliminated: "Eliminated",
    statusWatching: "Watching",
    statusMeetingSelected: "Selected for meeting",
    markSupport: "Support",
    markOppose: "Oppose",
    markWatch: "Watch",
    voteSupport: "Vote support",
    voteOppose: "Vote oppose",
    voteNeutral: "Neutral",
    addToShortlist: "Add to repository",
    nominateThisWeek: "Nominate this week",
    similarBp: "Similar BP",
    compare: "Compare",
    personalRepository: "Personal repository",
    personalActivity: "Personal activity",
    weeklyNominations: "Weekly nominations",
    weeklyNominationBoard: "Weekly nominations",
    weeklyNominationBoardHint: "See who nominated which projects for this week's meeting.",
    bpLeaderboardTitle: "BP leaderboard",
    libraryLeaderboardTitle: "Library leaderboard",
    bpLeaderboardHint: "Top liked, most disliked, and BP views by teammate.",
    topLikedBp: "Top liked BP",
    topDislikedBp: "Top not interested / disliked",
    bpViewStats: "BP view stats",
    leaderboardTopLikedCompact: "点赞最高",
    leaderboardTopDislikedCompact: "隐藏/点踩最多",
    leaderboardViewsCompact: "浏览",
    viewsCount: "{count} viewed",
    noLeaderboardData: "No leaderboard data yet.",
    noMyNominationHint: "You have not nominated a project this week.",
    nominateSelected: "Nominate selected BP",
    selectBpToNominate: "Select a BP from the list, then nominate it here.",
    calendarReview: "Calendar review",
    calendarOpen: "Open calendar",
    workspaceOpen: "Open workspace",
    calendarExpand: "Expand calendar",
    calendarCollapse: "Collapse calendar",
    calendarLocalTimeNotice: "Shown in your local time",
    calendarCollapsedHint: "Click to expand the review calendar.",
    timezoneLabel: "Timezone",
    eventCount: "events",
    eventsOnDate: "Events on this date",
    localTime: "Local time",
    utcTime: "UTC",
    noShortlist: "Your repository is empty.",
    noNominations: "No weekly nominations yet.",
    noCalendar: "No calendar events yet.",
    shortlistedBy: "Collected by",
    nominatedBy: "Nominated by",
    votes: "Votes",
    recommendationPenalty: "VRT Agent priority penalty",
  },
  zh: {
    eyebrow: "BP 审阅工作台",
    title: "VRT BP Screener",
    subtitle: "查看项目档案、筛选重点，并检查原文证据。",
    keyword: "关键词",
    industry: "行业",
    stage: "阶段",
    recommendation: "推荐等级",
    country: "国家 / 地区",
    customerType: "客户类型",
    revenueStage: "收入阶段",
    riskLevel: "风险等级",
    tagFilter: "标签 / 关键词",
    aiRelatedFilter: "技术相关",
    any: "不限",
    high: "高",
    medium: "中",
    low: "低",
    unknown: "未知",
    sortBy: "排序方式",
    sortUpdated: "最近更新",
    sortAiRanked: "VRT Agent 智能排序",
    sortScreening: "综合筛选分",
    sortRecommendation: "推荐等级",
    sortTeam: "团队强度",
    sortTraction: "进展强度",
    sortRisk: "低风险优先",
    sortCustomWeight: "个人权重排序",
    sortPersonalScoring: "我的确认评分",
    search: "搜索",
    resetFilters: "重置",
    vrtAsk: "VRT 提问",
    projects: "项目",
    projectName: "项目名",
    sourceSearch: "原文片段搜索",
    sourceSearchHint: "次级证据查询",
    sourceSearchPlaceholder: "搜索原文，留空则使用左侧关键词",
    searchSnippets: "搜索片段",
    charts: "工作台概览",
    personalWorkspace: "个人工作区",
    personalWorkspaceHint: "当前用户、个人仓库、权重方案和个人活动集中在这里。",
    bpLibraryOverview: "BP 库概览",
    bpLibraryOverviewHint: "集中查看全库指标和协作动态。",
    bpLibraryList: "BP 库列表",
    projectListLoading: "正在加载 BP 项目库...",
    projectListRefreshing: "正在刷新最新项目...",
    projectListCachedRefreshing: "正在显示缓存列表 · 后台刷新中...",
    projectListLoadError: "无法加载 BP 项目库。",
    overviewLoading: "正在加载 BP 库概览...",
    overviewRefreshing: "正在刷新概览...",
    overviewCachedRefreshing: "正在显示缓存概览 · 后台刷新中...",
    overviewLoadError: "无法加载 BP 库概览。",
    overviewEmpty: "暂无可展示的概览数据。",
    retry: "重试",
    libraryNumber: "入库编号",
    libraryNumberHint: "按入库时间从早到晚固定编号",
    untitledBp: "未命名 BP",
    notParsedYet: "待解析",
    sourceDocument: "来源文件",
    noSummaryYet: "暂无解析摘要。",
    noTagsYet: "暂无标签",
    hideDiscussed: "已讨论",
    hideNotInterested: "不感兴趣",
    highlightOnly: "高亮",
    hiddenOnly: "隐藏",
    visibilityFilter: "可见范围",
    visibilityActive: "活跃 BP",
    hiddenFiltersHint: "仅界面筛选",
    moreFilters: "更多筛选",
    hideDiscussedTitle: "隐藏已讨论项目",
    hideNotInterestedTitle: "隐藏不感兴趣项目",
    highlightOnlyTitle: "只看高亮项目",
    hiddenOnlyTitle: "只看隐藏项目",
    highlight: "高亮",
    unhighlight: "取消高亮",
    highlightedBy: "高亮人",
    aiFinder: "VRT Agent 项目推荐",
    askAi: "询问 VRT Agent",
    aiPlaceholder: "例如：哪些智能技术医疗项目团队强、已有早期进展？",
    aiThinking: "VRT Agent 正在阅读项目库...",
    aiNoRecommendations: "没有返回推荐项目。",
    aiClarifyingQuestion: "继续澄清方向",
    aiSuggestedQueries: "可以试试这些查询",
    aiFallbackNotice: "推荐提示",
    recommendedProjects: "推荐项目",
    filtersUsed: "使用的判断标准",
    loginTitle: "选择你的名字",
    loginHint: "选择小组成员身份后进入 BP 工作台。",
    loginContinueHint: "检测到 {name} 的上次会话。点击进入可继续使用该身份，也可以先选择其他成员。",
    loginButton: "进入",
    loginContinueButton: "以 {name} 继续",
    loginFailed: "请选择有效的小组成员。",
    switchUserTitle: "切换用户",
    switchUserHint: "选择团队成员，并确认后再以该身份操作。",
    switchUserAria: "切换当前用户",
    switchUserCurrent: "当前用户",
    switchUserConfirm: "切换后将以 {name} 身份操作，继续？",
    switchAccessCodeLabel: "不再需要访问码",
    switchAccessCodeHint: "选择团队成员并确认即可切换。",
    confirmSwitchUser: "确认切换",
    cancelSwitchUser: "取消",
    closeUserSwitch: "关闭用户切换",
    industryChart: "行业分布",
    stageChart: "融资阶段",
    recommendationChart: "推荐等级",
    noProjects: "还没有项目。请先在本地添加并分析 BP，再把数据同步到 D1。",
    view: "查看详情",
    openFile: "打开原文件",
    file: "文件",
    company: "公司",
    industryRegion: "行业 / 地区",
    projectCompanyColumn: "项目 / 公司",
    stageCustomerColumn: "阶段 / 客户",
    scoreColumn: "分数",
    riskRecommendationColumn: "风险 / 推荐",
    teamLikesColumn: "团队状态 / 点赞",
    tagsSummary: "标签 / 摘要",
    actions: "操作",
    yes: "是",
    no: "否",
    stageLabel: "阶段",
    businessModel: "商业模式",
    screeningScore: "综合筛选分",
    teamScore: "团队分",
    tractionScore: "进展分",
    customerTypeLabel: "客户类型",
    revenueStageLabel: "收入阶段",
    riskLevelLabel: "风险等级",
    team: "团队亮点",
    traction: "当前进展",
    risks: "风险",
    evidence: "证据",
    page: "第",
    uploadTitle: "上传 BP",
    uploadHint: "把 PDF、PPT、PPTX、DOC 或 DOCX 拖到这里，或点击选择文件。文件会归档到飞书云文档。",
    uploadButton: "选择文件",
    uploadDropReady: "松开即可上传 BP",
    uploadIdle: "等待选择 BP 文件。",
    uploadUploading: "正在上传到飞书云文档...",
    uploadSuccess: "已上传到飞书云文档。VRT Agent 解析会在后续导入流水线中执行。",
    uploadFailed: "上传失败",
    uploadLimit: "支持 PDF、PPT、PPTX、DOC、DOCX。默认限制：20 MB。",
    uploadInvalidType: "文件类型不支持。请选择 PDF、PPT、PPTX、DOC 或 DOCX。",
    uploadTooLarge: "文件太大。当前限制为 20 MB。",
    uploadEmpty: "所选文件为空。",
    uploadNetworkError: "上传时网络异常，请重试。",
    uploadWarnings: "提醒",
    closeUpload: "关闭",
    scoringProfileTitle: "我的评分画像",
    scoringProfileHint: "你的最终评分习惯和当前评分视角。",
    scoringProfileLoading: "正在加载评分画像...",
    scoringProfileEmpty: "还没有评分视角数据。确认 BP 分数后会逐步生成画像。",
    scoringProfileLoadError: "无法加载评分画像。",
    scoringTemplateTitle: "评分模板",
    scoringTemplateHint: "选择 VRT Agent 生成草稿时使用的模板。",
    templateTypeA: "Type A",
    templateTypeB: "Type B",
    templateTypeC: "Type C",
    templateMyCustom: "My custom",
    currentTemplate: "当前模板",
    scoringTemplateSwitched: "评分模板已切换为 {template}",
    currentWeightSummary: "当前权重偏好",
    learnedFrom: "已学习自 {count} 个 BP 的人工调整",
    lastUpdated: "最近更新",
    vrtDraftsTitle: "VRT 草稿",
    vrtDraftModeTitle: "VRT 草稿模式",
    vrtDraftModeCopy: "VRT Agent only drafts scores. You make the final call.",
    generateDraftScores: "生成当前 BP 草稿分",
    reviewPendingDrafts: "查看待确认草稿",
    noDraftsForTemplate: "当前模板还没有待确认草稿。",
    pendingDraftCount: "{count} 条草稿",
    nextPendingDraft: "下一条：{project}",
    reviewNextDraft: "看下一条",
    noDraftsShort: "还没有草稿分",
    draftsShort: "草稿",
    adjustedShort: "已调",
    confirmedShort: "已确认",
    nextShort: "下一条",
    currentBpOnlyHint: "当前先支持为选中的 BP 生成草稿；待确认队列已预留入口。",
    reviewQueueTitle: "我的确认队列",
    draftsWaiting: "待确认草稿",
    adjustedThisWeek: "本周已调整",
    confirmedScores: "已确认",
    advancedScoringSettings: "高级评分设置",
    advancedScoringHint: "编辑权重、公共因子池、个人因子、饼图和拖动排序。",
    scoreReviewTitle: "评分确认",
    vrtSuggested: "VRT 建议",
    vrtReason: "理由",
    vrtUncertainty: "不确定点",
    userFinalScore: "用户最终分",
    adjustmentReason: "调整原因",
    adjustmentReasonPlaceholder: "可选：为什么调高或调低",
    saveFinalScore: "保存最终分",
    noDraftYet: "还没有草稿分。请先为当前 BP 生成 VRT 草稿。",
    scoreSaved: "最终分已保存。",
    draftGenerated: "草稿分已生成。",
    finalScore: "最终分",
    draftScore: "草稿分",
    baseScore: "基础分",
    weightTitle: "个人权重排序",
    weightSubtitle: "按顺序选择 5 个因素，或让 VRT Agent 把你的偏好转换为权重因素。",
    weightQuickHint: "当前方案与快速切换入口。",
    editWeights: "编辑权重",
    closeWeights: "关闭权重编辑器",
    noActiveProfile: "还没有启用权重方案。",
    quickSwitchWeights: "快速切换",
    profileTitle: "方案标题",
    aiWeightPrompt: "让 VRT Agent 生成因素",
    weightPromptPlaceholder: "例如：我更关注 AI 基础设施、强创始团队、已有付费试点、监管风险低的项目。",
    generateFactors: "生成因素",
    saveAiFactorsPersonal: "保存 AI 因素到我的池",
    publishAiFactorsPublic: "发布 AI 因素",
    saveProfile: "保存方案",
    applyWeight: "应用排序",
    availableFactors: "可选因素",
    publicFactorPool: "公共因子池",
    myFactors: "我的因子",
    systemFactors: "系统基础因子",
    publicScope: "公共",
    personalScope: "个人",
    systemScope: "系统",
    selectFactor: "选择",
    publishFactor: "发布",
    copyFactor: "复制到我的因子",
    noFactors: "这个池子还没有因子。",
    factorSaved: "因子已保存。",
    selectedFactors: "已选顺序",
    weightDragHint: "拖动 5 个优先级槽位即可调整顺序，也可以使用箭头按钮。",
    weightChartTitle: "权重占比",
    weightChartHint: "拖动两个扇区之间的圆点，可调整相邻因素比例；下方滑条可精确微调。",
    weightChartEmpty: "至少选择两个因素后显示权重图。",
    emptyPrioritySlot: "空优先级槽位",
    moveUp: "上移",
    moveDown: "下移",
    removeFactor: "移除",
    factorCategoryOverall: "综合判断类",
    factorCategoryFinancial: "财务状况类",
    factorCategoryFounderTeam: "创始团队类",
    factorCategoryMarketIndustry: "市场 / 行业类",
    factorCategoryProductTechnology: "产品 / 技术类",
    factorCategoryBusinessCustomer: "商业模式 / 客户类",
    factorCategoryRisk: "风险类",
    weightBoard: "权重方案库",
    weightBoardHint: "集中管理自己的权重方案，并复用团队成员的排序视角。",
    myWeights: "我的权重",
    teamWeights: "团队权重",
    profileDetails: "详情 / 历史",
    profileEmptyMine: "还没有保存个人权重方案。",
    profileEmptyTeam: "还没有团队权重方案。",
    factorLimit: "请正好选择 5 个因素。",
    activeProfile: "当前方案",
    customRankScore: "权重分",
    breakdown: "拆解",
    copy: "复制",
    like: "点赞",
    unlike: "取消点赞",
    likes: "点赞",
    likedBy: "点赞人",
    dislike: "点踩",
    undislike: "取消点踩",
    dislikes: "点踩",
    dislikedBy: "点踩人",
    comment: "评论",
    commentPlaceholder: "添加评论或问题",
    editHistory: "编辑记录",
    applyProfile: "应用",
    editProfile: "编辑",
    generatedByAi: "VRT Agent 已生成因素。请检查后保存或直接应用。",
    profileSaved: "方案已保存。",
    accessCodePlaceholder: "不需要访问码",
    accessCodeHint: "选择你的名字并点击进入即可继续。",
    accessCodeRequired: "不需要访问码，请选择有效的小组成员。",
    invalidAccessCode: "无法验证该团队成员。",
    accountAccessTitle: "个人访问码",
    accountAccessHint: "每个成员自己的二次确认码，用于切换身份/保护个人操作。",
    oldAccessCodeLabel: "当前访问码",
    oldAccessCodePlaceholder: "已有访问码时才需要填写",
    newAccessCodeLabel: "新访问码",
    newAccessCodePlaceholder: "至少 4 个字符",
    confirmNewAccessCodeLabel: "确认新访问码",
    confirmNewAccessCodePlaceholder: "再次输入新访问码",
    saveAccessCode: "保存访问码",
    accessCodeMismatch: "两次输入的新访问码不一致。",
    accessCodeTooShort: "至少输入 4 个字符。",
    accessCodeSaved: "个人访问码已保存。",
    rightContext: "BP 上下文",
    selectProjectHint: "选择一个项目后，在这里查看 BP、评论和团队状态。",
    bpPreview: "BP 预览",
    openInNew: "新窗口打开",
    feishuEmbedHint: "飞书可能禁止 iframe 嵌入；如果预览空白，请用新窗口打开。",
    openProjectRow: "打开详情",
    openProjectRowHint: "点击行或项目名打开详情",
    projectActionFailed: "更新失败，请重试。",
    teamPresence: "团队状态",
    commentsQuestions: "评论与问题",
    addComment: "添加评论",
    askAboutBp: "向 VRT Agent 询问这个 BP",
    markNotInterested: "不感兴趣",
    askProjectAi: "询问项目 VRT Agent",
    projectQuestionPlaceholder: "围绕这个 BP 和团队评论提问",
    teamViewSummary: "团队观点摘要",
    commentsEmpty: "暂时还没有评论或问题。",
    viewed: "访问过",
    commented: "评论过",
    asked: "提问过",
    notInterested: "不感兴趣",
    notVisited: "未访问",
    collaboration: "协作",
    reviewOps: "评审运营",
    refresh: "刷新",
    bpOps: "BP 评审运营",
    globalStatus: "项目全局状态",
    statusNew: "新项目",
    statusDiscussed: "已讨论过",
    statusEliminated: "已淘汰",
    statusWatching: "继续观察",
    statusMeetingSelected: "已选上会",
    markSupport: "支持",
    markOppose: "反对",
    markWatch: "关注",
    voteSupport: "投支持票",
    voteOppose: "投反对票",
    voteNeutral: "中立",
    addToShortlist: "加入个人仓库",
    nominateThisWeek: "提名本周上会",
    similarBp: "相似 BP",
    compare: "对比",
    personalRepository: "个人仓库",
    personalActivity: "个人活动",
    weeklyNominations: "本周提名",
    weeklyNominationBoard: "本周上会提名榜单",
    weeklyNominationBoardHint: "查看本周每位成员提名了哪些项目。",
    bpLeaderboardTitle: "BP 排行榜",
    libraryLeaderboardTitle: "Library leaderboard",
    bpLeaderboardHint: "查看点赞最高、点踩/不感兴趣最多，以及成员浏览统计。",
    topLikedBp: "点赞最高 BP",
    topDislikedBp: "不感兴趣 / 点踩最多",
    bpViewStats: "浏览统计",
    leaderboardTopLikedCompact: "Top liked",
    leaderboardTopDislikedCompact: "Most hidden/disliked",
    leaderboardViewsCompact: "Views",
    viewsCount: "浏览 {count} 个 BP",
    noLeaderboardData: "暂时还没有排行榜数据。",
    noMyNominationHint: "你本周还没有提名项目。",
    nominateSelected: "提名当前 BP",
    selectBpToNominate: "先在列表中选择一个 BP，再在这里提名。",
    calendarReview: "日历复盘",
    calendarOpen: "打开日历",
    workspaceOpen: "打开工作区",
    calendarExpand: "展开日历",
    calendarCollapse: "收起日历",
    calendarLocalTimeNotice: "按你的本地时间显示",
    calendarCollapsedHint: "点击展开复盘日历。",
    timezoneLabel: "时区",
    eventCount: "条事件",
    eventsOnDate: "当天活动",
    localTime: "本地时间",
    utcTime: "UTC",
    noShortlist: "你的个人仓库还是空的。",
    noNominations: "本周还没有提名。",
    noCalendar: "还没有日历事件。",
    shortlistedBy: "收藏者",
    nominatedBy: "提名人",
    votes: "投票",
    recommendationPenalty: "VRT Agent 推荐降权",
  },
};

const AUTH_STATE_VERSION = "20260726-name-only-login-v1";
const AUTH_STATE_VERSION_KEY = "bp-screener-auth-state-version";
migrateAuthState();

let lang = localStorage.getItem("bp-screener-lang") || "en";
let storedLoginUser = localStorage.getItem("bp-screener-user") || "";
let currentUser = "";
let accessCode = "";
let sessionToken = sessionStorage.getItem("bp-screener-session-token") || "";
let hasUserConfirmedEntry = false;
let lastAuthError = "";
let lastAuthStatus = 0;
localStorage.removeItem("bp-screener-access-code");
let projects = [];
let projectListRequestSeq = 0;
let projectListState = { phase: "idle", message: "", error: "" };
let projectActionStatusTimer = 0;
const projectActionRequests = new Set();
const expandedProjectRows = new Set();
let defaultFactors = [];
let factorPools = { public: [], personal: [], system: [] };
let selectedFactors = [];
let weightProfiles = [];
let activeWeightProfileId = Number(localStorage.getItem("bp-weight-profile-id") || 0);
let selectedDocumentId = 0;
let selectedProject = null;
let reviewBoard = null;
let scoringProfile = null;
let scoringProfileRequestSeq = 0;
let scoringProfileState = { phase: "idle", error: "" };
let scoringQueue = null;
let filterOptions = {};
let currentObjectUrl = "";
let draggedFactorIndex = -1;
let pointerFactorDrag = null;
let weightBoardTab = localStorage.getItem("bp-weight-board-tab") || "mine";
let activeFactorTab = localStorage.getItem("bp-factor-pool-tab") || "public";
let aiGeneratedFactors = [];
let calendarExpanded = localStorage.getItem("bp-calendar-expanded") === "true";
let leftRailMode = localStorage.getItem("bp-left-rail-mode") || "workspace";
let expandedCalendarDate = "";
let hideDiscussedProjects = localStorage.getItem("bp-hide-discussed-projects") === "true";
let hideNotInterestedProjects = localStorage.getItem("bp-hide-not-interested-projects") === "true";
let highlightOnlyProjects = localStorage.getItem("bp-highlight-only-projects") === "true";
let hiddenOnlyProjects = localStorage.getItem("bp-hidden-only-projects") === "true";
let visibilityFilterValue = localStorage.getItem("bp-visibility-filter") || visibilityFilterValueFromState();
applyVisibilityFilterValue(visibilityFilterValue, { persist: false });
let accountAccessCodeStatus = {};
let activeScoringTemplate = normalizeScoringTemplateKey(localStorage.getItem("bp-scoring-template"));
const userTimezone = resolveUserTimezone();
const DEFAULT_FACTOR_WEIGHTS = [40, 25, 18, 11, 6];
const MIN_FACTOR_WEIGHT = 5;
const WEIGHT_CHART_COLORS = ["#34d399", "#2dd4bf", "#a3e635", "#facc15", "#38bdf8"];
const REVENUE_STAGE_DEFINITIONS = [
  { value: "unknown", label: { en: "Unknown", zh: "未知" }, aliases: ["unknown", "未知", "n/a", "na", "none", "null", "not disclosed", "undisclosed", "待定", "不详", "未披露"] },
  { value: "no_revenue", label: { en: "No revenue", zh: "暂无收入" }, aliases: ["no revenue", "pre revenue", "pre-revenue", "prerevenue", "no income", "no sales", "not generating revenue", "not monetized", "暂无收入", "无收入", "尚无收入", "没有收入", "未产生收入", "无营收", "未商业化", "未变现", "0收入"] },
  { value: "pilot_poc", label: { en: "Pilot / POC", zh: "试点 / POC" }, aliases: ["pilot", "poc", "proof of concept", "paid pilot", "trial", "trial customer", "pilot customer", "试点", "试用", "概念验证", "验证阶段", "试点客户", "测试客户"] },
  { value: "early_revenue", label: { en: "Early revenue", zh: "早期收入" }, aliases: ["early revenue", "initial revenue", "first revenue", "some revenue", "revenue generating", "paid customer", "paid customers", "paying customer", "paying customers", "commercialized", "monetized", "已有收入", "早期收入", "初步收入", "少量收入", "开始收入", "付费客户", "商业化初期", "已商业化", "已变现"] },
  { value: "scaling_revenue", label: { en: "Scaling revenue", zh: "规模化收入" }, aliases: ["scaling revenue", "revenue growth", "growing revenue", "significant revenue", "recurring revenue", "mrr", "arr", "scale revenue", "规模化收入", "规模化营收", "收入增长", "增长收入", "稳定收入", "持续收入", "经常性收入", "放量"] },
  { value: "profitable", label: { en: "Profitable", zh: "已盈利" }, aliases: ["profitable", "profit", "profitability", "break even", "break-even", "breakeven", "positive cash flow", "已盈利", "盈利", "利润", "盈亏平衡", "现金流为正"] },
];

const REVENUE_STAGE_BY_VALUE = new Map(REVENUE_STAGE_DEFINITIONS.map((item) => [item.value, item]));
const ICON_PATHS = {
  add: '<path d="M12 5v14M5 12h14"></path>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"></path>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"></path>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"></path>',
  bookmark: '<path d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16l-5-3-5 3z"></path>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16"></path>',
  check: '<path d="M5 12.5l4 4L19 7"></path>',
  chevronDown: '<path d="M6 9l6 6 6-6"></path>',
  chevronRight: '<path d="M9 6l6 6-6 6"></path>',
  close: '<path d="M6 6l12 12M18 6L6 18"></path>',
  comment: '<path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v4A3.5 3.5 0 0 1 15.5 14H11l-5 5v-5.4A3.5 3.5 0 0 1 5 10.5z"></path>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 15V7a2 2 0 0 1 2-2h8"></path>',
  drag: '<path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01"></path>',
  edit: '<path d="M5 19l4.2-1 9.3-9.3a2.1 2.1 0 0 0-3-3L6.2 15z"></path><path d="M13.5 6.5l4 4"></path>',
  external: '<path d="M14 5h5v5"></path><path d="M10 14L19 5"></path><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"></path>',
  highlight: '<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path>',
  nominate: '<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path>',
  refresh: '<path d="M20 12a8 8 0 0 1-13.7 5.7"></path><path d="M4 12A8 8 0 0 1 17.7 6.3"></path><path d="M18 3v4h-4M6 21v-4h4"></path>',
  search: '<circle cx="11" cy="11" r="6"></circle><path d="M16 16l4 4"></path>',
  send: '<path d="M5 12h14M13 6l6 6-6 6"></path>',
  thumbsDown: '<path d="M10 14v5a2 2 0 0 0 3.6 1.2l3.1-5.2H20V4h-3.4a4 4 0 0 0-2.2-.7H8.8a2 2 0 0 0-2 1.6L5 12a2 2 0 0 0 2 2z"></path><path d="M20 4v11"></path>',
  thumbsUp: '<path d="M10 10V5a2 2 0 0 1 3.6-1.2L16.7 9H20v11h-3.4a4 4 0 0 1-2.2.7H8.8a2 2 0 0 1-2-1.6L5 12a2 2 0 0 1 2-2z"></path><path d="M20 9v11"></path>',
};

const teamUserMeta = [
  {
    name: "Alzamora Quan",
    initials: "AQ",
    displayName: "Alzamora Quan",
    className: "avatar-aq",
    colors: {
      bg: "linear-gradient(135deg, #064e3b, #022c22)",
      accent: "#34d399",
      text: "#d1fae5",
      ring: "rgba(52, 211, 153, 0.68)",
      glow: "rgba(52, 211, 153, 0.3)",
    },
  },
  {
    name: "Gary Wang",
    initials: "GW",
    displayName: "Gary Wang",
    className: "avatar-gw",
    colors: {
      bg: "linear-gradient(135deg, #0f766e, #042f2e)",
      accent: "#2dd4bf",
      text: "#ccfbf1",
      ring: "rgba(45, 212, 191, 0.68)",
      glow: "rgba(45, 212, 191, 0.3)",
    },
  },
  {
    name: "brody",
    initials: "B",
    displayName: "brody",
    className: "avatar-brody",
    colors: {
      bg: "linear-gradient(135deg, #854d0e, #3f2e05)",
      accent: "#facc15",
      text: "#fef9c3",
      ring: "rgba(250, 204, 21, 0.68)",
      glow: "rgba(250, 204, 21, 0.28)",
    },
  },
  {
    name: "Luca Viscapi",
    initials: "LV",
    displayName: "Luca Viscapi",
    className: "avatar-lv",
    colors: {
      bg: "linear-gradient(135deg, #075985, #082f49)",
      accent: "#38bdf8",
      text: "#e0f2fe",
      ring: "rgba(56, 189, 248, 0.66)",
      glow: "rgba(56, 189, 248, 0.28)",
    },
  },
  {
    name: "Frank Zhang",
    initials: "FZ",
    displayName: "Frank Zhang",
    className: "avatar-fz",
    colors: {
      bg: "linear-gradient(135deg, #365314, #1a2e05)",
      accent: "#a3e635",
      text: "#ecfccb",
      ring: "rgba(163, 230, 53, 0.68)",
      glow: "rgba(163, 230, 53, 0.3)",
    },
  },
];
const teamMembers = teamUserMeta.map((member) => member.name);
const teamMemberOrder = new Map(teamMembers.map((member, index) => [member, index]));
const allowedUploadExtensions = new Set(["pdf", "ppt", "pptx", "doc", "docx"]);
const uploadMaxBytes = 20 * 1024 * 1024;
const PROJECT_LIST_CACHE_PREFIX = "bp-project-list-cache-v2";
const PROJECT_LIST_CACHE_MAX_AGE_MS = 10 * 60 * 1000;
const welcomeTemplates = {
  en: [
    "Ready for today's review, {name}.",
    "{name}, your project library is ready.",
    "Welcome back, {name}.",
  ],
  zh: [
    "{name}，今天的审阅已就绪。",
    "{name}，项目库已准备好。",
    "欢迎回来，{name}。",
  ],
};

const language = document.querySelector("#language");
const grid = document.querySelector("#projectGrid");
const projectListStatus = document.querySelector("#projectListStatus");
const overviewStatus = document.querySelector("#overviewStatus");
const searchButton = document.querySelector("#searchButton");
const resetFiltersButton = document.querySelector("#resetFiltersButton");
const snippetList = document.querySelector("#snippetList");
const snippetQuery = document.querySelector("#snippetQuery");
const recommendQuestion = document.querySelector("#recommendQuestion");
const recommendButton = document.querySelector("#recommendButton");
const recommendResult = document.querySelector("#recommendResult");
const dialog = document.querySelector("#projectDialog");
const projectDialogCloseButton = document.querySelector("#projectDialogCloseButton");
const openVrtAskButton = document.querySelector("#openVrtAskButton");
const vrtAskDialog = document.querySelector("#vrtAskDialog");
const vrtAskCloseButton = document.querySelector("#vrtAskCloseButton");
const detail = document.querySelector("#projectDetail");
const loginOverlay = document.querySelector("#loginOverlay");
const loginForm = document.querySelector("#loginForm");
const loginHint = document.querySelector("[data-i18n='loginHint']");
const userSelect = document.querySelector("#userSelect");
const accessCodeInput = document.querySelector("#accessCode");
const loginError = document.querySelector("#loginError");
const loginSubmitButton = loginForm?.querySelector("button[type='submit']");
const welcomeMessage = document.querySelector("#welcomeMessage");
const currentUserBadge = document.querySelector("#currentUserBadge");
const personalUserMirror = document.querySelector("#personalUserMirror");
const projectCountMirror = document.querySelector("#projectCountMirror");
const loginMemberAvatars = document.querySelector("#loginMemberAvatars");
const userSwitchDialog = document.querySelector("#userSwitchDialog");
const userSwitchList = document.querySelector("#userSwitchList");
const userSwitchConfirm = document.querySelector("#userSwitchConfirm");
const userSwitchConfirmText = document.querySelector("#userSwitchConfirmText");
const switchAccessCodeInput = document.querySelector("#switchAccessCode");
const confirmUserSwitchButton = document.querySelector("#confirmUserSwitch");
const cancelUserSwitchButton = document.querySelector("#cancelUserSwitch");
const oldAccessCodeInput = document.querySelector("#oldAccessCode");
const newAccessCodeInput = document.querySelector("#newAccessCode");
const confirmNewAccessCodeInput = document.querySelector("#confirmNewAccessCode");
const saveAccessCodeButton = document.querySelector("#saveAccessCode");
const accountAccessStatus = document.querySelector("#accountAccessStatus");
const uploadOpenButton = document.querySelector("#uploadOpenButton");
const uploadCloseButton = document.querySelector("#uploadCloseButton");
const uploadOverlay = document.querySelector("#uploadOverlay");
const uploadDropzone = document.querySelector("#uploadDropzone");
const uploadFile = document.querySelector("#uploadFile");
const uploadStatus = document.querySelector("#uploadStatus");
const factorChoices = document.querySelector("#factorChoices");
const selectedFactorList = document.querySelector("#selectedFactors");
const profileBoard = document.querySelector("#profileBoard");
const weightPrompt = document.querySelector("#weightPrompt");
const weightProfileTitle = document.querySelector("#weightProfileTitle");
const activeProfileLabel = document.querySelector("#activeProfileLabel");
const bpPreviewDetails = document.querySelector("#bpPreviewDetails");
const bpFrame = document.querySelector("#bpFrame");
const bpFallbackLink = document.querySelector("#bpFallbackLink");
const contextList = document.querySelector("#contextList");
const teamPresence = document.querySelector("#teamPresence");
const teamViewSummary = document.querySelector("#teamViewSummary");
const contextComment = document.querySelector("#contextComment");
const projectQuestion = document.querySelector("#projectQuestion");
const projectAssistantResult = document.querySelector("#projectAssistantResult");
const projectOps = document.querySelector("#projectOps");
const shortlistBoard = document.querySelector("#shortlistBoard");
const nominationBoard = document.querySelector("#nominationBoard");
const bpLeaderboardSpotlight = document.querySelector("#bpLeaderboardSpotlight");
const weeklyNominationSpotlight = document.querySelector("#weeklyNominationSpotlight");
const calendarBoard = document.querySelector("#calendarBoard");
const reviewWeekLabel = document.querySelector("#reviewWeekLabel");
const weightEditorDialog = document.querySelector("#weightEditorDialog");
const activeWeightSummary = document.querySelector("#activeWeightSummary");
const quickProfileSwitch = document.querySelector("#quickProfileSwitch");
const scoringTemplateSelect = document.querySelector("#scoringTemplate");
const generateDraftScoresButton = document.querySelector("#generateDraftScores");
const reviewPendingDraftsButton = document.querySelector("#reviewPendingDrafts");
const scoringDraftStatus = document.querySelector("#scoringDraftStatus");
const scoringQueueSummary = document.querySelector("#scoringQueueSummary");
const scoreReviewCard = document.querySelector("#scoreReviewCard");
const leftWorkspaceView = document.querySelector("#leftWorkspaceView");
const leftCalendarView = document.querySelector("#leftCalendarView");
const calendarRailToggle = document.querySelector("#openCalendarRail");
const calendarDialog = document.querySelector("#calendarDialog");
const calendarCloseButton = document.querySelector("#calendarCloseButton");
const scoringProfileOpenButton = document.querySelector("#scoringProfileOpenButton");
const scoringProfileOverlay = document.querySelector("#scoringProfileOverlay");
const scoringProfileCloseButton = document.querySelector("#scoringProfileCloseButton");
const vrtAgentTargets = Array.from(document.querySelectorAll(".agentAvatar, .aiPanel"));
let vrtAgentWorkingCount = 0;
let pendingSwitchUser = "";

function syncVrtAgentState() {
  const isWorking = vrtAgentWorkingCount > 0;
  vrtAgentTargets.forEach((target) => {
    const isHovering = target.classList.contains("hover");
    target.classList.toggle("working", isWorking);
    target.classList.toggle("loading", isWorking);
    target.classList.toggle("idle", !isWorking && !isHovering);
  });
}

function beginVrtAgentWork() {
  vrtAgentWorkingCount += 1;
  syncVrtAgentState();
  return () => {
    vrtAgentWorkingCount = Math.max(0, vrtAgentWorkingCount - 1);
    syncVrtAgentState();
  };
}

function setupVrtAgentMotionState() {
  vrtAgentTargets.forEach((target) => {
    target.classList.add("idle");
    target.addEventListener("mouseenter", () => {
      target.classList.add("hover");
      syncVrtAgentState();
    });
    target.addEventListener("mouseleave", () => {
      target.classList.remove("hover");
      syncVrtAgentState();
    });
    target.addEventListener("focusin", () => {
      target.classList.add("hover");
      syncVrtAgentState();
    });
    target.addEventListener("focusout", () => {
      target.classList.remove("hover");
      syncVrtAgentState();
    });
  });
  syncVrtAgentState();
}

language.value = lang;
setupVrtAgentMotionState();
renderLoginMemberAvatars();
userSelect.addEventListener("change", () => {
  renderLoginMemberAvatars();
  renderLoginPrompt();
  loginError.textContent = "";
});
language.addEventListener("change", () => {
  lang = language.value;
  localStorage.setItem("bp-screener-lang", lang);
  applyLanguage();
  if (currentUser && teamMembers.includes(currentUser)) {
    refreshWorkspaceForCurrentUser();
  }
});

searchButton?.addEventListener("click", loadProjects);
resetFiltersButton?.addEventListener("click", resetProjectFilters);
document.querySelector("#visibilityFilter")?.addEventListener("change", (event) => {
  applyVisibilityFilterValue(event.target.value || "active");
  loadProjects();
});
document.querySelector("#snippetButton")?.addEventListener("click", searchSnippets);
openVrtAskButton?.addEventListener("click", openVrtAskDialog);
vrtAskCloseButton?.addEventListener("click", closeVrtAskDialog);
vrtAskDialog?.addEventListener("click", (event) => {
  if (event.target === vrtAskDialog) closeVrtAskDialog();
});
projectDialogCloseButton?.addEventListener("click", closeProjectDialog);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeProjectDialog();
});
recommendButton?.addEventListener("click", recommendProjects);
recommendQuestion?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    recommendProjects();
  }
});
recommendQuestion?.addEventListener("input", resizeRecommendComposer);
resizeRecommendComposer();
snippetQuery?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchSnippets();
  }
});
document.querySelector("#aiFactorButton").addEventListener("click", generateAiFactors);
document.querySelector("#saveWeightProfile").addEventListener("click", saveWeightProfile);
document.querySelector("#saveAiFactorsPersonal")?.addEventListener("click", () => saveAiFactors("personal"));
document.querySelector("#publishAiFactorsPublic")?.addEventListener("click", () => saveAiFactors("public"));
document.querySelector("#applyWeightSelection").addEventListener("click", applySelectedWeightProfile);
document.querySelector("#openWeightEditor")?.addEventListener("click", openWeightEditor);
document.querySelector("#closeWeightEditor")?.addEventListener("click", closeWeightEditor);
weightEditorDialog?.addEventListener("click", (event) => {
  if (event.target === weightEditorDialog) closeWeightEditor();
});
if (scoringTemplateSelect) {
  scoringTemplateSelect.value = activeScoringTemplate;
  scoringTemplateSelect.addEventListener("change", handleScoringTemplateChange);
}
generateDraftScoresButton?.addEventListener("click", generateCurrentDraftScore);
reviewPendingDraftsButton?.addEventListener("click", reviewPendingDraftQueue);
calendarRailToggle?.addEventListener("click", openCalendarDialog);
calendarCloseButton?.addEventListener("click", closeCalendarDialog);
calendarDialog?.addEventListener("click", (event) => {
  if (event.target === calendarDialog) closeCalendarDialog();
});
calendarDialog?.addEventListener("close", () => {
  calendarRailToggle?.setAttribute("aria-expanded", "false");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && calendarDialog?.open) closeCalendarDialog();
  if (event.key === "Escape" && scoringProfileOverlay && !scoringProfileOverlay.hidden) closeScoringProfilePanel();
});
scoringProfileOpenButton?.addEventListener("click", openScoringProfilePanel);
scoringProfileCloseButton?.addEventListener("click", closeScoringProfilePanel);
scoringProfileOverlay?.addEventListener("click", (event) => {
  if (event.target === scoringProfileOverlay) closeScoringProfilePanel();
});
document.querySelector("#addCommentButton").addEventListener("click", addProjectComment);
document.querySelector("#markNotInterestedButton").addEventListener("click", markNotInterested);
document.querySelector("#projectAssistantButton").addEventListener("click", askProjectAssistant);
document.querySelector("#refreshReviewBoard")?.addEventListener("click", loadReviewBoard);
document.querySelector("#closeDialog")?.addEventListener("click", closeProjectDialog);
currentUserBadge?.addEventListener("click", openUserSwitchDialog);
document.querySelector("#closeUserSwitch")?.addEventListener("click", closeUserSwitchDialog);
cancelUserSwitchButton?.addEventListener("click", clearPendingUserSwitch);
confirmUserSwitchButton?.addEventListener("click", confirmUserSwitch);
saveAccessCodeButton?.addEventListener("click", savePersonalAccessCode);
userSwitchDialog?.addEventListener("click", (event) => {
  if (event.target === userSwitchDialog) closeUserSwitchDialog();
});
setupUpload();
setupFilterAutoRefresh();
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const selectedUser = userSelect.value.trim();
  if (!teamMembers.includes(selectedUser)) {
    loginError.textContent = t("loginFailed");
    triggerAuthError(loginForm, userSelect);
    return;
  }
  const nextSessionToken = await verifyAccountAccess(selectedUser, loginForm, userSelect, {
    useStoredSession: canUseStoredSessionFor(selectedUser),
  });
  if (!nextSessionToken) {
    loginError.textContent = lastAuthError || t("invalidAccessCode");
    return;
  }
  currentUser = selectedUser;
  storedLoginUser = selectedUser;
  accessCode = "";
  sessionToken = nextSessionToken;
  localStorage.setItem("bp-screener-user", currentUser);
  sessionStorage.setItem("bp-screener-session-token", sessionToken);
  localStorage.removeItem("bp-screener-access-code");
  loginError.textContent = "";
  hasUserConfirmedEntry = true;
  renderWelcome();
  hideLoginOverlayAfterConfirmedEntry();
  await refreshWorkspaceForCurrentUser();
});

applyLanguage();
setLeftRailView("workspace");
bootstrapWorkspace();
window.setTimeout(loadAccessCodeStatus, 0);

function t(key) {
  return labels[lang][key] || key;
}

function resizeRecommendComposer() {
  if (!recommendQuestion) return;
  recommendQuestion.style.height = "auto";
  recommendQuestion.style.height = `${Math.min(recommendQuestion.scrollHeight, 112)}px`;
}

function openProjectDialog() {
  if (!dialog) return;
  if (!dialog.open) dialog.showModal();
}

function closeProjectDialog() {
  if (dialog?.open) dialog.close();
}

function openVrtAskDialog() {
  if (!vrtAskDialog) return;
  if (!vrtAskDialog.open) vrtAskDialog.showModal();
  resizeRecommendComposer();
  recommendQuestion?.focus();
}

function closeVrtAskDialog() {
  if (vrtAskDialog?.open) vrtAskDialog.close();
}

function applyLanguage() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
    if (node.hasAttribute("aria-label")) node.setAttribute("aria-label", t(node.dataset.i18nTitle));
  });
  renderLoginMemberAvatars();
  renderLoginPrompt();
  renderWelcome();
  renderFactorBuilder();
  renderProfileBoard();
  renderActiveProfileLabel();
  renderWeightQuickPanel();
  renderScoringQueueSummary();
  renderReviewBoard();
  renderFilterOptions(filterOptions);
  syncHiddenFilterControls();
  renderProjectList();
  if (selectedProject) renderProjectOps(selectedProject);
  if (selectedProject) renderScoreReviewCard(selectedProject);
}

function openWeightEditor() {
  if (!weightEditorDialog) return;
  closeScoringProfilePanel();
  if (typeof weightEditorDialog.showModal === "function") {
    weightEditorDialog.showModal();
  } else {
    weightEditorDialog.setAttribute("open", "");
  }
  renderFactorBuilder();
  renderProfileBoard();
}

function openScoringProfilePanel() {
  if (!scoringProfileOverlay) return;
  renderWeightQuickPanel();
  scoringProfileOverlay.hidden = false;
  scoringProfileOpenButton?.setAttribute("aria-expanded", "true");
}

function closeScoringProfilePanel() {
  if (!scoringProfileOverlay) return;
  scoringProfileOverlay.hidden = true;
  scoringProfileOpenButton?.setAttribute("aria-expanded", "false");
}

function closeWeightEditor() {
  if (!weightEditorDialog) return;
  if (typeof weightEditorDialog.close === "function") {
    weightEditorDialog.close();
  } else {
    weightEditorDialog.removeAttribute("open");
  }
}

function openCalendarDialog() {
  if (!calendarDialog) return;
  calendarExpanded = true;
  localStorage.setItem("bp-calendar-expanded", "true");
  if (reviewBoard) renderReviewBoard();
  else loadReviewBoard({ includeLeaderboards: false });
  if (calendarDialog.open) return;
  if (typeof calendarDialog.showModal === "function") {
    calendarDialog.showModal();
  } else {
    calendarDialog.setAttribute("open", "");
  }
  calendarRailToggle?.setAttribute("aria-expanded", "true");
}

function closeCalendarDialog() {
  if (!calendarDialog) return;
  if (!calendarDialog.open && !calendarDialog.hasAttribute("open")) {
    calendarRailToggle?.setAttribute("aria-expanded", "false");
    return;
  }
  if (typeof calendarDialog.close === "function") {
    calendarDialog.close();
  } else {
    calendarDialog.removeAttribute("open");
    calendarRailToggle?.setAttribute("aria-expanded", "false");
  }
}

function setLeftRailView(mode) {
  leftRailMode = "workspace";
  localStorage.setItem("bp-left-rail-mode", leftRailMode);
  if (leftWorkspaceView) leftWorkspaceView.hidden = false;
  if (leftCalendarView) leftCalendarView.hidden = true;
  if (calendarRailToggle) {
    calendarRailToggle.dataset.i18nTitle = "calendarOpen";
    calendarRailToggle.title = t("calendarOpen");
    calendarRailToggle.setAttribute("aria-label", t("calendarOpen"));
    calendarRailToggle.setAttribute("aria-pressed", "false");
  }
  if (reviewBoard) renderCalendarBoard(reviewBoard.calendar || []);
}

function renderWelcome() {
  if (!welcomeMessage || !currentUser) {
    if (welcomeMessage) welcomeMessage.textContent = "";
    if (currentUserBadge) currentUserBadge.hidden = true;
    if (personalUserMirror) {
      personalUserMirror.innerHTML = "";
      personalUserMirror.removeAttribute("title");
      personalUserMirror.removeAttribute("aria-label");
    }
    return;
  }
  const pool = welcomeTemplates[lang] || welcomeTemplates.en;
  const seed = `${currentUser}-${new Date().toDateString()}`;
  const index = Math.abs(hashCode(seed)) % pool.length;
  welcomeMessage.textContent = pool[index].replace("{name}", currentUser);
  if (currentUserBadge) {
    currentUserBadge.hidden = false;
    currentUserBadge.title = t("switchUserTitle");
    currentUserBadge.setAttribute("aria-label", `${t("switchUserAria")}: ${userDisplayName(currentUser)}`);
    currentUserBadge.innerHTML = `
      ${renderAvatar(currentUser, "large")}
      <span>${escapeHtml(userDisplayName(currentUser))}</span>
    `;
  }
  if (personalUserMirror) {
    personalUserMirror.innerHTML = "";
    personalUserMirror.removeAttribute("title");
    personalUserMirror.removeAttribute("aria-label");
  }
}

async function refreshWorkspaceForCurrentUser() {
  if (!hasUserConfirmedEntry || !currentUser || !teamMembers.includes(currentUser)) return;
  await loadProjects();
  window.setTimeout(() => {
    loadFilterOptions();
  }, 80);
  window.setTimeout(() => {
    Promise.allSettled([
      loadWeightProfiles(),
      loadScoringProfile(),
    ]);
  }, 120);
  loadNonCriticalWorkspaceData();
}

async function bootstrapWorkspace() {
  hasUserConfirmedEntry = false;
  currentUser = "";
  renderWelcome();
  loginOverlay.classList.remove("hidden");
  if (!teamMembers.includes(storedLoginUser)) {
    storedLoginUser = "";
    localStorage.removeItem("bp-screener-user");
    clearSessionOnly();
  }
  if (storedLoginUser) userSelect.value = storedLoginUser;
  renderLoginMemberAvatars();
  renderLoginPrompt();
  userSelect.focus();
}

function loadNonCriticalWorkspaceData() {
  window.setTimeout(() => {
    Promise.allSettled([
      loadScoringQueue(),
      loadReviewBoard({ includeLeaderboards: false }),
    ]);
  }, 400);
  window.setTimeout(() => {
    loadReviewBoard({ includeLeaderboards: true });
  }, 1600);
}

function clearSessionOnly() {
  hasUserConfirmedEntry = false;
  sessionToken = "";
  accessCode = "";
  sessionStorage.removeItem("bp-screener-session-token");
  localStorage.removeItem("bp-screener-access-code");
}

function migrateAuthState() {
  if (localStorage.getItem(AUTH_STATE_VERSION_KEY) === AUTH_STATE_VERSION) return;
  sessionStorage.removeItem("bp-screener-session-token");
  localStorage.removeItem("bp-screener-access-code");
  localStorage.setItem(AUTH_STATE_VERSION_KEY, AUTH_STATE_VERSION);
}

async function loadAccessCodeStatus() {
  const response = await fetch("/api/account/access-code/status").catch(() => null);
  if (!response?.ok) return;
  const data = await response.json().catch(() => ({}));
  accountAccessCodeStatus = data.members || {};
  renderLoginPrompt();
}

function canUseStoredSessionFor(user) {
  return Boolean(sessionToken && storedLoginUser && user === storedLoginUser);
}

async function verifyAccountAccess(user, errorContainer, errorInput, options = {}) {
  lastAuthError = "";
  lastAuthStatus = 0;
  const response = await fetch("/api/account/me", {
    headers: {
      "x-bp-user": user,
      "x-bp-timezone": userTimezone,
      "x-bp-locale": currentLocale(),
      ...(sessionToken && (user === currentUser || options.useStoredSession) ? { "x-bp-session-token": sessionToken } : {}),
    },
  }).catch(() => null);
  if (response?.ok) {
    const data = await response.json().catch(() => ({}));
    return data.session_token || sessionToken || "";
  }
  lastAuthStatus = response?.status || 0;
  const data = await response?.clone().json().catch(() => ({}));
  lastAuthError = data?.error || "";
  if (errorContainer || errorInput) triggerAuthError(errorContainer, errorInput);
  return "";
}

function triggerAuthError(container, input) {
  [container, input].filter(Boolean).forEach((node) => {
    node.classList.remove("authErrorFlash");
    void node.offsetWidth;
    node.classList.add("authErrorFlash");
  });
  window.setTimeout(() => {
    [container, input].filter(Boolean).forEach((node) => node.classList.remove("authErrorFlash"));
  }, 900);
  input?.focus();
}

async function savePersonalAccessCode() {
  if (!currentUser || !teamMembers.includes(currentUser)) return;
  const oldCode = oldAccessCodeInput?.value.trim() || "";
  const newCode = newAccessCodeInput?.value.trim() || "";
  const confirmCode = confirmNewAccessCodeInput?.value.trim() || "";
  if (newCode.length < 4) {
    setAccountAccessStatus(t("accessCodeTooShort"), "error");
    triggerAuthError(newAccessCodeInput, newAccessCodeInput);
    return;
  }
  if (newCode !== confirmCode) {
    setAccountAccessStatus(t("accessCodeMismatch"), "error");
    triggerAuthError(confirmNewAccessCodeInput, confirmNewAccessCodeInput);
    return;
  }
  const response = await fetch("/api/account/access-code", {
    method: "POST",
    headers: {
      ...authHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({ old_code: oldCode, new_code: newCode }),
  }).catch(() => null);
  if (!response?.ok) {
    const data = await response?.json().catch(() => ({}));
    setAccountAccessStatus(data?.error || t("invalidAccessCode"), "error");
    triggerAuthError(oldAccessCodeInput, oldAccessCodeInput);
    return;
  }
  const data = await response.json().catch(() => ({}));
  accessCode = "";
  sessionToken = data.session_token || sessionToken;
  if (sessionToken) sessionStorage.setItem("bp-screener-session-token", sessionToken);
  localStorage.removeItem("bp-screener-access-code");
  accountAccessCodeStatus[currentUser] = true;
  [oldAccessCodeInput, newAccessCodeInput, confirmNewAccessCodeInput].forEach((input) => {
    if (input) input.value = "";
  });
  setAccountAccessStatus(t("accessCodeSaved"), "success");
  await loadAccessCodeStatus();
}

function setAccountAccessStatus(message, type = "") {
  if (!accountAccessStatus) return;
  accountAccessStatus.textContent = message || "";
  accountAccessStatus.classList.toggle("success", type === "success");
  accountAccessStatus.classList.toggle("error", type === "error");
}

function renderLoginMemberAvatars() {
  const selected = teamMembers.includes(userSelect.value) ? userSelect.value : currentUser || storedLoginUser || teamUserMeta[0].name;
  userSelect.innerHTML = teamUserMeta
    .map((member) => `<option value="${escapeHtml(member.name)}">${escapeHtml(member.displayName)}</option>`)
    .join("");
  userSelect.value = teamMembers.includes(selected) ? selected : teamUserMeta[0].name;
  if (!loginMemberAvatars) return;
  loginMemberAvatars.innerHTML = teamUserMeta
    .map(
      (member) => `
        <button type="button" class="loginMemberAvatar ${member.name === userSelect.value ? "active" : ""}" data-login-member="${escapeHtml(member.name)}" aria-label="${escapeHtml(member.displayName)}">
          ${renderAvatar(member.name)}
          <span>${escapeHtml(member.displayName)}</span>
        </button>
      `,
    )
    .join("");
  loginMemberAvatars.querySelectorAll("[data-login-member]").forEach((button) => {
    button.addEventListener("click", () => {
      userSelect.value = button.dataset.loginMember;
      renderLoginMemberAvatars();
      renderLoginPrompt();
      loginError.textContent = "";
    });
  });
}

function renderLoginPrompt() {
  if (!loginHint || !loginSubmitButton) return;
  const selectedUser = userSelect?.value || "";
  const canContinue = canUseStoredSessionFor(selectedUser);
  loginHint.textContent = canContinue
    ? t("loginContinueHint").replace("{name}", userDisplayName(selectedUser))
    : t("loginHint");
  loginSubmitButton.textContent = canContinue
    ? t("loginContinueButton").replace("{name}", userDisplayName(selectedUser))
    : t("loginButton");
}

function hideLoginOverlayAfterConfirmedEntry() {
  if (!hasUserConfirmedEntry || !currentUser || !teamMembers.includes(currentUser)) return;
  loginOverlay.classList.add("hidden");
}

function openUserSwitchDialog() {
  if (!userSwitchDialog) return;
  pendingSwitchUser = "";
  renderUserSwitchList();
  clearPendingUserSwitch();
  setAccountAccessStatus("", "");
  userSwitchDialog.showModal();
}

function closeUserSwitchDialog() {
  if (!userSwitchDialog) return;
  clearPendingUserSwitch();
  userSwitchDialog.close();
}

function renderUserSwitchList() {
  if (!userSwitchList) return;
  userSwitchList.innerHTML = teamUserMeta
    .map((member) => {
      const isCurrent = member.name === currentUser;
      return `
        <button type="button" class="userSwitchOption ${isCurrent ? "active" : ""}" data-switch-user="${escapeHtml(member.name)}" aria-current="${isCurrent ? "true" : "false"}">
          ${renderAvatar(member.name, "large")}
          <span>
            <strong>${escapeHtml(member.displayName)}</strong>
            ${isCurrent ? `<small>${escapeHtml(t("switchUserCurrent"))}</small>` : ""}
          </span>
        </button>
      `;
    })
    .join("");
  userSwitchList.querySelectorAll("[data-switch-user]").forEach((button) => {
    button.addEventListener("click", () => selectSwitchUser(button.dataset.switchUser || ""));
  });
}

function selectSwitchUser(name) {
  if (!teamMembers.includes(name)) return;
  pendingSwitchUser = name;
  if (name === currentUser) {
    clearPendingUserSwitch();
    return;
  }
  if (userSwitchConfirm) userSwitchConfirm.hidden = false;
  if (userSwitchConfirmText) {
    userSwitchConfirmText.textContent = t("switchUserConfirm").replace("{name}", userDisplayName(name));
  }
  if (switchAccessCodeInput) {
    switchAccessCodeInput.value = "";
  }
  confirmUserSwitchButton?.focus();
  userSwitchList?.querySelectorAll("[data-switch-user]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.switchUser === name);
  });
}

function clearPendingUserSwitch() {
  pendingSwitchUser = "";
  if (userSwitchConfirm) userSwitchConfirm.hidden = true;
  if (userSwitchConfirmText) userSwitchConfirmText.textContent = "";
  if (switchAccessCodeInput) switchAccessCodeInput.value = "";
  userSwitchList?.querySelectorAll("[data-switch-user]").forEach((button) => button.classList.remove("selected"));
}

async function confirmUserSwitch() {
  if (!pendingSwitchUser || pendingSwitchUser === currentUser || !teamMembers.includes(pendingSwitchUser)) {
    clearPendingUserSwitch();
    return;
  }
  const nextSessionToken = await verifyAccountAccess(pendingSwitchUser, userSwitchConfirm, confirmUserSwitchButton);
  if (!nextSessionToken) return;
  currentUser = pendingSwitchUser;
  storedLoginUser = pendingSwitchUser;
  accessCode = "";
  sessionToken = nextSessionToken;
  hasUserConfirmedEntry = true;
  localStorage.setItem("bp-screener-user", currentUser);
  sessionStorage.setItem("bp-screener-session-token", sessionToken);
  localStorage.removeItem("bp-screener-access-code");
  if (userSelect) userSelect.value = currentUser;
  if (accessCodeInput) accessCodeInput.value = "";
  renderLoginMemberAvatars();
  renderWelcome();
  closeUserSwitchDialog();
  await refreshWorkspaceForCurrentUser();
}

function setupUpload() {
  if (!uploadDropzone || !uploadFile) return;
  uploadOpenButton?.addEventListener("click", openUploadOverlay);
  uploadCloseButton?.addEventListener("click", closeUploadOverlay);
  uploadOverlay?.addEventListener("click", (event) => {
    if (event.target === uploadOverlay) closeUploadOverlay();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && uploadOverlay && !uploadOverlay.hidden) {
      closeUploadOverlay();
    }
  });
  uploadDropzone.addEventListener("click", () => uploadFile.click());
  uploadDropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      uploadFile.click();
    }
  });
  uploadFile.addEventListener("change", () => {
    const [file] = uploadFile.files || [];
    if (file) uploadBp(file);
  });
  ["dragenter", "dragover"].forEach((eventName) => {
    uploadDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadDropzone.classList.add("dragging");
      setUploadStatus(t("uploadDropReady"));
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    uploadDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadDropzone.classList.remove("dragging");
    });
  });
  uploadDropzone.addEventListener("drop", (event) => {
    const [file] = event.dataTransfer?.files || [];
    if (file) uploadBp(file);
  });
}

function openUploadOverlay() {
  if (!uploadOverlay) return;
  uploadOverlay.hidden = false;
  setUploadStatus(uploadStatus?.textContent || t("uploadIdle"), uploadStatus?.className?.replace("uploadStatus", "").trim() || "");
  uploadDropzone?.focus();
}

function closeUploadOverlay() {
  if (!uploadOverlay) return;
  uploadOverlay.hidden = true;
  uploadOpenButton?.focus();
}

async function uploadBp(file) {
  if (!currentUser || !teamMembers.includes(currentUser)) {
    loginOverlay.classList.remove("hidden");
    userSelect.focus();
    return;
  }
  const validationError = validateUploadFile(file);
  if (validationError) {
    setUploadStatus(validationError, "error");
    if (uploadFile) uploadFile.value = "";
    return;
  }
  setUploadStatus(`${t("uploadUploading")} ${file.name}`, "busy");
  const form = new FormData();
  form.set("file", file, file.name);
  let response;
  try {
    response = await apiFetch("/api/upload", {
      method: "POST",
      body: form,
    });
  } catch {
    setUploadStatus(`${t("uploadFailed")}: ${t("uploadNetworkError")}`, "error");
    if (uploadFile) uploadFile.value = "";
    return;
  }
  if (uploadFile) uploadFile.value = "";
  if (!response) return;
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    setUploadStatus(`${t("uploadFailed")}: ${data.error || response.statusText}`, "error");
    return;
  }
  const warningText = data.warnings?.length
    ? ` ${t("uploadWarnings")}: ${data.warnings.join(" ")}`
    : "";
  setUploadStatus(`${t("uploadSuccess")} ${file.name}${warningText}`, "success");
  await loadFilterOptions();
  await loadProjects();
}

function validateUploadFile(file) {
  const fileName = String(file?.name || "").trim();
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  if (!fileName || !allowedUploadExtensions.has(extension)) return t("uploadInvalidType");
  if (!file.size || file.size <= 0) return t("uploadEmpty");
  if (file.size > uploadMaxBytes) return t("uploadTooLarge");
  return "";
}

function setUploadStatus(message, state = "") {
  if (!uploadStatus) return;
  uploadStatus.className = `uploadStatus ${state}`.trim();
  uploadStatus.textContent = message || t("uploadIdle");
}

function hashCode(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

function setProjectListState(nextState = {}) {
  projectListState = {
    phase: nextState.phase || "idle",
    message: nextState.message || "",
    error: nextState.error || "",
  };
  renderProjectListStatus();
  renderOverviewStatus();
}

function setScoringProfileState(nextState = {}) {
  scoringProfileState = {
    phase: nextState.phase || "idle",
    error: nextState.error || "",
  };
  renderWeightQuickPanel();
}

function setProjectSearchBusy(isBusy) {
  if (!searchButton) return;
  searchButton.disabled = isBusy;
  searchButton.textContent = isBusy ? t("projectListRefreshing") : t("search");
}

function renderProjectListStatus() {
  if (!projectListStatus) return;
  const { phase, message, error } = projectListState;
  if (!message && !error) {
    projectListStatus.hidden = true;
    projectListStatus.className = "projectListStatus";
    projectListStatus.innerHTML = "";
    return;
  }
  const isError = phase === "error";
  projectListStatus.hidden = false;
  projectListStatus.className = `projectListStatus ${phase}`.trim();
  projectListStatus.innerHTML = `
    <span>${escapeHtml(error || message)}</span>
    ${isError ? `<button type="button" class="secondary compactButton" data-project-list-retry>${escapeHtml(t("retry"))}</button>` : ""}
  `;
  projectListStatus.querySelector("[data-project-list-retry]")?.addEventListener("click", loadProjects);
}

function renderOverviewStatus() {
  if (!overviewStatus) return;
  const { phase, error } = projectListState;
  const messageByPhase = {
    loading: t("overviewLoading"),
    refreshing: t("overviewCachedRefreshing"),
    error: error || t("overviewLoadError"),
  };
  const message = messageByPhase[phase] || "";
  if (!message) {
    overviewStatus.hidden = true;
    overviewStatus.className = "projectListStatus overviewStatus";
    overviewStatus.innerHTML = "";
    return;
  }
  const isError = phase === "error";
  overviewStatus.hidden = false;
  overviewStatus.className = `projectListStatus overviewStatus ${phase}`.trim();
  overviewStatus.innerHTML = `
    <span>${escapeHtml(message)}</span>
    ${isError ? `<button type="button" class="secondary compactButton" data-overview-retry>${escapeHtml(t("retry"))}</button>` : ""}
  `;
  overviewStatus.querySelector("[data-overview-retry]")?.addEventListener("click", loadProjects);
}

function projectListLoadingBlock(messageKey = "projectListLoading") {
  return `
    <div id="projectLoadingState" class="projectLoadingState" role="status" aria-live="polite">
      <div class="projectLoadingSpinner" aria-hidden="true"></div>
      <div>
        <strong>${escapeHtml(t(messageKey))}</strong>
      </div>
    </div>
  `;
}

function overviewLoadingBlock(messageKey = "overviewLoading") {
  return `
    <div class="overviewStateCard projectLoadingState" role="status" aria-live="polite">
      <div class="projectLoadingSpinner" aria-hidden="true"></div>
      <div>
        <strong>${escapeHtml(t(messageKey))}</strong>
      </div>
    </div>
  `;
}

function projectListErrorBlock(errorMessage) {
  return `
    <div class="panel projectEmpty projectListErrorBlock" role="alert">
      <strong>${escapeHtml(t("projectListLoadError"))}</strong>
      <p>${escapeHtml(errorMessage || t("projectListLoadError"))}</p>
      <button type="button" class="secondary compactButton" data-project-list-retry>${escapeHtml(t("retry"))}</button>
    </div>
  `;
}

function overviewErrorBlock(errorMessage) {
  return `
    <div class="overviewStateCard projectListErrorBlock" role="alert">
      <strong>${escapeHtml(t("overviewLoadError"))}</strong>
      <p>${escapeHtml(errorMessage || t("overviewLoadError"))}</p>
      <button type="button" class="secondary compactButton" data-overview-retry>${escapeHtml(t("retry"))}</button>
    </div>
  `;
}

async function loadProjects() {
  const requestId = ++projectListRequestSeq;
  const params = new URLSearchParams();
  params.set("lang", lang);
  params.set("view", "list");
  setParam(params, "q", value("#keyword"));
  setParam(params, "industry", value("#industry"));
  setParam(params, "stage", value("#stage"));
  setParam(params, "recommendation", value("#recommendation"));
  setParam(params, "country", value("#country"));
  setParam(params, "customerType", value("#customerType"));
  setParam(params, "revenueStage", value("#revenueStage"));
  setParam(params, "riskLevel", value("#riskLevel"));
  setParam(params, "tag", value("#tag"));
  if (hideDiscussedProjects) params.set("hideDiscussed", "true");
  if (hideNotInterestedProjects) params.set("hideNotInterested", "true");
  if (highlightOnlyProjects) params.set("highlightOnly", "true");
  if (hiddenOnlyProjects) params.set("hiddenOnly", "true");
  const sortBy = value("#sortBy");
  params.set("scoringTemplate", activeScoringTemplate);
  setParam(params, "sortBy", sortBy === "custom_weight" ? "updated_desc" : sortBy);
  if (sortBy === "custom_weight" && activeWeightProfileId) {
    params.set("weightProfileId", String(activeWeightProfileId));
  }
  if (sortBy === "personal_scoring_desc") {
    params.set("includePersonalScoring", "true");
  }

  const cacheKey = projectListCacheKey(params);
  const cached = readProjectListCache(cacheKey);
  const hasCachedProjects = Boolean(cached?.projects?.length);
  if (cached?.projects?.length) {
    projects = cached.projects;
    setProjectListState({ phase: "refreshing", message: t("projectListCachedRefreshing") });
    renderProjectList();
  } else {
    setProjectListState({ phase: "loading" });
    renderProjectList();
  }

  setProjectSearchBusy(true);
  try {
    const response = await apiFetch(`/api/projects?${params.toString()}`);
    if (!response) return;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `${t("projectListLoadError")} HTTP ${response.status}`);
    }
    if (requestId !== projectListRequestSeq) return;
    projects = data.projects || [];
    writeProjectListCache(cacheKey, projects);
    setProjectListState({ phase: "idle" });
    renderProjectList();
    if (params.get("includePersonalScoring") !== "true") {
      window.setTimeout(() => hydrateProjectListPersonalScores(params, cacheKey, requestId), 150);
    }
  } catch (error) {
    if (requestId !== projectListRequestSeq) return;
    setProjectListState({
      phase: "error",
      error: error?.message || t("projectListLoadError"),
    });
    if (!hasCachedProjects) {
      projects = [];
      renderProjectList();
    }
  } finally {
    if (requestId === projectListRequestSeq) setProjectSearchBusy(false);
  }
}

async function hydrateProjectListPersonalScores(baseParams, cacheKey, requestId) {
  if (requestId !== projectListRequestSeq) return;
  const params = new URLSearchParams(baseParams);
  params.set("includePersonalScoring", "true");
  const response = await apiFetch(`/api/projects?${params.toString()}`);
  if (!response || requestId !== projectListRequestSeq) return;
  const data = await response.json().catch(() => ({}));
  if (requestId !== projectListRequestSeq || !Array.isArray(data.projects)) return;
  const scoresByDocument = new Map(
    data.projects.map((project) => [Number(project.document_id), {
      personal_score: project.personal_score,
      personal_score_source: project.personal_score_source,
    }]),
  );
  projects = projects.map((project) => ({
    ...project,
    ...(scoresByDocument.get(Number(project.document_id)) || {}),
  }));
  writeProjectListCache(cacheKey, projects);
  renderProjectList();
}

function projectListCacheKey(params) {
  const stableParams = new URLSearchParams(params);
  stableParams.sort();
  return `${PROJECT_LIST_CACHE_PREFIX}:${currentUser || "anonymous"}:${stableParams.toString()}`;
}

function readProjectListCache(key) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || "null");
    if (!cached || Date.now() - Number(cached.cached_at || 0) > PROJECT_LIST_CACHE_MAX_AGE_MS) return null;
    return cached;
  } catch {
    return null;
  }
}

function writeProjectListCache(key, projectItems) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ cached_at: Date.now(), projects: projectItems || [] }));
  } catch {
    // Cache is a best-effort fast path; storage quotas should not block the list.
  }
}

async function loadFilterOptions() {
  const response = await apiFetch(`/api/filter-options?lang=${encodeURIComponent(lang)}`);
  if (!response) return;
  const data = await response.json().catch(() => ({}));
  filterOptions = data.options || {};
  renderFilterOptions(filterOptions);
}

function setupFilterAutoRefresh() {
  const debouncedLoadProjects = debounce(loadProjects, 260);
  document.querySelector("#keyword")?.addEventListener("input", debouncedLoadProjects);
  [
    "#industry",
    "#stage",
    "#recommendation",
    "#country",
    "#customerType",
    "#revenueStage",
    "#riskLevel",
    "#tag",
    "#sortBy",
  ].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", loadProjects);
  });
}

function resetProjectFilters() {
  [
    "#keyword",
    "#industry",
    "#stage",
    "#recommendation",
    "#country",
    "#customerType",
    "#revenueStage",
    "#riskLevel",
    "#tag",
  ].forEach((selector) => {
    const control = document.querySelector(selector);
    if (control) control.value = "";
  });
  const sortBy = document.querySelector("#sortBy");
  if (sortBy) sortBy.value = "updated_desc";
  applyVisibilityFilterValue("active");
  loadProjects();
}

function syncHiddenFilterControls() {
  const visibilityFilter = document.querySelector("#visibilityFilter");
  if (visibilityFilter) visibilityFilter.value = visibilityFilterValueFromState();
}

function visibilityFilterValueFromState() {
  if (hiddenOnlyProjects) return "hidden";
  if (highlightOnlyProjects) return "highlighted";
  if (hideNotInterestedProjects) return "hide_not_interested";
  if (hideDiscussedProjects) return "hide_discussed";
  return "active";
}

function applyVisibilityFilterValue(nextValue, options = {}) {
  const value = ["active", "hide_discussed", "hide_not_interested", "highlighted", "hidden"].includes(nextValue)
    ? nextValue
    : "active";
  visibilityFilterValue = value;
  hideDiscussedProjects = value === "hide_discussed";
  hideNotInterestedProjects = value === "hide_not_interested";
  highlightOnlyProjects = value === "highlighted";
  hiddenOnlyProjects = value === "hidden";
  if (options.persist !== false) {
    localStorage.setItem("bp-visibility-filter", value);
  }
  localStorage.setItem("bp-hide-discussed-projects", String(hideDiscussedProjects));
  localStorage.setItem("bp-hide-not-interested-projects", String(hideNotInterestedProjects));
  localStorage.setItem("bp-highlight-only-projects", String(highlightOnlyProjects));
  localStorage.setItem("bp-hidden-only-projects", String(hiddenOnlyProjects));
  syncHiddenFilterControls();
}

function renderProjectList() {
  const visibleProjects = hiddenOnlyProjects ? projects : visibleProjectItems(projects);
  renderProjects(visibleProjects);
  renderCharts(visibleProjects);
}

function visibleProjectItems(items = []) {
  return (items || []).filter((project) => {
    if (hideDiscussedProjects && isDiscussedProject(project)) return false;
    if (hideNotInterestedProjects && isNotInterestedProject(project)) return false;
    if (highlightOnlyProjects && !project.ops?.highlights?.highlighted_by_me && !project.ops?.highlights?.count) return false;
    return true;
  });
}

function isDiscussedProject(project = {}) {
  const status = project.ops?.global_status?.status || "new";
  return status === "discussed" || status === "meeting_selected";
}

function isNotInterestedProject(project = {}) {
  if (project.ops?.dislikes?.disliked_by_me) return true;
  if ((project.ops?.my_marks || []).includes("not_interested")) return true;
  return (project.collaboration?.statuses || []).some(
    (item) => item.actor === currentUser && item.status === "not_interested",
  );
}

function renderFilterOptions(options = {}) {
  renderSelectOptions("#industry", options.industries || []);
  renderSelectOptions("#stage", options.stages || []);
  renderSelectOptions("#country", options.countries || []);
  renderSelectOptions("#customerType", options.customer_types || []);
  renderSelectOptions("#revenueStage", normalizeRevenueStageOptions(options.revenue_stages || []));
  renderSelectOptions("#tag", options.tags || []);
  renderSelectOptions("#recommendation", options.recommendations || levelFilterOptions());
  renderSelectOptions("#riskLevel", options.risk_levels || levelFilterOptions());
}

function renderSelectOptions(selector, options) {
  const select = document.querySelector(selector);
  if (!select) return;
  const previousValue = select.value;
  const normalized = (options || [])
    .map(normalizeFilterOption)
    .filter((option) => option.value);
  select.innerHTML = [
    `<option value="">${escapeHtml(t("any"))}</option>`,
    ...normalized.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`),
  ].join("");
  select.value = normalized.some((option) => option.value === previousValue) ? previousValue : "";
}

function normalizeFilterOption(option) {
  if (option && typeof option === "object") {
    const label = option.label?.[lang] || option.label || option.value;
    return { value: String(option.value || "").trim(), label: String(label || option.value || "").trim() };
  }
  const value = String(option || "").trim();
  return { value, label: value };
}

function normalizeRevenueStageOptions(options = []) {
  const present = new Set();
  for (const option of options || []) {
    const normalized = normalizeFilterOption(option);
    const canonical = normalizeRevenueStageValue(normalized.value) || normalizeRevenueStageValue(normalized.label);
    if (canonical) present.add(canonical);
  }
  return REVENUE_STAGE_DEFINITIONS
    .filter((definition) => present.has(definition.value))
    .map((definition) => ({
      value: definition.value,
      label: definition.label[lang] || definition.label.en,
    }));
}

function normalizeRevenueStageValue(value) {
  const text = normalizeRevenueStageText(value);
  if (!text) return "";
  if (REVENUE_STAGE_BY_VALUE.has(text)) return text;
  if (matchesRevenueAlias(text, REVENUE_STAGE_BY_VALUE.get("unknown").aliases) || text === "-") return "unknown";
  if (matchesRevenueAlias(text, REVENUE_STAGE_BY_VALUE.get("profitable").aliases)) return "profitable";
  if (matchesRevenueAlias(text, REVENUE_STAGE_BY_VALUE.get("scaling_revenue").aliases)) return "scaling_revenue";
  if (matchesRevenueAlias(text, REVENUE_STAGE_BY_VALUE.get("early_revenue").aliases)) return "early_revenue";
  if (matchesRevenueAlias(text, REVENUE_STAGE_BY_VALUE.get("pilot_poc").aliases)) return "pilot_poc";
  if (matchesRevenueAlias(text, REVENUE_STAGE_BY_VALUE.get("no_revenue").aliases)) return "no_revenue";
  if (/营收|收入|revenue/.test(text)) return "early_revenue";
  return "";
}

function normalizeRevenueStageText(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[／\\/]+/g, " / ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesRevenueAlias(text, aliases = []) {
  return aliases.some((alias) => {
    const normalizedAlias = normalizeRevenueStageText(alias);
    return text === normalizedAlias || text.includes(normalizedAlias);
  });
}

function levelFilterOptions() {
  return ["高", "中", "低", "未知"].map((value) => ({
    value,
    label: { en: levelLabel(value, "en"), zh: levelLabel(value, "zh") },
  }));
}

function aiRelatedFilterOptions() {
  return [
    { value: "true", label: { en: t("yes"), zh: t("yes") } },
    { value: "false", label: { en: t("no"), zh: t("no") } },
  ];
}

function levelLabel(value, targetLang = lang) {
  const keyByValue = { 高: "high", 中: "medium", 低: "low", 未知: "unknown" };
  const key = keyByValue[value] || "unknown";
  return labels[targetLang]?.[key] || value;
}

function debounce(callback, delay = 200) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}

async function loadWeightProfiles() {
  const response = await apiFetch("/api/weight/profiles");
  if (!response) return;
  const data = await response.json();
  defaultFactors = data.factors || [];
  factorPools = data.factor_pools || { public: [], personal: [], system: defaultFactors };
  weightProfiles = data.profiles || [];
  if (!selectedFactors.length) {
    const active = weightProfiles.find((profile) => Number(profile.id) === activeWeightProfileId);
    selectedFactors = active?.factors?.length ? active.factors.slice(0, 5) : defaultFactors.slice(0, 5);
  }
  renderFactorBuilder();
  renderProfileBoard();
  renderActiveProfileLabel();
  renderWeightQuickPanel();
}

async function loadScoringProfile() {
  if (!currentUser) return;
  const requestId = ++scoringProfileRequestSeq;
  setScoringProfileState({ phase: "loading" });
  const params = new URLSearchParams({ template: activeScoringTemplate });
  try {
    const response = await apiFetch(`/api/scoring/profile?${params.toString()}`);
    if (!response) return;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `${t("scoringProfileLoadError")} HTTP ${response.status}`);
    }
    if (requestId !== scoringProfileRequestSeq) return;
    scoringProfile = data.profile || null;
    setScoringProfileState({ phase: "idle" });
    renderScoringQueueSummary();
  } catch (error) {
    if (requestId !== scoringProfileRequestSeq) return;
    scoringProfile = null;
    setScoringProfileState({
      phase: "error",
      error: error?.message || t("scoringProfileLoadError"),
    });
    renderScoringQueueSummary();
  }
}

async function loadScoringQueue() {
  if (!currentUser) return;
  const params = new URLSearchParams({ lang, template: activeScoringTemplate });
  const response = await apiFetch(`/api/scoring/queue?${params.toString()}`);
  if (!response) return;
  scoringQueue = await response.json().catch(() => null);
  renderScoringQueueSummary();
}

async function handleScoringTemplateChange() {
  activeScoringTemplate = normalizeScoringTemplateKey(scoringTemplateSelect?.value);
  if (scoringTemplateSelect) scoringTemplateSelect.value = activeScoringTemplate;
  localStorage.setItem("bp-scoring-template", activeScoringTemplate);
  scoringProfile = null;
  scoringProfileState = { phase: "loading", error: "" };
  scoringQueue = null;
  if (scoringDraftStatus) {
    scoringDraftStatus.textContent = t("scoringTemplateSwitched").replace("{template}", templateLabel(activeScoringTemplate));
  }
  if (selectedDocumentId && selectedProject) {
    applyScoreReviewToProject(selectedDocumentId, { draft: null, user_score: null, status: "none" });
  } else {
    renderScoreReviewCard(selectedProject);
  }
  renderWeightQuickPanel();
  renderScoringQueueSummary();
  await Promise.allSettled([
    loadScoringProfile(),
    loadScoringQueue(),
    refreshSelectedScoreReview(),
    loadProjects(),
  ]);
}

function renderFactorBuilder() {
  if (!factorChoices || !selectedFactorList) return;
  const selectedKeys = new Set(selectedFactors.map(factorIdentity));
  const pools = {
    public: factorPools.public || [],
    personal: factorPools.personal || [],
    system: factorPools.system || [],
  };
  if (!pools[activeFactorTab]) activeFactorTab = "public";
  const visiblePool = pools[activeFactorTab] || [];
  const groupedFactors = factorCategoryOrder()
    .map((category) => ({
      category,
      factors: visiblePool.filter((factor) => factorCategoryKey(factor) === category),
    }))
    .filter((group) => group.factors.length);
  factorChoices.innerHTML = groupedFactors
    .map(
      (group) => `
        <section class="factorCategoryGroup">
          <h4>${escapeHtml(factorCategoryLabel(group.category))}</h4>
          <div class="factorCategoryItems">
            ${group.factors
              .map((factor) => {
                const disabled = selectedKeys.has(factorIdentity(factor)) || selectedFactors.length >= 5;
                return factorCard(factor, disabled);
              })
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
  factorChoices.innerHTML = `
    <div class="factorPoolTabs" role="tablist" aria-label="${escapeHtml(t("availableFactors"))}">
      ${factorPoolTab("public", t("publicFactorPool"), pools.public.length)}
      ${factorPoolTab("personal", t("myFactors"), pools.personal.length)}
      ${factorPoolTab("system", t("systemFactors"), pools.system.length)}
    </div>
    ${groupedFactors.length ? factorChoices.innerHTML : `<p class="subtle profileEmpty">${t("noFactors")}</p>`}
  `;
  selectedFactorList.innerHTML = `
    <p class="subtle selectedHint">${t("weightDragHint")}</p>
    ${renderWeightDonut()}
    ${Array.from({ length: 5 }, (_, index) => selectedPrioritySlot(index)).join("")}
  `;
  setupWeightDonutInteractions();
  factorChoices.querySelectorAll("[data-factor-pool-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFactorTab = button.dataset.factorPoolTab || "public";
      localStorage.setItem("bp-factor-pool-tab", activeFactorTab);
      renderFactorBuilder();
    });
  });
  factorChoices.querySelectorAll("[data-factor-token]").forEach((button) => {
    button.addEventListener("click", () => addSelectedFactor(button.dataset.factorToken));
  });
  factorChoices.querySelectorAll("[data-publish-factor]").forEach((button) => {
    button.addEventListener("click", () => publishFactor(Number(button.dataset.publishFactor)));
  });
  factorChoices.querySelectorAll("[data-copy-factor]").forEach((button) => {
    button.addEventListener("click", () => copyFactor(Number(button.dataset.copyFactor)));
  });
  selectedFactorList.querySelectorAll("[data-selected-factor-index]").forEach((slot) => {
    slot.addEventListener("dragstart", handleFactorDragStart);
    slot.addEventListener("dragend", handleFactorDragEnd);
    slot.addEventListener("keydown", handleFactorKeydown);
  });
  selectedFactorList.querySelectorAll("[data-factor-drag-handle]").forEach((handle) => {
    handle.addEventListener("pointerdown", handleFactorPointerDown);
  });
  selectedFactorList.querySelectorAll("[data-drop-factor-index]").forEach((slot) => {
    slot.addEventListener("dragover", handleFactorDragOver);
    slot.addEventListener("dragleave", handleFactorDragLeave);
    slot.addEventListener("drop", handleFactorDrop);
  });
  selectedFactorList.querySelectorAll("[data-remove-factor]").forEach((button) => {
    button.addEventListener("click", () => {
      removeSelectedFactor(Number(button.dataset.removeFactor));
    });
  });
  selectedFactorList.querySelectorAll("[data-move-factor]").forEach((button) => {
    button.addEventListener("click", () => {
      moveSelectedFactor(Number(button.dataset.moveFactor), Number(button.dataset.direction));
    });
  });
  renderWeightQuickPanel();
}

function factorPoolTab(key, label, count) {
  return `
    <button type="button" class="weightBoardTab ${activeFactorTab === key ? "active" : ""}" data-factor-pool-tab="${key}" role="tab" aria-selected="${activeFactorTab === key}" ${buttonAttrs(label)}>
      ${escapeHtml(label)} <span>${count}</span>
    </button>
  `;
}

function factorCard(factor, disabled) {
  const scope = factorScope(factor);
  const isOwner = factor.owner === currentUser;
  const createdAt = factor.created_at ? formatLocalDateTime(factor.created_at) : "";
  return `
    <article class="factorCard ${disabled ? "disabled" : ""}">
      <div class="factorCardTop">
        <span class="factorCategoryTag">${escapeHtml(factorCategoryLabel(factorCategoryKey(factor)))}</span>
        ${factorFrameworkTag(factor)}
        <span class="factorScopeTag ${escapeHtml(scope)}">${escapeHtml(factorScopeLabel(scope))}</span>
      </div>
      <strong>${escapeHtml(factorLabel(factor))}</strong>
      <p>${escapeHtml(factorDescription(factor) || factor.key || "")}</p>
      <div class="factorCreator">
        ${renderAvatar(factor.owner || "VRT Agent", "small")}
        <span>${escapeHtml(userDisplayName(factor.owner || "VRT Agent"))}${createdAt ? ` · ${escapeHtml(createdAt)}` : ""}</span>
      </div>
      <div class="factorCardActions">
        <button type="button" data-factor-token="${escapeHtml(factorIdentity(factor))}" ${buttonAttrs(t("selectFactor"))} ${disabled ? "disabled" : ""}>${iconLabel("check", t("selectFactor"))}</button>
        ${scope === "personal" && isOwner ? `<button type="button" class="secondary" data-publish-factor="${factor.id}" ${buttonAttrs(t("publishFactor"))}>${iconLabel("external", t("publishFactor"))}</button>` : ""}
        ${scope === "public" && !isOwner && factor.id ? `<button type="button" class="secondary" data-copy-factor="${factor.id}" ${buttonAttrs(t("copyFactor"))}>${iconLabel("copy", t("copyFactor"))}</button>` : ""}
      </div>
    </article>
  `;
}

function factorFrameworkTag(factor) {
  const frameworkType = String(factor?.metadata?.framework_type || "").trim();
  if (!frameworkType) return "";
  return `<span class="factorFrameworkTag">${escapeHtml(frameworkType)}</span>`;
}

function selectedPrioritySlot(index) {
  const factor = selectedFactors[index];
  const dropAttrs = `data-drop-factor-index="${index}"`;
  if (!factor) {
    return `
      <div class="selectedFactor empty" ${dropAttrs}>
        <span class="priorityDot">${index + 1}</span>
        <div>
          <strong>${t("emptyPrioritySlot")}</strong>
          <small>${t("factorLimit")}</small>
        </div>
      </div>
    `;
  }
  return `
    <div class="selectedFactor" ${dropAttrs} data-selected-factor-index="${index}" draggable="true" tabindex="0" aria-grabbed="false">
      <span class="factorDragHandle" data-factor-drag-handle="${index}" draggable="true" title="${escapeHtml(t("weightDragHint"))}" aria-hidden="true">${icon("drag")}</span>
      <span class="priorityDot" style="--priority-color: ${escapeHtml(factorColor(index))}">${index + 1}</span>
      <div>
        <strong>${escapeHtml(factorLabel(factor))}</strong>
        <small>${escapeHtml(factorCategoryLabel(factorCategoryKey(factor)))} · ${formatWeight(factor.weight)}%</small>
      </div>
      <div class="priorityControls">
        <button type="button" class="secondary iconButton" data-move-factor="${index}" data-direction="-1" ${buttonAttrs(t("moveUp"))} ${index === 0 ? "disabled" : ""}>${icon("arrowUp")}</button>
        <button type="button" class="secondary iconButton" data-move-factor="${index}" data-direction="1" ${buttonAttrs(t("moveDown"))} ${index >= selectedFactors.length - 1 ? "disabled" : ""}>${icon("arrowDown")}</button>
        <button type="button" class="secondary iconButton dangerIconButton" data-remove-factor="${index}" ${buttonAttrs(t("removeFactor"))}>${icon("close")}</button>
      </div>
    </div>
  `;
}

function addSelectedFactor(token) {
  const factor = [...(factorPools.public || []), ...(factorPools.personal || []), ...(factorPools.system || []), ...defaultFactors].find((item) => factorIdentity(item) === token);
  if (!factor || selectedFactors.length >= 5 || selectedFactors.some((item) => factorIdentity(item) === factorIdentity(factor))) return;
  selectedFactors = withOrderedWeights([...selectedFactors, { ...factor, weight: DEFAULT_FACTOR_WEIGHTS[selectedFactors.length] }]);
  renderFactorBuilder();
  renderWeightQuickPanel();
}

function removeSelectedFactor(index) {
  if (!Number.isInteger(index) || index < 0 || index >= selectedFactors.length) return;
  selectedFactors.splice(index, 1);
  selectedFactors = withOrderedWeights(selectedFactors);
  renderFactorBuilder();
}

function moveSelectedFactor(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= selectedFactors.length) return;
  reorderSelectedFactor(index, targetIndex);
}

function reorderSelectedFactor(fromIndex, toIndex) {
  if (fromIndex < 0 || fromIndex >= selectedFactors.length) return;
  const nextFactors = selectedFactors.slice();
  const slotWeights = normalizedWeights(selectedFactors);
  const [factor] = nextFactors.splice(fromIndex, 1);
  const boundedTarget = Math.max(0, Math.min(toIndex, nextFactors.length));
  nextFactors.splice(boundedTarget, 0, factor);
  selectedFactors = applyWeightsToFactors(nextFactors, slotWeights);
  renderFactorBuilder();
}

function handleFactorDragStart(event) {
  if (event.target.closest("button")) {
    event.preventDefault();
    return;
  }
  draggedFactorIndex = Number(event.currentTarget.dataset.selectedFactorIndex);
  if (!Number.isFinite(draggedFactorIndex)) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggedFactorIndex));
  event.currentTarget.classList.add("dragging");
  event.currentTarget.setAttribute("aria-grabbed", "true");
}

function handleFactorDragEnd(event) {
  draggedFactorIndex = -1;
  event.currentTarget.classList.remove("dragging");
  event.currentTarget.setAttribute("aria-grabbed", "false");
  clearSelectedFactorDropTargets();
}

function handleFactorDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  event.currentTarget.classList.add("dropTarget");
}

function handleFactorDragLeave(event) {
  event.currentTarget.classList.remove("dropTarget");
}

function handleFactorDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("dropTarget");
  const fromIndex = Number(event.dataTransfer.getData("text/plain") || draggedFactorIndex);
  const toIndex = Number(event.currentTarget.dataset.dropFactorIndex);
  if (!Number.isFinite(fromIndex) || !Number.isFinite(toIndex) || fromIndex === toIndex) return;
  reorderSelectedFactor(fromIndex, toIndex);
}

function handleFactorPointerDown(event) {
  if (event.pointerType === "mouse") return;
  const slot = event.currentTarget.closest("[data-selected-factor-index]");
  const fromIndex = Number(slot?.dataset.selectedFactorIndex);
  if (!slot || !Number.isFinite(fromIndex)) return;
  pointerFactorDrag = {
    fromIndex,
    targetIndex: fromIndex,
    pointerId: event.pointerId,
    slot,
    handle: event.currentTarget,
  };
  slot.classList.add("dragging");
  slot.setAttribute("aria-grabbed", "true");
  event.currentTarget.setPointerCapture?.(event.pointerId);
  window.addEventListener("pointermove", handleFactorPointerMove);
  window.addEventListener("pointerup", handleFactorPointerEnd);
  window.addEventListener("pointercancel", handleFactorPointerEnd);
  event.preventDefault();
}

function handleFactorPointerMove(event) {
  if (!pointerFactorDrag || event.pointerId !== pointerFactorDrag.pointerId) return;
  const targetSlot = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-drop-factor-index]");
  clearSelectedFactorDropTargets();
  if (!targetSlot || !selectedFactorList.contains(targetSlot)) return;
  const targetIndex = Number(targetSlot.dataset.dropFactorIndex);
  if (!Number.isFinite(targetIndex)) return;
  pointerFactorDrag.targetIndex = targetIndex;
  if (targetIndex !== pointerFactorDrag.fromIndex) targetSlot.classList.add("dropTarget");
}

function handleFactorPointerEnd(event) {
  if (!pointerFactorDrag || event.pointerId !== pointerFactorDrag.pointerId) return;
  const { fromIndex, targetIndex, slot, handle } = pointerFactorDrag;
  pointerFactorDrag = null;
  slot.classList.remove("dragging");
  slot.setAttribute("aria-grabbed", "false");
  handle.releasePointerCapture?.(event.pointerId);
  window.removeEventListener("pointermove", handleFactorPointerMove);
  window.removeEventListener("pointerup", handleFactorPointerEnd);
  window.removeEventListener("pointercancel", handleFactorPointerEnd);
  clearSelectedFactorDropTargets();
  if (Number.isFinite(targetIndex) && fromIndex !== targetIndex) reorderSelectedFactor(fromIndex, targetIndex);
}

function clearSelectedFactorDropTargets() {
  selectedFactorList?.querySelectorAll(".dropTarget").forEach((slot) => {
    slot.classList.remove("dropTarget");
  });
}

function handleFactorKeydown(event) {
  const index = Number(event.currentTarget.dataset.selectedFactorIndex);
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveSelectedFactor(index, -1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveSelectedFactor(index, 1);
  } else if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    removeSelectedFactor(index);
  }
}

async function generateAiFactors() {
  const prompt = weightPrompt.value.trim();
  if (!prompt) {
    weightPrompt.focus();
    return;
  }
  activeProfileLabel.textContent = t("aiThinking");
  const finishVrtAgentWork = beginVrtAgentWork();
  try {
    const response = await apiFetch("/api/weight/factors/ai", {
      method: "POST",
      body: JSON.stringify({ prompt, lang }),
    });
    if (!response) return;
    const data = await response.json();
    if (data.error) {
      activeProfileLabel.textContent = data.error;
      return;
    }
    selectedFactors = withOrderedWeights(data.factors || []);
    aiGeneratedFactors = selectedFactors.slice();
    if (data.title && !weightProfileTitle.value.trim()) weightProfileTitle.value = data.title;
    activeProfileLabel.textContent = t("generatedByAi");
    renderFactorBuilder();
  } finally {
    finishVrtAgentWork();
  }
}

async function saveAiFactors(scope = "personal") {
  const factors = (aiGeneratedFactors.length ? aiGeneratedFactors : selectedFactors).slice(0, 5);
  if (!factors.length) {
    activeProfileLabel.textContent = t("factorLimit");
    return;
  }
  const saved = [];
  for (const factor of factors) {
    const response = await apiFetch("/api/weight/factors", {
      method: "POST",
      body: JSON.stringify({
        ...factor,
        scope,
        source_prompt: weightPrompt.value.trim(),
      }),
    });
    if (!response) return;
    const data = await response.json();
    if (data.error) {
      activeProfileLabel.textContent = data.error;
      return;
    }
    if (data.factor) saved.push(data.factor);
  }
  if (saved.length) {
    selectedFactors = withOrderedWeights(saved.map((factor, index) => ({ ...factor, weight: factors[index]?.weight || DEFAULT_FACTOR_WEIGHTS[index] })));
    aiGeneratedFactors = [];
  }
  activeFactorTab = scope === "public" ? "public" : "personal";
  localStorage.setItem("bp-factor-pool-tab", activeFactorTab);
  activeProfileLabel.textContent = t("factorSaved");
  await loadWeightProfiles();
}

async function saveWeightProfile() {
  if (selectedFactors.length !== 5) {
    activeProfileLabel.textContent = t("factorLimit");
    return;
  }
  const editingId = Number(weightProfileTitle.dataset.editingProfileId || 0);
  const body = {
    title: weightProfileTitle.value.trim() || (lang === "zh" ? "我的权重方案" : "My weight profile"),
    prompt: weightPrompt.value.trim(),
    factors: withOrderedWeights(selectedFactors),
  };
  const response = await apiFetch(editingId ? `/api/weight/profiles/${editingId}` : "/api/weight/profiles", {
    method: editingId ? "PUT" : "POST",
    body: JSON.stringify(body),
  });
  if (!response) return;
  const data = await response.json();
  if (data.error) {
    activeProfileLabel.textContent = data.error;
    return;
  }
  activeWeightProfileId = Number(data.profile?.id || activeWeightProfileId);
  localStorage.setItem("bp-weight-profile-id", String(activeWeightProfileId));
  weightProfileTitle.dataset.editingProfileId = "";
  document.querySelector("#sortBy").value = "custom_weight";
  activeProfileLabel.textContent = t("profileSaved");
  await loadWeightProfiles();
  await loadProjects();
}

async function applySelectedWeightProfile() {
  if (selectedFactors.length !== 5) {
    activeProfileLabel.textContent = t("factorLimit");
    return;
  }
  await saveWeightProfile();
}

function renderProfileBoard() {
  if (!profileBoard) return;
  const mine = weightProfiles.filter((profile) => profile.owner === currentUser);
  const team = weightProfiles.filter((profile) => profile.owner !== currentUser);
  const activeTab = weightBoardTab === "team" ? "team" : "mine";
  const visibleProfiles = activeTab === "mine" ? mine : team;
  profileBoard.innerHTML = `
    <div class="weightBoardTabs" role="tablist" aria-label="${escapeHtml(t("weightBoard"))}">
      <button type="button" class="weightBoardTab ${activeTab === "mine" ? "active" : ""}" data-weight-tab="mine" role="tab" aria-selected="${activeTab === "mine"}" ${buttonAttrs(t("myWeights"))}>
        ${t("myWeights")} <span>${mine.length}</span>
      </button>
      <button type="button" class="weightBoardTab ${activeTab === "team" ? "active" : ""}" data-weight-tab="team" role="tab" aria-selected="${activeTab === "team"}" ${buttonAttrs(t("teamWeights"))}>
        ${t("teamWeights")} <span>${team.length}</span>
      </button>
    </div>
    <div class="profileGrid">
      ${
        visibleProfiles.length
          ? visibleProfiles.map(profileCard).join("")
          : `<p class="subtle profileEmpty">${activeTab === "mine" ? t("profileEmptyMine") : t("profileEmptyTeam")}</p>`
      }
    </div>
  `;
  profileBoard.querySelectorAll("[data-weight-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      weightBoardTab = button.dataset.weightTab || "mine";
      localStorage.setItem("bp-weight-board-tab", weightBoardTab);
      renderProfileBoard();
    });
  });
  profileBoard.querySelectorAll("[data-apply-profile]").forEach((button) => {
    button.addEventListener("click", () => applyExistingProfile(Number(button.dataset.applyProfile)));
  });
  profileBoard.querySelectorAll("[data-edit-profile]").forEach((button) => {
    button.addEventListener("click", () => editExistingProfile(Number(button.dataset.editProfile)));
  });
  profileBoard.querySelectorAll("[data-copy-profile]").forEach((button) => {
    button.addEventListener("click", () => copyProfile(Number(button.dataset.copyProfile)));
  });
  profileBoard.querySelectorAll("[data-like-profile]").forEach((button) => {
    button.addEventListener("click", () => likeProfile(Number(button.dataset.likeProfile)));
  });
  profileBoard.querySelectorAll("[data-comment-profile]").forEach((button) => {
    button.addEventListener("click", () => commentProfile(Number(button.dataset.commentProfile)));
  });
}

function profileCard(profile) {
  const isOwner = profile.owner === currentUser;
  const factors = profile.factors || [];
  const factorSummary = factors.map((factor, index) => `${index + 1}. ${factorLabel(factor)} ${formatWeight(factor.weight)}%`).join(" / ");
  const prompt = String(profile.prompt || "").trim();
  const comments = profile.comments || [];
  const events = profile.events || [];
  return `
    <article class="profileCard ${Number(profile.id) === activeWeightProfileId ? "active" : ""}">
      <div class="profileMeta">
        <strong>${escapeHtml(profile.title || "")}</strong>
        <span class="profileOwner">${renderAvatar(profile.owner, "small")} ${escapeHtml(userDisplayName(profile.owner))} · ${escapeHtml(profile.updated_at || "")}</span>
      </div>
      <div class="profileStats">
        <span>${icon("thumbsUp", "inlineIcon")} ${t("like")} · ${profile.like_count || 0}</span>
        <span>${icon("comment", "inlineIcon")} ${t("comment")} · ${profile.comment_count || comments.length || 0}</span>
      </div>
      <div class="profileFactorList">${factors.map((factor, index) => `<span class="profileFactor" style="--profile-factor-color: ${escapeHtml(factorColor(index))}" title="${escapeHtml(factorCategoryLabel(factorCategoryKey(factor)))}">${index + 1}. ${escapeHtml(factorLabel(factor))} · ${formatWeight(factor.weight)}%</span>`).join("")}</div>
      <div class="profileActions">
        <button type="button" data-apply-profile="${profile.id}" ${buttonAttrs(t("applyProfile"))}>${iconLabel("check", t("applyProfile"))}</button>
        ${isOwner ? `<button type="button" class="secondary" data-edit-profile="${profile.id}" ${buttonAttrs(t("editProfile"))}>${iconLabel("edit", t("editProfile"))}</button>` : ""}
        <button type="button" class="secondary" data-copy-profile="${profile.id}" ${buttonAttrs(t("copy"))}>${iconLabel("copy", t("copy"))}</button>
        <button type="button" class="${profile.liked_by_me ? "active reactionButton likeButton" : "secondary reactionButton likeButton"}" data-like-profile="${profile.id}" ${buttonAttrs(profile.liked_by_me ? t("unlike") : t("like"))}>${iconLabel("thumbsUp", `${profile.liked_by_me ? t("unlike") : t("like")} · ${profile.like_count || 0}`)}</button>
      </div>
      <details class="profileDetails">
        <summary>${t("profileDetails")}</summary>
        ${prompt ? `<p>${escapeHtml(prompt)}</p>` : `<p>${escapeHtml(factorSummary)}</p>`}
        <div class="comments">
          ${comments.map((comment) => `<p class="commentLine">${renderAvatar(comment.actor, "small")} <span><strong>${escapeHtml(userDisplayName(comment.actor))}:</strong> ${escapeHtml(comment.content)}</span></p>`).join("")}
          <div class="commentBox">
            <input type="text" data-comment-input="${profile.id}" placeholder="${escapeHtml(t("commentPlaceholder"))}" />
            <button type="button" class="secondary" data-comment-profile="${profile.id}" ${buttonAttrs(t("comment"))}>${iconLabel("comment", t("comment"))}</button>
          </div>
        </div>
        ${
          events.length
            ? `<div class="eventLog"><strong>${t("editHistory")}</strong>${events
                .map((event) => `<p>${renderAvatar(event.actor, "tiny")} <span>${escapeHtml(event.created_at || "")} · ${escapeHtml(userDisplayName(event.actor))} ${escapeHtml(event.action || "")}</span></p>`)
                .join("")}</div>`
            : ""
        }
      </details>
    </article>
  `;
}

async function applyExistingProfile(profileId) {
  const profile = weightProfiles.find((item) => Number(item.id) === profileId);
  if (!profile) return;
  activeWeightProfileId = profileId;
  selectedFactors = withOrderedWeights(profile.factors || []);
  localStorage.setItem("bp-weight-profile-id", String(profileId));
  document.querySelector("#sortBy").value = "custom_weight";
  renderFactorBuilder();
  renderActiveProfileLabel();
  renderWeightQuickPanel();
  await loadProjects();
}

function editExistingProfile(profileId) {
  const profile = weightProfiles.find((item) => Number(item.id) === profileId);
  if (!profile || profile.owner !== currentUser) return;
  selectedFactors = withOrderedWeights(profile.factors || []);
  weightProfileTitle.value = profile.title || "";
  weightProfileTitle.dataset.editingProfileId = String(profile.id);
  weightPrompt.value = profile.prompt || "";
  renderFactorBuilder();
  renderActiveProfileLabel();
  renderWeightQuickPanel();
  openWeightEditor();
}

async function copyProfile(profileId) {
  const response = await apiFetch(`/api/weight/profiles/${profileId}/copy`, { method: "POST", body: "{}" });
  if (!response) return;
  const data = await response.json();
  if (data.profile?.id) activeWeightProfileId = Number(data.profile.id);
  localStorage.setItem("bp-weight-profile-id", String(activeWeightProfileId));
  await loadWeightProfiles();
}

async function publishFactor(factorId) {
  const response = await apiFetch(`/api/weight/factors/${factorId}/publish`, { method: "POST", body: "{}" });
  if (!response) return;
  activeFactorTab = "public";
  localStorage.setItem("bp-factor-pool-tab", activeFactorTab);
  await loadWeightProfiles();
}

async function copyFactor(factorId) {
  const response = await apiFetch(`/api/weight/factors/${factorId}/copy`, { method: "POST", body: "{}" });
  if (!response) return;
  activeFactorTab = "personal";
  localStorage.setItem("bp-factor-pool-tab", activeFactorTab);
  await loadWeightProfiles();
}

async function likeProfile(profileId) {
  const response = await apiFetch(`/api/weight/profiles/${profileId}/like`, { method: "POST", body: "{}" });
  if (!response) return;
  await loadWeightProfiles();
}

async function commentProfile(profileId) {
  const input = profileBoard.querySelector(`[data-comment-input="${profileId}"]`);
  const content = input?.value.trim();
  if (!content) return;
  const response = await apiFetch(`/api/weight/profiles/${profileId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!response) return;
  input.value = "";
  await loadWeightProfiles();
}

function renderActiveProfileLabel() {
  if (!activeProfileLabel) return;
  const profile = weightProfiles.find((item) => Number(item.id) === activeWeightProfileId);
  activeProfileLabel.textContent = profile ? `${t("activeProfile")}: ${profile.title}` : t("noActiveProfile");
}

function renderWeightQuickPanel() {
  const profile = weightProfiles.find((item) => Number(item.id) === activeWeightProfileId);
  if (activeWeightSummary) {
    const factors = (profile?.factors?.length ? profile.factors : selectedFactors).slice(0, 5);
    const learnedCount = Number(scoringProfile?.learned_from_count || 0);
    const lastUpdated = formatLocalDateTime(scoringProfile?.last_updated_at || profile?.updated_at || "");
    const weightSummary = scoringProfile?.weight_summary?.text || factors.slice(0, 3).map((factor) => `${factorLabel(factor)} ${formatWeight(factor.weight)}%`).join(" / ");
    if (scoringProfileState.phase === "loading") {
      activeWeightSummary.innerHTML = `
        <div class="activeWeightStatus loading" role="status" aria-live="polite">
          <span class="projectLoadingSpinner" aria-hidden="true"></span>
          <strong>${escapeHtml(t("scoringProfileLoading"))}</strong>
        </div>
      `;
    } else if (scoringProfileState.phase === "error") {
      activeWeightSummary.innerHTML = `
        <div class="activeWeightStatus error" role="alert">
          <strong>${escapeHtml(t("scoringProfileLoadError"))}</strong>
          <span>${escapeHtml(scoringProfileState.error || t("scoringProfileLoadError"))}</span>
          <button type="button" class="secondary compactButton" data-scoring-profile-retry>${escapeHtml(t("retry"))}</button>
        </div>
      `;
    } else if (weightSummary || factors.length) {
      activeWeightSummary.innerHTML = `
        <div class="activeWeightHeader">
          <strong>${escapeHtml(userDisplayName(currentUser))}</strong>
          <small>${escapeHtml(t("currentTemplate"))}: ${escapeHtml(templateLabel(activeScoringTemplate))}</small>
        </div>
        <div class="scoringProfileMeta">
          ${weightSummary ? `<span>${escapeHtml(t("currentWeightSummary"))}: ${escapeHtml(weightSummary)}</span>` : ""}
          ${learnedCount > 0 ? `<span>${escapeHtml(t("learnedFrom").replace("{count}", String(learnedCount)))}</span>` : ""}
          ${lastUpdated ? `<span>${escapeHtml(t("lastUpdated"))}: ${escapeHtml(lastUpdated)}</span>` : ""}
        </div>
        <div class="profileFactorList compact">
          ${factors
            .map((factor, index) => `<span class="profileFactor" style="--profile-factor-color: ${escapeHtml(factorColor(index))}">${index + 1}. ${escapeHtml(factorLabel(factor))} · ${formatWeight(factor.weight)}%</span>`)
            .join("")}
        </div>
      `;
    } else {
      activeWeightSummary.innerHTML = `
        <div class="activeWeightStatus empty">
          <strong>${escapeHtml(t("currentTemplate"))}: ${escapeHtml(templateLabel(activeScoringTemplate))}</strong>
          <span>${escapeHtml(t("scoringProfileEmpty"))}</span>
        </div>
      `;
    }
    activeWeightSummary.querySelector("[data-scoring-profile-retry]")?.addEventListener("click", loadScoringProfile);
  }
  if (!quickProfileSwitch) return;
  const mine = weightProfiles.filter((item) => item.owner === currentUser).slice(0, 4);
  const team = weightProfiles.filter((item) => item.owner !== currentUser).slice(0, 2);
  const quickProfiles = [...mine, ...team].filter((item, index, list) => list.findIndex((candidate) => Number(candidate.id) === Number(item.id)) === index);
  quickProfileSwitch.innerHTML = quickProfiles.length
    ? `
      <span>${t("quickSwitchWeights")}</span>
      <div>
        ${quickProfiles
          .map(
            (item) => `
              <button type="button" class="quickProfileButton ${Number(item.id) === activeWeightProfileId ? "active" : ""}" data-quick-profile-id="${item.id}">
                ${escapeHtml(item.title || t("weightTitle"))}
              </button>
            `,
          )
          .join("")}
      </div>
    `
    : `<p class="subtle">${t("profileEmptyMine")}</p>`;
  quickProfileSwitch.querySelectorAll("[data-quick-profile-id]").forEach((button) => {
    button.addEventListener("click", () => applyExistingProfile(Number(button.dataset.quickProfileId)));
  });
}

function renderScoringQueueSummary() {
  const stats = scoringQueue?.stats || scoringProfile || {};
  const draftCount = Number(stats.drafts_waiting || 0);
  const firstDraft = scoringQueue?.drafts?.[0] || null;
  if (scoringProfileOpenButton) {
    if (draftCount > 0) scoringProfileOpenButton.dataset.badge = String(draftCount);
    else delete scoringProfileOpenButton.dataset.badge;
  }
  if (reviewPendingDraftsButton) {
    reviewPendingDraftsButton.disabled = draftCount <= 0;
    reviewPendingDraftsButton.innerHTML = iconLabel("chevronRight", draftCount > 0 ? `${t("reviewNextDraft")} · ${draftCount} ${t("draftsShort")}` : t("noDraftsShort"));
    reviewPendingDraftsButton.title = firstDraft?.label
      ? t("nextPendingDraft").replace("{project}", firstDraft.label)
      : t("noDraftsForTemplate");
  }
  if (generateDraftScoresButton) {
    generateDraftScoresButton.disabled = !selectedDocumentId;
    generateDraftScoresButton.title = selectedDocumentId ? t("generateDraftScores") : t("selectProjectHint");
  }
  if (!scoringQueueSummary) return;
  const draftStatus = draftCount > 0
    ? t("pendingDraftCount").replace("{count}", String(draftCount))
    : t("noDraftsForTemplate");
  scoringQueueSummary.innerHTML = `
    <div class="queueMetric templateMetric"><strong>${escapeHtml(templateLabel(activeScoringTemplate))}</strong><span>${escapeHtml(t("currentTemplate"))}</span></div>
    ${
      firstDraft?.label
        ? `<div class="queueMetric nextDraft"><strong>${escapeHtml(String(firstDraft.draft_score ?? "-"))}</strong><span>${escapeHtml(`${draftStatus} · ${t("nextShort")}: ${firstDraft.label}`)}</span></div>`
        : `<div class="queueMetric nextDraft empty"><strong>${escapeHtml(t("noDraftsShort"))}</strong><span>${escapeHtml(draftStatus)}</span></div>`
    }
  `;
}

function templateLabel(key) {
  const templateKey = normalizeScoringTemplateKey(key);
  const labelsByKey = {
    type_a: t("templateTypeA"),
    type_b: t("templateTypeB"),
    type_c: t("templateTypeC"),
    my_custom: t("templateMyCustom"),
  };
  return labelsByKey[templateKey] || labelsByKey.type_a;
}

function normalizeScoringTemplateKey(value) {
  const key = String(value || "type_a").trim().toLowerCase().replace(/\s+/g, "_");
  return ["type_a", "type_b", "type_c", "my_custom"].includes(key) ? key : "type_a";
}

async function loadReviewBoard(options = {}) {
  if (!currentUser || !teamMembers.includes(currentUser)) return;
  const includeLeaderboards = options.includeLeaderboards !== false;
  const params = new URLSearchParams({
    lang,
    timezone: userTimezone,
    locale: currentLocale(),
    leaderboards: includeLeaderboards ? "1" : "0",
  });
  const response = await apiFetch(`/api/review/board?${params.toString()}`);
  if (!response) return;
  const data = await response.json();
  reviewBoard = {
    ...data,
    leaderboards: data.leaderboards || reviewBoard?.leaderboards || null,
  };
  renderReviewBoard();
}

function renderReviewBoard() {
  if (!shortlistBoard || !nominationBoard || !calendarBoard) return;
  if (!reviewBoard) {
    shortlistBoard.innerHTML = `<p class="subtle">${t("noShortlist")}</p>`;
    nominationBoard.innerHTML = `<p class="subtle">${t("noNominations")}</p>`;
    calendarBoard.innerHTML = `<p class="subtle">${t("noCalendar")}</p>`;
    renderBpLeaderboards(null);
    renderWeeklyNominationSpotlight([]);
    return;
  }
  if (reviewWeekLabel) {
    reviewWeekLabel.textContent = [t("calendarLocalTimeNotice"), reviewBoard.week_start].filter(Boolean).join(" · ");
  }
  renderBpLeaderboards(reviewBoard.leaderboards || {});
  const shortlist = reviewBoard.shortlist || [];
  shortlistBoard.innerHTML = `
    <h3>${t("personalRepository")}</h3>
    ${shortlist.length ? shortlist.map((item) => opsProjectLine(item.project, `${item.position || ""}`)).join("") : `<p class="subtle">${t("noShortlist")}</p>`}
  `;
  const nominations = reviewBoard.nominations || [];
  nominationBoard.innerHTML = `
    <h3>${t("weeklyNominations")}</h3>
    ${nominations.length ? nominations.map(nominationLine).join("") : `<p class="subtle">${t("noNominations")}</p>`}
  `;
  renderWeeklyNominationSpotlight(nominations);
  const calendar = reviewBoard.calendar || [];
  renderCalendarBoard(calendar);
  document.querySelectorAll("[data-board-project-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.boardProjectId));
  });
  document.querySelectorAll("[data-nomination-vote]").forEach((button) => {
    button.addEventListener("click", () => voteNomination(button.dataset.nominationVote, button.dataset.nominationId));
  });
  weeklyNominationSpotlight?.querySelectorAll("[data-weekly-project-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.weeklyProjectId));
  });
  weeklyNominationSpotlight?.querySelector("[data-nominate-selected]")?.addEventListener("click", () => nominateProject(selectedDocumentId));
  bpLeaderboardSpotlight?.querySelectorAll("[data-leaderboard-project-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.leaderboardProjectId));
  });
}

function renderBpLeaderboards(leaderboards) {
  if (!bpLeaderboardSpotlight) return;
  if (!leaderboards && !projects.length && projectListState.phase === "loading") {
    bpLeaderboardSpotlight.innerHTML = overviewLoadingBlock("overviewLoading");
    return;
  }
  if (!leaderboards && !projects.length && projectListState.phase === "error") {
    bpLeaderboardSpotlight.innerHTML = overviewErrorBlock(projectListState.error);
    bpLeaderboardSpotlight.querySelector("[data-overview-retry]")?.addEventListener("click", loadProjects);
    return;
  }
  const topLiked = leaderboards?.top_liked_projects || [];
  const topDisliked = leaderboards?.top_disliked_projects || [];
  const viewerCounts = leaderboards?.viewer_counts || [];
  const hasData = topLiked.length || topDisliked.length || viewerCounts.some((item) => Number(item.count || 0) > 0);
  bpLeaderboardSpotlight.innerHTML = hasData
    ? `
      <div class="bpLeaderboardGrid compactLeaderboardGrid">
        ${leaderboardProjectSummaryCard(t("leaderboardTopLikedCompact"), "thumbsUp", topLiked)}
        ${leaderboardProjectSummaryCard(t("leaderboardTopDislikedCompact"), "thumbsDown", topDisliked)}
        ${viewerCountsSummaryCard(viewerCounts)}
      </div>
    `
    : `<p class="subtle">${t("noLeaderboardData")}</p>`;
}

function leaderboardProjectSummaryCard(title, iconName, rows = []) {
  const row = rows[0] || null;
  if (!row) {
    return `
      <section class="bpLeaderboardCard empty" ${buttonAttrs(`${title}: ${t("noLeaderboardData")}`)}>
        <strong>${icon(iconName, "inlineIcon")} ${escapeHtml(title)}</strong>
        <span class="bpLeaderboardCardValue">-</span>
        <small>${escapeHtml(t("noLeaderboardData"))}</small>
      </section>
    `;
  }
  const project = row.project || {};
  const projectName = project.project_name || project.company_name || t("unknown");
  const actors = sortTeamActors(row.actors || []);
  const score = Number(row.count || actors.length || 0);
  const tooltipRows = rows
    .slice(0, 5)
    .map((item) => {
      const rowProject = item.project || {};
      const rowName = rowProject.project_name || rowProject.company_name || t("unknown");
      const rowActors = sortTeamActors(item.actors || []);
      return `${rowName}: ${Number(item.count || rowActors.length || 0)}${rowActors.length ? ` (${rowActors.map(userDisplayName).join(", ")})` : ""}`;
    })
    .join("\n");
  return `
    <button type="button" class="bpLeaderboardCard" data-leaderboard-project-id="${project.document_id}" ${buttonAttrs(`${title}: ${tooltipRows || projectName}`)}>
      <strong>${icon(iconName, "inlineIcon")} ${escapeHtml(title)}</strong>
      <span class="bpLeaderboardCardMain">
        <span>${escapeHtml(projectName)}</span>
        <b>${icon(iconName, "reactionIcon")} ${score}</b>
      </span>
      <small>${actors.length ? actors.slice(0, 5).map(userInitials).join(" · ") : "-"}</small>
    </button>
  `;
}

function viewerCountsSummaryCard(rows = []) {
  const visibleRows = rows.filter((item) => Number(item.count || 0) > 0);
  const totalViews = visibleRows.reduce((total, item) => total + Number(item.count || 0), 0);
  const topViewer = visibleRows[0] || null;
  const actor = topViewer?.actor || topViewer?.member?.name || "";
  const tooltipRows = visibleRows
    .slice(0, 5)
    .map((item) => `${userDisplayName(item.actor || item.member?.name || "")}: ${Number(item.count || 0)}`)
    .join("\n");
  return `
    <section class="bpLeaderboardCard bpViewsCard ${topViewer ? "" : "empty"}" ${buttonAttrs(`${t("leaderboardViewsCompact")}: ${tooltipRows || t("noLeaderboardData")}`)}>
      <strong>${icon("search", "inlineIcon")} ${escapeHtml(t("leaderboardViewsCompact"))}</strong>
      <span class="bpLeaderboardCardMain">
        <span>${topViewer ? escapeHtml(userDisplayName(actor)) : "-"}</span>
        <b>${totalViews}</b>
      </span>
      <small>${topViewer ? escapeHtml(t("viewsCount").replace("{count}", String(Number(topViewer.count || 0)))) : escapeHtml(t("noLeaderboardData"))}</small>
    </section>
  `;
}

function leaderboardProjectColumn(title, iconName, rows = []) {
  return `
    <section class="bpLeaderboardColumn">
      <h3>${icon(iconName, "inlineIcon")} ${escapeHtml(title)}</h3>
      <div class="bpLeaderboardList">
        ${rows.length ? rows.map((row) => leaderboardProjectButton(row, iconName)).join("") : `<p class="subtle">${t("noLeaderboardData")}</p>`}
      </div>
    </section>
  `;
}

function leaderboardProjectButton(row, iconName) {
  const project = row.project || {};
  const projectName = project.project_name || project.company_name || t("unknown");
  const actors = sortTeamActors(row.actors || []);
  return `
    <button type="button" class="bpLeaderboardProject" data-leaderboard-project-id="${project.document_id}" ${buttonAttrs(t("view"))}>
      <span class="bpLeaderboardProjectMain">
        <strong>${escapeHtml(projectName)}</strong>
        <small>${escapeHtml(project.industry || project.recommendation || "")}</small>
      </span>
      <span class="bpLeaderboardScore">${icon(iconName, "reactionIcon")} <strong>${Number(row.count || actors.length || 0)}</strong></span>
      <span class="likeActors bpLeaderboardActors">
        ${actors.length ? actors.slice(0, 5).map((actor) => renderAvatar(actor, "tiny")).join("") : `<span class="subtle">-</span>`}
      </span>
    </button>
  `;
}

function viewerCountsColumn(rows = []) {
  return `
    <section class="bpLeaderboardColumn bpViewerColumn">
      <h3>${icon("search", "inlineIcon")} ${escapeHtml(t("bpViewStats"))}</h3>
      <div class="bpViewerList">
        ${rows.slice(0, 5).map(viewerCountRow).join("")}
      </div>
    </section>
  `;
}

function viewerCountRow(item) {
  const actor = item.actor || item.member?.name || "";
  const count = Number(item.count || 0);
  return `
    <div class="bpViewerRow">
      ${renderAvatar(actor, "small", item.member)}
      <span>
        <strong>${escapeHtml(userDisplayName(actor))}</strong>
        <small>${escapeHtml(t("viewsCount").replace("{count}", String(count)))}</small>
      </span>
    </div>
  `;
}

function opsProjectLine(project, prefix = "") {
  return `
    <article class="opsLine">
      <button type="button" data-board-project-id="${project.document_id}">
        ${prefix ? `<span>${escapeHtml(prefix)}</span>` : ""}
        <strong>${escapeHtml(project.project_name || project.company_name || t("unknown"))}</strong>
        <small>${escapeHtml(project.industry || "")} · ${t("screeningScore")} ${Number(project.screening_score || 0)}</small>
      </button>
    </article>
  `;
}

function nominationLine(item) {
  const project = item.project || {};
  const supportLabel = `${t("voteSupport")} · ${item.votes?.support || 0}`;
  const opposeLabel = `${t("voteOppose")} · ${item.votes?.oppose || 0}`;
  return `
    <article class="opsLine nominationLine">
      <button type="button" data-board-project-id="${project.document_id}" ${buttonAttrs(t("view"))}>
        <strong>${escapeHtml(project.project_name || project.company_name || t("unknown"))}</strong>
        <small>${t("nominatedBy")} ${escapeHtml(userDisplayName(item.nominator))}</small>
      </button>
      <div class="miniVotes">
        <button type="button" class="${item.votes?.my_vote === "support" ? "active reactionButton likeButton" : "secondary reactionButton likeButton"}" data-nomination-id="${item.id}" data-nomination-vote="support" ${buttonAttrs(supportLabel)}>${iconLabel("thumbsUp", String(item.votes?.support || 0))}</button>
        <button type="button" class="${item.votes?.my_vote === "oppose" ? "active reactionButton dislikeButton" : "secondary reactionButton dislikeButton"}" data-nomination-id="${item.id}" data-nomination-vote="oppose" ${buttonAttrs(opposeLabel)}>${iconLabel("thumbsDown", String(item.votes?.oppose || 0))}</button>
      </div>
    </article>
  `;
}

function renderWeeklyNominationSpotlight(nominations = []) {
  if (!weeklyNominationSpotlight) return;
  const rowsByUser = new Map(teamMembers.map((member) => [member, []]));
  for (const item of nominations) {
    const nominator = item.nominator || "";
    if (!rowsByUser.has(nominator)) continue;
    const rows = rowsByUser.get(nominator);
    if (rows.length < 1) rows.push(item);
  }
  weeklyNominationSpotlight.innerHTML = `
    <div class="weeklyNominationGrid">
      ${teamUserMeta.map((member) => weeklyNominationMemberCard(member, rowsByUser.get(member.name) || [])).join("")}
    </div>
  `;
  weeklyNominationSpotlight.querySelectorAll("[data-weekly-open]").forEach((button) => {
    button.addEventListener("click", openCalendarDialog);
  });
}

function weeklyNominationMemberCard(member, nominations = []) {
  const item = nominations[0] || null;
  const project = item?.project || {};
  const projectName = project.project_name || project.company_name || "";
  const statusLabel = projectName || "-";
  const tooltipLabel = projectName || "None";
  return `
    <button type="button" class="weeklyNominationMember ${item ? "nominated" : "empty"}" data-weekly-open ${buttonAttrs(`${member.displayName}: ${tooltipLabel}`)}>
      <span class="weeklyNominationPerson">
        ${renderAvatar(member.name, "large")}
        <strong>${escapeHtml(userInitials(member.name))}</strong>
      </span>
      <span class="weeklyNominationStatus">${escapeHtml(statusLabel)}</span>
    </button>
  `;
}

function weeklyNominationProjectButton(item) {
  const project = item.project || {};
  const projectName = project.project_name || project.company_name || t("unknown");
  return `
    <button type="button" class="weeklyNominationProject" data-weekly-project-id="${project.document_id}" ${buttonAttrs(t("view"))}>
      <span>${escapeHtml(projectName)}</span>
      <small>${escapeHtml(project.industry || project.recommendation || "")}</small>
    </button>
  `;
}

function renderCalendarBoard(calendar) {
  if (!calendarBoard) return;
  const events = (calendar || []).map(normalizeCalendarEvent);
  const eventMap = groupCalendarEvents(events);
  const days = calendarGridDays(events);
  const selectedEvents = expandedCalendarDate ? eventMap.get(expandedCalendarDate) || [] : [];
  const selectedLabel = expandedCalendarDate ? formatCalendarDateLabel(expandedCalendarDate) : "";
  const toggleLabel = calendarExpanded ? t("calendarCollapse") : t("calendarExpand");
  calendarBoard.innerHTML = `
    <section class="calendarShell ${calendarExpanded ? "expanded" : "collapsed"}">
      <button type="button" class="calendarToggle" data-calendar-toggle aria-expanded="${calendarExpanded}" ${buttonAttrs(toggleLabel)}>
        <span>
          <strong>${t("calendarReview")}</strong>
          <small>${t("calendarLocalTimeNotice")} · ${t("timezoneLabel")}: ${escapeHtml(userTimezone)}</small>
        </span>
        <span class="calendarToggleMeta">
          <span>${events.length} ${t("eventCount")}</span>
          <span>${icon(calendarExpanded ? "chevronDown" : "chevronRight", "inlineIcon")} ${toggleLabel}</span>
        </span>
      </button>
      ${
        calendarExpanded
          ? `
            <div class="calendarWeekdays" aria-hidden="true">
              ${calendarWeekdayLabels().map((day) => `<span>${escapeHtml(day)}</span>`).join("")}
            </div>
            <div class="calendarGrid" role="grid" aria-label="${escapeHtml(t("calendarReview"))}">
              ${days.map((day) => calendarDayCell(day, eventMap)).join("")}
            </div>
            <div class="calendarDayDetails">
              ${
                selectedEvents.length
                  ? `<h4>${t("eventsOnDate")} · ${escapeHtml(selectedLabel)}</h4>${selectedEvents.map(calendarLine).join("")}`
                  : `<p class="subtle">${events.length ? t("calendarCollapsedHint") : t("noCalendar")}</p>`
              }
            </div>
          `
          : `<p class="subtle calendarCollapsedHint">${t("calendarCollapsedHint")}</p>`
      }
    </section>
  `;
  calendarBoard.querySelector("[data-calendar-toggle]")?.addEventListener("click", () => {
    calendarExpanded = !calendarExpanded;
    localStorage.setItem("bp-calendar-expanded", String(calendarExpanded));
    renderCalendarBoard(calendar);
  });
  calendarBoard.querySelectorAll("[data-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      const dateKey = button.dataset.calendarDate || "";
      expandedCalendarDate = expandedCalendarDate === dateKey ? "" : dateKey;
      renderCalendarBoard(calendar);
    });
  });
  calendarBoard.querySelectorAll("[data-calendar-project-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.calendarProjectId));
  });
}

function calendarDayCell(day, eventMap) {
  const events = eventMap.get(day.key) || [];
  const isSelected = expandedCalendarDate === day.key;
  const isToday = day.key === localDateKey(new Date());
  return `
    <button type="button" class="calendarDay ${events.length ? "hasEvents" : ""} ${isSelected ? "active" : ""} ${isToday ? "today" : ""}" data-calendar-date="${escapeHtml(day.key)}" role="gridcell" ${buttonAttrs(formatCalendarDateLabel(day.key))}>
      <span class="calendarDateNumber">${day.label}</span>
      <span class="calendarDateText">${escapeHtml(day.monthLabel)}</span>
      ${events.length ? `<span class="calendarEventCount">${events.length}</span>` : ""}
      <span class="calendarDaySummary">${escapeHtml(calendarDaySummary(events))}</span>
    </button>
  `;
}

function calendarLine(item) {
  const createdAt = item.created_at || item.updated_at || "";
  return `
    <article class="opsLine calendarLine">
      <button type="button" ${item.document_id ? `data-calendar-project-id="${item.document_id}"` : ""}>
        <strong>${escapeHtml(eventTypeLabel(item.type))} · ${escapeHtml(item.project_name || item.title || t("unknown"))}</strong>
        <small>${escapeHtml(item.project_name || item.title || "")}</small>
        ${item.summary ? `<small>${escapeHtml(item.summary)}</small>` : ""}
        ${
          createdAt
            ? `<small>${t("localTime")}: ${escapeHtml(formatLocalDateTime(createdAt))} · ${t("utcTime")}: ${escapeHtml(formatUtcDateTime(createdAt))}</small>`
            : `<small>${escapeHtml(item.event_date || "")}</small>`
        }
      </button>
    </article>
  `;
}

function normalizeCalendarEvent(item) {
  return {
    ...item,
    local_date: calendarEventDateKey(item),
  };
}

function groupCalendarEvents(events) {
  const map = new Map();
  for (const event of events) {
    const key = event.local_date || event.event_date || localDateKey(new Date());
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(event);
  }
  for (const rows of map.values()) {
    rows.sort((a, b) => String(b.created_at || b.event_date || "").localeCompare(String(a.created_at || a.event_date || "")));
  }
  return map;
}

function calendarGridDays(events) {
  const today = parseDateKey(localDateKey(new Date()));
  const eventDates = events.map((event) => parseDateKey(event.local_date || event.event_date)).filter(Boolean);
  const latestEvent = eventDates.length ? eventDates.sort((a, b) => b - a)[0] : null;
  const reference = latestEvent && latestEvent > today ? latestEvent : today;
  const start = startOfWeek(addDays(reference, -28));
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const key = dateKeyFromUtcDate(date);
    return {
      key,
      label: String(Number(key.slice(8, 10))),
      monthLabel: formatCalendarMonthLabel(key),
    };
  });
}

function calendarWeekdayLabels() {
  const monday = new Date(Date.UTC(2024, 0, 1, 12));
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(currentLocale(), { weekday: "short", timeZone: "UTC" }).format(addDays(monday, index)),
  );
}

function calendarDaySummary(events) {
  if (!events.length) return "";
  const [event] = events;
  const label = event.project_name || event.title || eventTypeLabel(event.type);
  return events.length > 1 ? `${label} +${events.length - 1}` : label;
}

function calendarEventDateKey(item) {
  const parsed = parseUtcTimestamp(item.created_at || item.updated_at || "");
  if (parsed) return localDateKey(parsed);
  return String(item.event_date || "");
}

async function voteNomination(vote, nominationId) {
  const response = await apiFetch(`/api/nominations/${nominationId}/vote`, {
    method: "POST",
    body: JSON.stringify({ vote }),
  });
  if (!response) return;
  await loadReviewBoard();
}

function statusLabelForProject(status) {
  const labelsByStatus = {
    new: t("statusNew"),
    discussed: t("statusDiscussed"),
    eliminated: t("statusEliminated"),
    watching: t("statusWatching"),
    meeting_selected: t("statusMeetingSelected"),
  };
  return labelsByStatus[status] || t("statusNew");
}

function eventTypeLabel(type) {
  const labelsByType = {
    status: t("globalStatus"),
    nomination: t("weeklyNominations"),
    meeting: t("calendarReview"),
  };
  return labelsByType[type] || type || t("calendarReview");
}

function withOrderedWeights(factors) {
  const source = (factors || []).slice(0, 5);
  const weights = source.map((factor, index) => {
    const weight = Number(factor.weight);
    return Number.isFinite(weight) && weight > 0 ? weight : DEFAULT_FACTOR_WEIGHTS[index] || 1;
  });
  return applyWeightsToFactors(source, normalizeWeights(weights));
}

function applyWeightsToFactors(factors, weights) {
  const normalized = normalizeWeights(weights);
  return (factors || []).slice(0, 5).map((factor, index) => ({
    ...factor,
    weight: normalized[index] || 0,
  }));
}

function normalizedWeights(factors) {
  return normalizeWeights((factors || []).map((factor, index) => Number(factor.weight || DEFAULT_FACTOR_WEIGHTS[index] || 1)));
}

function normalizeWeights(weights) {
  const source = (weights || []).map((weight) => Math.max(0, Number(weight) || 0));
  if (!source.length) return [];
  const sum = source.reduce((total, weight) => total + weight, 0);
  const scaled = sum > 0 ? source.map((weight) => (weight / sum) * 100) : source.map((_, index) => DEFAULT_FACTOR_WEIGHTS[index] || 1);
  const rounded = scaled.map((weight) => Math.max(1, Math.round(weight)));
  let delta = 100 - rounded.reduce((total, weight) => total + weight, 0);
  let index = 0;
  while (delta !== 0 && rounded.length) {
    const direction = delta > 0 ? 1 : -1;
    const next = rounded[index] + direction;
    if (next >= 1) {
      rounded[index] = next;
      delta -= direction;
    }
    index = (index + 1) % rounded.length;
  }
  return rounded;
}

function renderWeightDonut() {
  if (selectedFactors.length < 2) {
    return `
      <section class="weightDonutCard">
        <div class="weightDonutHeader">
          <strong>${t("weightChartTitle")}</strong>
          <span>${t("weightChartEmpty")}</span>
        </div>
      </section>
    `;
  }
  const factors = withOrderedWeights(selectedFactors);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  let boundaryPercent = 0;
  const segments = factors
    .map((factor, index) => {
      const weight = Number(factor.weight || 0);
      const dash = (weight / 100) * circumference;
      const segment = `
        <circle
          class="weightDonutSegment"
          cx="100"
          cy="100"
          r="${radius}"
          stroke="${escapeHtml(factorColor(index))}"
          stroke-dasharray="${dash} ${circumference - dash}"
          stroke-dashoffset="${-offset}"
          pathLength="${circumference}"
        >
          <title>${escapeHtml(factorLabel(factor))}: ${formatWeight(weight)}%</title>
        </circle>
      `;
      offset += dash;
      return segment;
    })
    .join("");
  const handles = factors
    .slice(0, -1)
    .map((factor, index) => {
      boundaryPercent += Number(factor.weight || 0);
      const point = donutPoint(boundaryPercent);
      return `
        <circle
          class="weightDonutHandle"
          cx="${point.x}"
          cy="${point.y}"
          r="7"
          data-weight-boundary="${index}"
          tabindex="0"
          role="slider"
          aria-label="${escapeHtml(`${factorLabel(factor)} ${formatWeight(factor.weight)}%`)}"
        ></circle>
      `;
    })
    .join("");
  return `
    <section class="weightDonutCard" id="weightDonutChart">
      <div class="weightDonutHeader">
        <strong>${t("weightChartTitle")}</strong>
        <span>${t("weightChartHint")}</span>
      </div>
      <div class="weightDonutLayout">
        <svg class="weightDonutSvg" viewBox="0 0 200 200" aria-label="${escapeHtml(t("weightChartTitle"))}">
          <circle class="weightDonutTrack" cx="100" cy="100" r="${radius}"></circle>
          <g transform="rotate(-90 100 100)">${segments}</g>
          ${handles}
          <circle class="weightDonutHole" cx="100" cy="100" r="46"></circle>
          <text class="weightDonutCenter" x="100" y="96">${factors.length}</text>
          <text class="weightDonutCenterSub" x="100" y="115">100%</text>
        </svg>
        <div class="weightDonutLegend">
          ${factors
            .map(
              (factor, index) => `
                <label class="weightSliderRow">
                  <span style="--weight-color: ${escapeHtml(factorColor(index))}">
                    <i></i>
                    ${escapeHtml(factorLabel(factor))}
                  </span>
                  <input type="range" min="${MIN_FACTOR_WEIGHT}" max="${100 - MIN_FACTOR_WEIGHT * (factors.length - 1)}" value="${formatWeight(factor.weight)}" data-weight-slider="${index}" />
                  <strong>${formatWeight(factor.weight)}%</strong>
                </label>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function setupWeightDonutInteractions() {
  const chart = selectedFactorList?.querySelector("#weightDonutChart");
  if (!chart) return;
  const svg = chart.querySelector(".weightDonutSvg");
  let activeBoundary = -1;
  const moveActiveBoundary = (event) => {
    if (activeBoundary >= 0) updateBoundaryWeight(event, svg, activeBoundary);
  };
  const stopActiveBoundary = () => {
    activeBoundary = -1;
    window.removeEventListener("pointermove", moveActiveBoundary);
    window.removeEventListener("pointerup", stopActiveBoundary);
    window.removeEventListener("pointercancel", stopActiveBoundary);
  };
  chart.querySelectorAll("[data-weight-boundary]").forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      activeBoundary = Number(handle.dataset.weightBoundary);
      handle.classList.add("dragging");
      window.addEventListener("pointermove", moveActiveBoundary);
      window.addEventListener("pointerup", stopActiveBoundary);
      window.addEventListener("pointercancel", stopActiveBoundary);
      updateBoundaryWeight(event, svg, activeBoundary);
    });
    handle.addEventListener("keydown", (event) => {
      const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      nudgeBoundaryWeight(Number(handle.dataset.weightBoundary), direction * 2);
    });
  });
  chart.querySelectorAll("[data-weight-slider]").forEach((slider) => {
    slider.addEventListener("input", () => {
      setSingleFactorWeight(Number(slider.dataset.weightSlider), Number(slider.value));
    });
  });
}

function updateBoundaryWeight(event, svg, boundaryIndex) {
  if (!svg || boundaryIndex < 0 || boundaryIndex >= selectedFactors.length - 1) return;
  const rect = svg.getBoundingClientRect();
  const percent = anglePercent(event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2);
  const weights = normalizedWeights(selectedFactors);
  const before = weights.slice(0, boundaryIndex).reduce((sum, weight) => sum + weight, 0);
  const pairTotal = weights[boundaryIndex] + weights[boundaryIndex + 1];
  const min = Math.min(MIN_FACTOR_WEIGHT, Math.max(1, Math.floor(pairTotal / 2) - 1));
  const boundary = clamp(percent, before + min, before + pairTotal - min);
  weights[boundaryIndex] = Math.round(boundary - before);
  weights[boundaryIndex + 1] = Math.round(pairTotal - weights[boundaryIndex]);
  selectedFactors = applyWeightsToFactors(selectedFactors, weights);
  renderFactorBuilder();
}

function nudgeBoundaryWeight(boundaryIndex, delta) {
  const weights = normalizedWeights(selectedFactors);
  if (boundaryIndex < 0 || boundaryIndex >= weights.length - 1) return;
  const pairTotal = weights[boundaryIndex] + weights[boundaryIndex + 1];
  const min = Math.min(MIN_FACTOR_WEIGHT, Math.max(1, Math.floor(pairTotal / 2) - 1));
  weights[boundaryIndex] = clamp(weights[boundaryIndex] + delta, min, pairTotal - min);
  weights[boundaryIndex + 1] = pairTotal - weights[boundaryIndex];
  selectedFactors = applyWeightsToFactors(selectedFactors, weights);
  renderFactorBuilder();
}

function setSingleFactorWeight(index, nextWeight) {
  const weights = normalizedWeights(selectedFactors);
  if (index < 0 || index >= weights.length) return;
  const minTotalForOthers = MIN_FACTOR_WEIGHT * (weights.length - 1);
  const target = clamp(Math.round(nextWeight), MIN_FACTOR_WEIGHT, 100 - minTotalForOthers);
  const remaining = 100 - target;
  const others = weights.map((weight, itemIndex) => (itemIndex === index ? 0 : Math.max(MIN_FACTOR_WEIGHT, weight)));
  const othersSum = others.reduce((sum, weight) => sum + weight, 0) || 1;
  const nextWeights = weights.map((weight, itemIndex) => (itemIndex === index ? target : Math.round((others[itemIndex] / othersSum) * remaining)));
  selectedFactors = applyWeightsToFactors(selectedFactors, nextWeights);
  renderFactorBuilder();
}

function donutPoint(percent) {
  const angle = (percent / 100) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 100 + Math.cos(angle) * 70,
    y: 100 + Math.sin(angle) * 70,
  };
}

function anglePercent(x, y) {
  const angle = Math.atan2(y, x) + Math.PI / 2;
  return (((angle < 0 ? angle + Math.PI * 2 : angle) / (Math.PI * 2)) * 100) % 100;
}

function factorColor(index) {
  return WEIGHT_CHART_COLORS[index % WEIGHT_CHART_COLORS.length];
}

function formatWeight(value) {
  return Math.round(Number(value || 0));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

async function searchSnippets() {
  if (!snippetList) return;
  const q = (snippetQuery?.value.trim() || value("#keyword")).trim();
  if (!q) {
    snippetList.innerHTML = "";
    return;
  }
  const response = await apiFetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!response) return;
  const data = await response.json();
  const snippets = data.snippets || [];
  snippetList.innerHTML = snippets
    .map(
      (item) => `
        <article class="snippet">
          <strong>${escapeHtml(item.file_name || "")}</strong>
          <p>${t("page")} ${item.page || t("unknown")}</p>
          <p>${escapeHtml(item.snippet || "")}</p>
        </article>
      `,
    )
    .join("");
}

async function recommendProjects() {
  const question = recommendQuestion.value.trim();
  if (!question) {
    recommendQuestion.focus();
    return;
  }
  recommendResult.innerHTML = `<p class="subtle">${t("aiThinking")}</p>`;
  const finishVrtAgentWork = beginVrtAgentWork();
  try {
    const response = await apiFetch("/api/recommend", {
      method: "POST",
      body: JSON.stringify({ question, lang }),
    });
    if (!response) return;
    const data = await response.json();
    if (data.error) {
      recommendResult.innerHTML = `<p class="errorText">${escapeHtml(data.error)}</p>`;
      return;
    }
    renderRecommendation(data);
  } finally {
    finishVrtAgentWork();
  }
}

function renderRecommendation(data) {
  const recommendations = data.recommendations || [];
  const suggestedQueries = data.suggested_queries || [];
  const byId = new Map(projects.map((project) => [Number(project.document_id), project]));
  recommendResult.innerHTML = `
    <article class="aiAnswer">
      <p>${escapeHtml(data.answer || "")}</p>
      ${
        data.warning
          ? `<div class="guidanceCard warning"><strong>${t("aiFallbackNotice")}</strong><p>${escapeHtml(data.warning)}</p></div>`
          : ""
      }
      ${
        data.clarifying_question || suggestedQueries.length
          ? `<div class="guidanceCard">
              ${
                data.clarifying_question
                  ? `<strong>${t("aiClarifyingQuestion")}</strong><p>${escapeHtml(data.clarifying_question)}</p>`
                  : ""
              }
              ${
                suggestedQueries.length
                  ? `<div class="suggestedQueries">
                      <span>${t("aiSuggestedQueries")}</span>
                      ${suggestedQueries
                        .map((query) => `<button type="button" class="suggestedQuery" data-suggested-query="${escapeHtml(query)}">${escapeHtml(query)}</button>`)
                        .join("")}
                    </div>`
                  : ""
              }
            </div>`
          : ""
      }
      ${
        data.filters_used?.length
          ? `<p><strong>${t("filtersUsed")}:</strong> ${escapeHtml((data.filters_used || []).join(", "))}</p>`
          : ""
      }
      <h3>${t("recommendedProjects")}</h3>
      ${
        recommendations.length
          ? recommendations
              .map((item) => {
                const project = byId.get(Number(item.document_id));
                return `
                  <div class="recommendation">
                    <strong>${escapeHtml(item.project_name || project?.project_name || `BP ${item.document_id}`)}</strong>
                    <p>${escapeHtml(item.reason || "")}</p>
                    ${item.risks ? `<p><em>${escapeHtml(item.risks)}</em></p>` : ""}
                    ${item.next_step ? `<p>${escapeHtml(item.next_step)}</p>` : ""}
                    <div class="recommendActions">
                      ${
                        project
                          ? `<button data-document-id="${project.document_id}" ${buttonAttrs(t("view"))}>${iconLabel("chevronRight", t("view"))}</button>
                             ${
                               project.source_url
                                 ? `<button data-file-id="${project.document_id}" data-file-url="${escapeHtml(project.source_url)}" class="secondary" ${buttonAttrs(t("openFile"))}>${iconLabel("external", t("openFile"))}</button>`
                                 : ""
                             }`
                          : ""
                      }
                    </div>
                  </div>
                `;
              })
              .join("")
          : `<p>${t("aiNoRecommendations")}</p>`
      }
    </article>
  `;
  recommendResult.querySelectorAll("[data-suggested-query]").forEach((button) => {
    button.addEventListener("click", () => {
      recommendQuestion.value = button.dataset.suggestedQuery || "";
      resizeRecommendComposer();
      recommendProjects();
    });
  });
  recommendResult.querySelectorAll("[data-document-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.documentId));
  });
  recommendResult.querySelectorAll("[data-file-id]").forEach((button) => {
    button.addEventListener("click", () => openSourceFile(button.dataset.fileId, button.dataset.fileUrl));
  });
}

function renderProjects(items) {
  const projectCountNode = document.querySelector("#projectCount");
  if (projectCountNode) projectCountNode.textContent = String(items.length);
  if (projectCountMirror) projectCountMirror.textContent = String(items.length);
  renderProjectListStatus();

  if (!items.length && projectListState.phase === "loading") {
    grid.innerHTML = projectListLoadingBlock("projectListLoading");
    return;
  }

  if (!items.length && projectListState.phase === "error") {
    grid.innerHTML = projectListErrorBlock(projectListState.error);
    grid.querySelector("[data-project-list-retry]")?.addEventListener("click", loadProjects);
    return;
  }

  if (!items.length) {
    grid.innerHTML = `<div class="panel projectEmpty">${t("noProjects")}</div>`;
    return;
  }

  grid.innerHTML = `
    ${projectTableHeader()}
    ${items.map(projectRow).join("")}
  `;
  grid.querySelectorAll("[data-document-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      showProject(button.dataset.documentId);
    });
  });
  grid.querySelectorAll("[data-file-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openSourceFile(button.dataset.fileId, button.dataset.fileUrl);
    });
  });
  grid.querySelectorAll("[data-shortlist-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addToShortlist(Number(button.dataset.shortlistId));
    });
  });
  grid.querySelectorAll("[data-nominate-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      nominateProject(Number(button.dataset.nominateId));
    });
  });
  grid.querySelectorAll("[data-project-reaction]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleProjectReaction(Number(button.dataset.reactionProjectId), button.dataset.projectReaction);
    });
  });
  grid.querySelectorAll("[data-project-highlight]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleProjectHighlight(Number(button.dataset.highlightProjectId), button.dataset.projectHighlight === "true");
    });
  });
  grid.querySelectorAll("[data-project-expand]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleProjectRowDetails(button);
    });
  });
  grid.querySelectorAll("[data-project-row]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("button, a")) return;
      showProject(row.dataset.projectRow);
    });
  });
}

function projectTableHeader() {
  const columns = lang === "zh"
    ? ["#", "项目", "领域", "阶段", "分", "风险", "操作"]
    : ["#", "Project", "Sector", "Stage", "Score", "Risk", "Act"];
  return `
    <div class="projectTableHeader" role="row" aria-hidden="true">
      ${columns.map((column) => `<span>${escapeHtml(column)}</span>`).join("")}
    </div>
  `;
}

function isUnknownProjectValue(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  return /^(unknown|unknown project|n\/a|na|null|none|undefined|-+|--|未知|未知项目|不详|未披露|待定)$/i.test(text);
}

function cleanProjectDisplayText(value) {
  const source = Array.isArray(value) ? value.filter(Boolean).join(" / ") : String(value || "");
  return source
    .replace(/\.(pdf|pptx?|docx?)$/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[#\-\s\d.()[\]]+/, "")
    .trim();
}

function displayOrFallback(value, fallbackKey = "notParsedYet") {
  const text = cleanProjectDisplayText(value);
  return isUnknownProjectValue(text) ? t(fallbackKey) : text;
}

function firstUsefulProjectValue(project, keys = []) {
  for (const key of keys) {
    const text = cleanProjectDisplayText(project?.[key]);
    if (!isUnknownProjectValue(text)) return text;
  }
  return "";
}

function conciseProjectText(value, maxLength = 54) {
  const text = cleanProjectDisplayText(value)
    .split(/[\n\r。；;|]+/)
    .map((part) => part.trim())
    .find(Boolean) || "";
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function fallbackProjectName(project) {
  const profileCandidates = [
    project.document_title,
    project.title,
    project.file_name,
    project.summary,
    project.one_liner,
    project.one_line_summary,
    project.profile_summary,
  ];
  for (const candidate of profileCandidates) {
    const text = conciseProjectText(candidate);
    if (!isUnknownProjectValue(text)) return text;
  }

  const tags = Array.isArray(project.tags) ? project.tags.filter((tag) => !isUnknownProjectValue(tag)).slice(0, 2) : [];
  const industry = isUnknownProjectValue(project.industry) ? "" : cleanProjectDisplayText(project.industry);
  const tagName = conciseProjectText([...tags, industry].filter(Boolean).join(" / "), 42);
  if (tagName) return lang === "zh" ? `${tagName} BP` : `${tagName} BP`;

  const fileName = conciseProjectText(project.file_name, 48);
  if (!isUnknownProjectValue(fileName)) return fileName;

  return project.library_number ? `${t("untitledBp")} #${Number(project.library_number)}` : t("untitledBp");
}

function projectDisplayInfo(project) {
  const primary = [project.project_name, project.company_name]
    .map(cleanProjectDisplayText)
    .find((value) => !isUnknownProjectValue(value));
  const fullName = primary || fallbackProjectName(project);
  const title = conciseProjectText(fullName, 48) || fallbackProjectName(project);
  const company = cleanProjectDisplayText(project.company_name);
  const region = cleanProjectDisplayText(project.country_or_region);
  const summary = conciseProjectText(project.one_liner || project.one_line_summary || project.summary || project.business_model, 92);
  const sublineParts = [];
  if (!isUnknownProjectValue(company) && company !== fullName) sublineParts.push(company);
  if (!isUnknownProjectValue(region)) sublineParts.push(region);
  if (!sublineParts.length) {
    const sourceTitle = conciseProjectText(project.document_title || project.file_name, 54);
    if (!isUnknownProjectValue(sourceTitle) && sourceTitle !== fullName) sublineParts.push(sourceTitle);
  }
  if (!sublineParts.length && !isUnknownProjectValue(summary)) sublineParts.push(summary);
  return {
    title,
    fullName,
    subline: sublineParts.join(" / "),
    summary,
  };
}

function projectRow(project) {
  const display = projectDisplayInfo(project);
  const libraryNumber = Number(project.library_number || 0);
  const libraryNumberLabel = libraryNumber > 0 ? `#${libraryNumber}` : "-";
  const sector = displayOrFallback(project.industry);
  const financingStage = displayOrFallback(project.financing_stage);
  const riskLevel = displayOrFallback(project.risk_level);
  const recommendation = displayOrFallback(project.recommendation);
  const stageCustomer = [project.customer_type, project.revenue_stage]
    .map((value) => displayOrFallback(value))
    .filter((value) => value && value !== t("notParsedYet"))
    .join(" / ") || t("notParsedYet");
  const summary = display.summary || conciseProjectText(project.one_line_summary || project.summary || project.business_model, 120);
  const tags = Array.isArray(project.tags) ? project.tags.filter((tag) => !isUnknownProjectValue(tag)).slice(0, 10) : [];
  const sourceTitle = displayOrFallback(project.document_title || project.file_name, "sourceDocument");
  const scoreValue = Number(project.personal_score ?? project.screening_score);
  const ops = project.ops || {};
  const status = ops.global_status?.status || "new";
  const highlights = ops.highlights || {};
  const opsBadges = [
    status !== "new" ? statusLabelForProject(status) : "",
    highlights.count ? `${t("highlightedBy")} ${highlights.count}` : "",
    ops.in_my_shortlist ? t("personalRepository") : "",
    ops.shortlisted_by?.length ? `${t("shortlistedBy")} ${ops.shortlisted_by.length}` : "",
    ops.nominated_by?.length ? `${t("nominatedBy")} ${ops.nominated_by.length}` : "",
    project.operational_penalty ? `${t("recommendationPenalty")} ${project.operational_penalty}` : "",
  ].filter(Boolean);
  const personalScoreSource = project.personal_score_source === "confirmed" ? "final" : project.personal_score_source === "draft" ? "draft" : "base";
  const personalScoreLabel = personalScoreSource === "final" ? t("finalScore") : personalScoreSource === "draft" ? t("draftScore") : t("baseScore");
  const personalScoreBadge = personalScoreSource === "final" ? "Final" : personalScoreSource === "draft" ? "Draft" : "Base";
  const scoreLabel = Number.isFinite(scoreValue) ? String(scoreValue) : "-";
  const teamSummary = firstUsefulProjectValue(project, ["team_highlights"]);
  const tractionSummary = firstUsefulProjectValue(project, ["traction"]);
  const riskSummary = firstUsefulProjectValue(project, ["risks"]);
  const rowDetailsId = `project-row-details-${Number(project.document_id || 0)}`;
  const rowOpenLabel = `${t("openProjectRow")}: ${display.fullName}`;
  const isExpanded = expandedProjectRows.has(Number(project.document_id || 0));

  return `
    <article class="projectRow ${highlights.highlighted_by_me ? "highlightedByMe" : highlights.count ? "highlightedByTeam" : ""}" role="row" data-project-row="${project.document_id}" title="${escapeHtml(`${rowOpenLabel} · ${t("openProjectRowHint")}`)}">
      <div class="projectCell libraryNumberCell projectStackCell" data-label="${escapeHtml(t("libraryNumber"))}" title="${escapeHtml(t("libraryNumberHint"))}">
        <strong>${escapeHtml(libraryNumberLabel)}</strong>
      </div>
      <div class="projectMain" data-label="${escapeHtml(t("projectName"))}">
        <button type="button" class="projectOpenButton" data-document-id="${project.document_id}" ${buttonAttrs(`${rowOpenLabel} · ${t("openProjectRowHint")}`)}>
          <span class="projectOpenName" title="${escapeHtml(display.fullName)}">${escapeHtml(display.title)}</span>
          ${display.subline ? `<small title="${escapeHtml(display.subline)}">${escapeHtml(display.subline)}</small>` : ""}
        </button>
      </div>
      <div class="projectCell projectStackCell" data-label="${escapeHtml(t("industryRegion"))}">
        <strong title="${escapeHtml(sector)}">${escapeHtml(sector)}</strong>
      </div>
      <div class="projectCell projectStackCell" data-label="${escapeHtml(t("stageLabel"))}">
        <strong title="${escapeHtml(financingStage)}">${escapeHtml(financingStage)}</strong>
        ${stageCustomer !== t("notParsedYet") ? `<small title="${escapeHtml(stageCustomer)}">${escapeHtml(stageCustomer)}</small>` : ""}
      </div>
      <div class="projectCell scoreCell projectStackCell" data-label="${escapeHtml(t("scoreColumn"))}">
        <strong title="${escapeHtml(`${personalScoreLabel}: ${scoreLabel}`)}">${escapeHtml(scoreLabel)}</strong>
        <small class="scoreSourceBadge ${escapeHtml(personalScoreSource)}" title="${escapeHtml(personalScoreLabel)}">${escapeHtml(personalScoreBadge)}</small>
      </div>
      <div class="projectCell projectStackCell" data-label="${escapeHtml(t("riskLevelLabel"))}">
        <strong title="${escapeHtml(`${t("recommendation")}: ${recommendation}`)}">${escapeHtml(riskLevel)}</strong>
      </div>
      <div class="rowActions" data-label="${escapeHtml(t("actions"))}">
        <button type="button" class="secondary projectExpandButton" data-project-expand="${project.document_id}" aria-expanded="${isExpanded ? "true" : "false"}" aria-controls="${escapeHtml(rowDetailsId)}" ${buttonAttrs(t("profileDetails"))}>${iconLabel("chevronRight", t("profileDetails"))}</button>
        ${renderProjectHighlightButton(project.ops, project.document_id)}
      </div>
      <div id="${escapeHtml(rowDetailsId)}" class="projectRowDetails" ${isExpanded ? "" : "hidden"}>
        <p class="projectRowSummary">${escapeHtml(summary || t("noSummaryYet"))}</p>
        <div class="projectRowDetailGrid">
          <section>
            <strong>${escapeHtml(t("riskRecommendationColumn"))}</strong>
            <p class="subtle">${escapeHtml(recommendation)}</p>
            <p class="subtle">${escapeHtml(stageCustomer)}</p>
            ${riskSummary ? `<p class="subtle">${escapeHtml(riskSummary)}</p>` : ""}
          </section>
          <section>
            <strong>${escapeHtml(t("team"))}</strong>
            <p class="subtle">${escapeHtml(teamSummary || project.collaboration?.team_summary || t("notParsedYet"))}</p>
            ${tractionSummary ? `<p class="subtle">${escapeHtml(t("traction"))}: ${escapeHtml(tractionSummary)}</p>` : ""}
          </section>
          <section>
            <strong>${escapeHtml(t("collaboration"))}</strong>
            <div class="likesCell">
              ${renderProjectHighlightSummary(project.ops)}
              <div class="tags projectTags">
                ${opsBadges.map((tag) => `<span class="tag opsTag">${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
          </section>
          <section>
            <strong>${escapeHtml(t("tagsSummary"))}</strong>
            <div class="tags projectTags">
              ${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || `<span class="subtle">${escapeHtml(t("noTagsYet"))}</span>`}
            </div>
            <p class="subtle">${escapeHtml(t("sourceDocument"))}: ${escapeHtml(sourceTitle)}</p>
          </section>
          <section class="projectRowSecondaryActions">
            <strong>${escapeHtml(t("actions"))}</strong>
            ${renderProjectReactionButtons(project.ops, project.document_id)}
            <button data-shortlist-id="${project.document_id}" class="secondary" ${buttonAttrs(t("addToShortlist"))}>${iconLabel("bookmark", t("addToShortlist"))}</button>
            <button data-nominate-id="${project.document_id}" class="secondary" ${buttonAttrs(t("nominateThisWeek"))}>${iconLabel("nominate", t("nominateThisWeek"))}</button>
            ${
              project.source_url
                ? `<button data-file-id="${project.document_id}" data-file-url="${escapeHtml(project.source_url)}" class="secondary" ${buttonAttrs(t("openFile"))}>${iconLabel("external", t("openFile"))}</button>`
                : ""
            }
          </section>
        </div>
      </div>
    </article>
  `;
}

function toggleProjectRowDetails(button) {
  const details = document.getElementById(button.getAttribute("aria-controls") || "");
  if (!details) return;
  const expanded = button.getAttribute("aria-expanded") === "true";
  const documentId = Number(button.dataset.projectExpand || 0);
  button.setAttribute("aria-expanded", expanded ? "false" : "true");
  details.hidden = expanded;
  if (documentId) {
    if (expanded) {
      expandedProjectRows.delete(documentId);
    } else {
      expandedProjectRows.add(documentId);
    }
  }
}

async function showProject(documentId) {
  const response = await apiFetch(`/api/projects/${documentId}?lang=${encodeURIComponent(lang)}&scoringTemplate=${encodeURIComponent(activeScoringTemplate)}`);
  if (!response) return;
  const data = await response.json();
  const rankedProject = projects.find((item) => Number(item.document_id) === Number(documentId));
  const project = { ...(rankedProject || {}), ...(data.project || {}) };
  if (!project) return;
  selectedDocumentId = Number(project.document_id || documentId);
  selectedProject = project;
  renderScoringQueueSummary();
  renderWeeklyNominationSpotlight(reviewBoard?.nominations || []);

  detail.innerHTML = `
    <h2>${escapeHtml(project.project_name || project.company_name || t("unknown"))}</h2>
    <p class="summary">${escapeHtml(project.one_line_summary || "")}</p>
    <div class="detailPresence">
      <strong>${t("teamPresence")}</strong>
      <div>${renderPresenceChips(project.collaboration?.statuses || [])}</div>
    </div>
    <div class="detailGrid">
      ${detailItem(t("industry"), project.industry)}
      ${detailItem(t("stageLabel"), project.financing_stage)}
      ${detailItem(t("screeningScore"), Number(project.screening_score || 0))}
      ${detailItem(t("teamScore"), Number(project.team_score || 0))}
      ${detailItem(t("tractionScore"), Number(project.traction_score || 0))}
      ${
        Number.isFinite(Number(project.custom_rank_score))
          ? detailItem(t("customRankScore"), Number(project.custom_rank_score || 0))
          : ""
      }
      ${detailItem(t("riskLevelLabel"), project.risk_level)}
      ${detailItem(t("customerTypeLabel"), project.customer_type)}
      ${detailItem(t("revenueStageLabel"), project.revenue_stage)}
      ${detailItem(t("businessModel"), project.business_model)}
      ${detailItem(t("team"), join(project.team_highlights))}
      ${detailItem(t("traction"), join(project.traction))}
      ${detailItem(t("risks"), join(project.risks))}
      ${detailItem(t("file"), project.file_name)}
    </div>
    ${
      project.source_url
        ? `<button id="detailOpenFile" data-file-id="${project.document_id}" data-file-url="${escapeHtml(project.source_url)}" ${buttonAttrs(t("openFile"))}>${iconLabel("external", t("openFile"))}</button>`
        : ""
    }
    ${
      project.evidence?.length
        ? `<h3>${t("evidence")}</h3><ul>${project.evidence
            .map((item) => `<li>${escapeHtml(item.quote || "")}</li>`)
            .join("")}</ul>`
        : ""
    }
    ${
      project.custom_rank_breakdown?.length
        ? `<h3>${t("breakdown")}</h3><ul>${project.custom_rank_breakdown
            .map((item) => `<li>${escapeHtml(factorLabel(item))}: ${Number(item.score || 0)} × ${Number(item.weight || 0)}</li>`)
            .join("")}</ul>`
        : ""
    }
  `;
  detail.querySelector("#detailOpenFile")?.addEventListener("click", (event) => {
    openSourceFile(event.currentTarget.dataset.fileId, event.currentTarget.dataset.fileUrl);
  });
  renderScoreReviewCard(project);
  renderBpPreview(project);
  renderProjectOps(project);
  openProjectDialog();
  await recordProjectActivity(selectedDocumentId, "viewed", { refresh: false });
  await loadProjectContext(selectedDocumentId);
  await loadSimilarProjects(selectedDocumentId);
}

function renderScoreReviewCard(project) {
  if (!scoreReviewCard) return;
  if (!project?.document_id) {
    scoreReviewCard.innerHTML = "";
    return;
  }
  const review = project.score_review || {};
  const draft = review.draft || null;
  const userScore = review.user_score || null;
  const dimensions = userScore?.dimensions?.length ? userScore.dimensions : draft?.dimensions || [];
  const draftScore = Number(userScore?.ai_draft_score ?? draft?.draft_score ?? project.screening_score ?? 0);
  const finalScore = Number(userScore?.user_final_score ?? draftScore);
  scoreReviewCard.innerHTML = `
    <section class="scoreReviewShell">
      <div class="sectionTitle compactScoreTitle">
        <div>
          <h3>${escapeHtml(t("scoreReviewTitle"))}</h3>
          <span>${escapeHtml(t("vrtDraftModeCopy"))}</span>
        </div>
        <strong class="scorePill">${escapeHtml(t("vrtSuggested"))}: ${Number(draftScore || 0)}</strong>
      </div>
      ${
        draft
          ? `
            <div class="scoreReasonGrid">
              <p><strong>${escapeHtml(t("vrtReason"))}</strong>${escapeHtml(draft.reason || userScore?.ai_reason || "")}</p>
              <p><strong>${escapeHtml(t("vrtUncertainty"))}</strong>${escapeHtml(draft.uncertainty || "")}</p>
            </div>
            <div class="scoreDimensions">
              ${dimensions.map((dimension, index) => scoreDimensionRow(dimension, index)).join("")}
            </div>
            <label class="scoreSliderLabel">
              <span>${escapeHtml(t("userFinalScore"))}: <strong data-final-score-output>${finalScore}</strong></span>
              <input id="userFinalScore" type="range" min="0" max="100" value="${finalScore}" />
            </label>
            <textarea id="adjustmentReasonInput" data-i18n-placeholder="adjustmentReasonPlaceholder" placeholder="${escapeHtml(t("adjustmentReasonPlaceholder"))}">${escapeHtml(userScore?.adjustment_reason || "")}</textarea>
            <button id="saveFinalScoreButton" type="button">${iconLabel("check", t("saveFinalScore"))}</button>
          `
          : `
            <p class="subtle">${escapeHtml(t("noDraftYet"))}</p>
            <button id="generateDraftFromCard" type="button">${iconLabel("send", t("generateDraftScores"))}</button>
          `
      }
    </section>
  `;
  const finalInput = scoreReviewCard.querySelector("#userFinalScore");
  const finalOutput = scoreReviewCard.querySelector("[data-final-score-output]");
  finalInput?.addEventListener("input", () => {
    if (finalOutput) finalOutput.textContent = finalInput.value;
  });
  scoreReviewCard.querySelectorAll("[data-dimension-score-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const output = input.closest("[data-score-dimension-index]")?.querySelector("[data-dimension-score-output]");
      if (output) output.textContent = input.value;
    });
  });
  scoreReviewCard.querySelector("#generateDraftFromCard")?.addEventListener("click", generateCurrentDraftScore);
  scoreReviewCard.querySelector("#saveFinalScoreButton")?.addEventListener("click", saveCurrentFinalScore);
}

function scoreDimensionRow(dimension, index) {
  const suggested = Number(dimension.suggested_score ?? dimension.score ?? 0);
  const finalScore = Number(dimension.user_final_score ?? suggested);
  return `
    <article class="scoreDimensionRow" data-score-dimension-index="${index}">
      <div>
        <strong>${escapeHtml(dimension.label || dimension.key || `${t("scoreReviewTitle")} ${index + 1}`)}</strong>
        <small>${escapeHtml(t("vrtSuggested"))}: ${suggested}</small>
      </div>
      <p>${escapeHtml(dimension.reason || "")}</p>
      ${dimension.uncertainty ? `<small>${escapeHtml(t("vrtUncertainty"))}: ${escapeHtml(dimension.uncertainty)}</small>` : ""}
      <label>
        <span>${escapeHtml(t("userFinalScore"))}: <strong data-dimension-score-output>${finalScore}</strong></span>
        <input type="range" min="0" max="100" value="${finalScore}" data-dimension-score-input />
      </label>
    </article>
  `;
}

async function generateCurrentDraftScore() {
  if (!selectedDocumentId) {
    if (scoringDraftStatus) scoringDraftStatus.textContent = t("selectProjectHint");
    return;
  }
  if (scoringDraftStatus) scoringDraftStatus.textContent = t("aiThinking");
  const finishVrtAgentWork = beginVrtAgentWork();
  try {
    const response = await apiFetch("/api/scoring/drafts", {
      method: "POST",
      body: JSON.stringify({
        document_id: selectedDocumentId,
        template_key: activeScoringTemplate,
        profile_id: activeWeightProfileId || null,
        lang,
        metadata: clientMetadata(),
      }),
    });
    if (!response) return;
    const data = await response.json().catch(() => ({}));
    if (data.error) {
      if (scoringDraftStatus) scoringDraftStatus.textContent = data.error;
      return;
    }
    applyScoreReviewToProject(selectedDocumentId, data.score_review);
    if (scoringDraftStatus) scoringDraftStatus.textContent = data.warning || t("draftGenerated");
    await loadScoringProfile();
    await loadScoringQueue();
    renderProjectList();
  } finally {
    finishVrtAgentWork();
  }
}

async function saveCurrentFinalScore() {
  if (!selectedDocumentId || !selectedProject?.score_review?.draft) return;
  const draft = selectedProject.score_review.draft;
  const finalScore = Number(scoreReviewCard?.querySelector("#userFinalScore")?.value || draft.draft_score || 0);
  const dimensions = Array.from(scoreReviewCard?.querySelectorAll("[data-score-dimension-index]") || []).map((row, index) => {
    const source = (selectedProject.score_review.user_score?.dimensions?.length ? selectedProject.score_review.user_score.dimensions : draft.dimensions || [])[index] || {};
    return {
      ...source,
      user_final_score: Number(row.querySelector("[data-dimension-score-input]")?.value || source.suggested_score || 0),
    };
  });
  const response = await apiFetch(`/api/projects/${selectedDocumentId}/score-review`, {
    method: "POST",
    body: JSON.stringify({
      template_key: activeScoringTemplate,
      profile_id: activeWeightProfileId || null,
      ai_draft_score: draft.draft_score,
      ai_reason: draft.reason,
      user_final_score: finalScore,
      adjustment_reason: scoreReviewCard?.querySelector("#adjustmentReasonInput")?.value || "",
      dimensions,
      metadata: clientMetadata(),
    }),
  });
  if (!response) return;
  const data = await response.json().catch(() => ({}));
  if (data.score_review) {
    applyScoreReviewToProject(selectedDocumentId, data.score_review);
    if (scoringDraftStatus) scoringDraftStatus.textContent = t("scoreSaved");
    await loadScoringProfile();
    await loadScoringQueue();
    renderProjectList();
  }
}

async function refreshSelectedScoreReview() {
  if (!selectedDocumentId || !selectedProject) return;
  const response = await apiFetch(`/api/projects/${selectedDocumentId}/score-review?template=${encodeURIComponent(activeScoringTemplate)}`);
  if (!response) return;
  const data = await response.json().catch(() => ({}));
  if (data.score_review) {
    applyScoreReviewToProject(selectedDocumentId, data.score_review);
  }
}

function applyScoreReviewToProject(documentId, scoreReview) {
  if (!scoreReview) return;
  const nextSource = scoreReview.user_score ? "confirmed" : scoreReview.draft ? "draft" : "base";
  const nextScore = scoreReview.user_score?.user_final_score ?? scoreReview.draft?.draft_score;
  const apply = (project) => {
    if (!project || Number(project.document_id) !== Number(documentId)) return project;
    return {
      ...project,
      score_review: scoreReview,
      personal_score: Number.isFinite(Number(nextScore)) ? Number(nextScore) : Number(project.screening_score || 0),
      personal_score_source: nextSource,
    };
  };
  selectedProject = apply(selectedProject);
  projects = projects.map((project) => apply(project));
  renderScoreReviewCard(selectedProject);
}

function reviewPendingDraftQueue() {
  const firstDraft = scoringQueue?.drafts?.[0];
  if (firstDraft?.document_id) {
    if (scoringDraftStatus) {
      scoringDraftStatus.textContent = t("nextPendingDraft").replace("{project}", firstDraft.label || `BP ${firstDraft.document_id}`);
    }
    showProject(firstDraft.document_id);
    return;
  }
  if (scoringDraftStatus) scoringDraftStatus.textContent = t("noDraftsForTemplate");
}

function renderPresenceChips(statuses) {
  const byActor = new Map((statuses || []).map((item) => [item.actor, item]));
  return teamMembers
    .map((member) => {
      const item = byActor.get(member) || {};
      const status = item.status || "not_visited";
      return `<span class="presenceChip ${escapeHtml(status)}" title="${escapeHtml(userDisplayName(member))} · ${escapeHtml(statusLabel(status))}">${renderAvatar(member, "small", item)} <span>${escapeHtml(statusLabel(status))}</span></span>`;
    })
    .join("");
}

function renderProjectHighlightSummary(ops = {}) {
  const highlights = ops.highlights || {};
  const actors = sortTeamActors(highlights.actors || []);
  if (!actors.length) return "";
  const title = `${t("highlightedBy")}: ${actors.map(userDisplayName).join(", ")}`;
  return `
    <div class="highlightSummary ${highlights.highlighted_by_me ? "active" : ""}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">
      ${icon("highlight", "reactionIcon")}
      <strong>${Number(highlights.count || actors.length || 0)}</strong>
      ${renderReactionActors(actors)}
    </div>
  `;
}

function renderReactionActors(actors = [], limit = 5) {
  const visibleActors = sortTeamActors(actors || []).slice(0, limit);
  return `
    <div class="likeActors ${visibleActors.length ? "" : "empty"}">
      ${visibleActors.map((actor) => renderAvatar(actor, "tiny")).join("")}
    </div>
  `;
}

function renderProjectReactionButtons(ops = {}, documentId = "", options = {}) {
  const likes = ops.likes || {};
  const dislikes = ops.dislikes || {};
  const wrapperClass = ["reactionButtons", options.compact ? "compactReactionButtons" : ""].filter(Boolean).join(" ");
  const likeActors = sortTeamActors(likes.actors || []);
  const dislikeActors = sortTeamActors(dislikes.actors || []);
  const likeTitle = `${likes.liked_by_me ? t("unlike") : t("like")} · ${t("likedBy")}: ${likeActors.map(userDisplayName).join(", ") || "0"}`;
  const dislikeTitle = `${dislikes.disliked_by_me ? t("undislike") : t("dislike")} · ${t("dislikedBy")}: ${dislikeActors.map(userDisplayName).join(", ") || "0"}`;
  const likePending = isProjectActionPending(documentId, "reaction:like");
  const dislikePending = isProjectActionPending(documentId, "reaction:dislike");
  return `
    <div class="${wrapperClass}" aria-label="${escapeHtml(t("likes"))}">
      <button type="button" class="${likes.liked_by_me ? "active reactionButton likeButton" : "secondary reactionButton likeButton"} ${likePending ? "loading" : ""}" data-reaction-project-id="${documentId}" data-project-reaction="like" title="${escapeHtml(likeTitle)}" aria-label="${escapeHtml(likeTitle)}" aria-busy="${likePending ? "true" : "false"}" ${likePending ? "disabled" : ""}>
        ${icon("thumbsUp")}<strong>${Number(likes.count || likeActors.length || 0)}</strong>${renderReactionActors(likeActors)}
      </button>
      <button type="button" class="${dislikes.disliked_by_me ? "active reactionButton dislikeButton" : "secondary reactionButton dislikeButton"} ${dislikePending ? "loading" : ""}" data-reaction-project-id="${documentId}" data-project-reaction="dislike" title="${escapeHtml(dislikeTitle)}" aria-label="${escapeHtml(dislikeTitle)}" aria-busy="${dislikePending ? "true" : "false"}" ${dislikePending ? "disabled" : ""}>
        ${icon("thumbsDown")}<strong>${Number(dislikes.count || dislikeActors.length || 0)}</strong>${renderReactionActors(dislikeActors)}
      </button>
    </div>
  `;
}

function renderProjectHighlightButton(ops = {}, documentId = "", options = {}) {
  const highlights = ops.highlights || {};
  const actors = sortTeamActors(highlights.actors || []);
  const active = Boolean(highlights.highlighted_by_me);
  const label = active ? t("unhighlight") : t("highlight");
  const title = `${label} · ${t("highlightedBy")}: ${actors.map(userDisplayName).join(", ") || "0"}`;
  const compactClass = options.compact ? " compactHighlightButton" : "";
  const pending = isProjectActionPending(documentId, "highlight");
  return `
    <button type="button" class="${active ? `active reactionButton highlightButton${compactClass}` : `secondary reactionButton highlightButton${compactClass}`} ${pending ? "loading" : ""}" data-highlight-project-id="${documentId}" data-project-highlight="${active ? "false" : "true"}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}" aria-busy="${pending ? "true" : "false"}" ${pending ? "disabled" : ""}>
      ${icon("highlight")}<span>${escapeHtml(label)}</span>${actors.length ? renderReactionActors(actors, 3) : ""}
    </button>
  `;
}

function statusLabel(status) {
  const labelsByStatus = {
    viewed: t("viewed"),
    commented: t("commented"),
    asked: t("asked"),
    not_interested: t("notInterested"),
    not_visited: t("notVisited"),
  };
  return labelsByStatus[status] || t("notVisited");
}

function userMeta(name) {
  return teamUserMeta.find((member) => member.name === name) || null;
}

function userInitials(name) {
  const known = userMeta(name);
  if (known) return known.initials;
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function userDisplayName(name) {
  return userMeta(name)?.displayName || name || t("unknown");
}

function sortTeamActors(actors = []) {
  const seen = new Set();
  return (actors || [])
    .map((actor) => String(actor || "").trim())
    .filter(Boolean)
    .filter((actor) => {
      const key = actor.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const rankDiff = (teamMemberOrder.get(a) ?? teamMembers.length) - (teamMemberOrder.get(b) ?? teamMembers.length);
      return rankDiff || a.localeCompare(b);
    });
}

function renderAvatar(name, size = "", sourceMeta = null) {
  const meta = normalizeAvatarMeta(sourceMeta) || userMeta(name);
  const className = ["avatar", meta?.className, size ? `avatar-${size}` : ""].filter(Boolean).join(" ");
  return `<span class="${escapeHtml(className)}" ${avatarStyle(meta)} aria-hidden="true">${escapeHtml(userInitials(name))}</span>`;
}

function normalizeAvatarMeta(meta) {
  if (!meta || (!meta.className && !meta.class_name && !meta.colors)) return null;
  return {
    className: meta.className || meta.class_name || "",
    colors: meta.colors || null,
  };
}

function avatarStyle(meta) {
  if (!meta?.colors) return "";
  const entries = [
    ["--avatar-bg", meta.colors.bg],
    ["--avatar-accent", meta.colors.accent],
    ["--avatar-text", meta.colors.text],
    ["--avatar-ring", meta.colors.ring],
    ["--avatar-glow", meta.colors.glow],
  ].filter(([, value]) => value);
  if (!entries.length) return "";
  const style = entries.map(([key, value]) => `${key}: ${value}`).join("; ");
  return `style="${escapeHtml(style)}"`;
}

async function renderBpPreview(project) {
  if (!bpFrame || !bpFallbackLink) return;
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = "";
  }
  bpFrame.removeAttribute("src");
  bpFallbackLink.hidden = true;
  if (bpPreviewDetails) {
    bpPreviewDetails.hidden = true;
    bpPreviewDetails.open = false;
  }
  const sourceUrl = project.source_url || "";
  if (!sourceUrl) return;
  if (bpPreviewDetails) {
    bpPreviewDetails.hidden = false;
    bpPreviewDetails.open = true;
  }
  if (/^https?:\/\//i.test(sourceUrl)) {
    bpFrame.src = sourceUrl;
    bpFallbackLink.href = sourceUrl;
    bpFallbackLink.hidden = false;
    return;
  }
  const response = await fetch(`/api/files/${project.document_id}`, {
    headers: authHeaders(),
  }).catch(() => null);
  if (!response?.ok) {
    if (bpPreviewDetails) {
      bpPreviewDetails.hidden = true;
      bpPreviewDetails.open = false;
    }
    return;
  }
  const blob = await response.blob();
  currentObjectUrl = URL.createObjectURL(blob);
  bpFrame.src = currentObjectUrl;
  bpFallbackLink.href = currentObjectUrl;
  bpFallbackLink.hidden = false;
}

function renderProjectOps(project, similar = []) {
  if (!projectOps) return;
  if (!project?.document_id) {
    projectOps.innerHTML = `<p class="subtle">${t("selectProjectHint")}</p>`;
    return;
  }
  const ops = project.ops || {};
  projectOps.innerHTML = `
    <div class="opsStack">
      <section class="opsBlock opsCompactHero">
        <div class="opsStatusRow segmentedActions" aria-label="${escapeHtml(t("globalStatus"))}">
          ${["new", "watching", "discussed", "meeting_selected", "eliminated"]
            .map((status) => `<button type="button" class="${ops.global_status?.status === status ? "active" : "secondary"}" data-global-status="${status}">${statusLabelForProject(status)}</button>`)
            .join("")}
        </div>
        <div class="opsReactionRow">
          ${renderProjectHighlightButton(ops, project.document_id, { compact: true })}
          ${renderProjectReactionButtons(ops, project.document_id, { compact: true })}
        </div>
        ${ops.global_status?.note ? `<p class="subtle">${escapeHtml(ops.global_status.note)}</p>` : ""}
      </section>
      <details class="opsBlock opsCompactDetails">
        <summary>${t("votes")}</summary>
        <div class="segmentedActions">
          <button type="button" class="${ops.my_vote === "support" ? "active reactionButton likeButton" : "secondary reactionButton likeButton"}" data-project-vote="support" ${buttonAttrs(t("voteSupport"))}>${iconLabel("thumbsUp", `${t("voteSupport")} · ${ops.votes?.support || 0}`)}</button>
          <button type="button" class="${ops.my_vote === "oppose" ? "active reactionButton dislikeButton" : "secondary reactionButton dislikeButton"}" data-project-vote="oppose" ${buttonAttrs(t("voteOppose"))}>${iconLabel("thumbsDown", `${t("voteOppose")} · ${ops.votes?.oppose || 0}`)}</button>
          <button type="button" class="${ops.my_vote === "neutral" ? "active" : "secondary"}" data-project-vote="neutral" ${buttonAttrs(t("voteNeutral"))}>${iconLabel("check", `${t("voteNeutral")} · ${ops.votes?.neutral || 0}`)}</button>
        </div>
      </details>
      <details class="opsBlock opsCompactDetails">
        <summary>${t("collaboration")}</summary>
        <div class="segmentedActions">
          <button type="button" class="secondary" data-personal-mark="support" ${buttonAttrs(t("markSupport"))}>${iconLabel("thumbsUp", t("markSupport"))}</button>
          <button type="button" class="secondary" data-personal-mark="oppose" ${buttonAttrs(t("markOppose"))}>${iconLabel("thumbsDown", t("markOppose"))}</button>
          <button type="button" class="secondary" data-personal-mark="watch" ${buttonAttrs(t("markWatch"))}>${iconLabel("check", t("markWatch"))}</button>
          <button type="button" class="secondary" data-add-shortlist ${buttonAttrs(t("addToShortlist"))}>${iconLabel("bookmark", t("addToShortlist"))}</button>
          <button type="button" class="secondary" data-nominate-project ${buttonAttrs(t("nominateThisWeek"))}>${iconLabel("nominate", t("nominateThisWeek"))}</button>
        </div>
        <div class="opsActorMeta">
          <span title="${escapeHtml(`${t("shortlistedBy")}: ${(ops.shortlisted_by || []).map(userDisplayName).join(", ") || "0"}`)}">${icon("bookmark", "inlineIcon")}<strong>${ops.shortlisted_by?.length || 0}</strong>${renderReactionActors(ops.shortlisted_by || [], 4)}</span>
          <span title="${escapeHtml(`${t("nominatedBy")}: ${(ops.nominated_by || []).map((item) => userDisplayName(item.actor)).join(", ") || "0"}`)}">${icon("nominate", "inlineIcon")}<strong>${ops.nominated_by?.length || 0}</strong>${renderReactionActors((ops.nominated_by || []).map((item) => item.actor), 4)}</span>
        </div>
      </details>
      <details class="opsBlock opsCompactDetails">
        <summary>${t("similarBp")}</summary>
        <div class="similarList">
          ${similar.length ? similar.map(similarProjectCard).join("") : `<p class="subtle">${t("aiThinking")}</p>`}
        </div>
      </details>
    </div>
  `;
  projectOps.querySelectorAll("[data-global-status]").forEach((button) => {
    button.addEventListener("click", () => setProjectGlobalStatus(button.dataset.globalStatus));
  });
  projectOps.querySelectorAll("[data-project-vote]").forEach((button) => {
    button.addEventListener("click", () => setProjectVote(button.dataset.projectVote));
  });
  projectOps.querySelectorAll("[data-project-reaction]").forEach((button) => {
    button.addEventListener("click", () => toggleProjectReaction(Number(button.dataset.reactionProjectId || selectedDocumentId), button.dataset.projectReaction));
  });
  projectOps.querySelectorAll("[data-project-highlight]").forEach((button) => {
    button.addEventListener("click", () => toggleProjectHighlight(Number(button.dataset.highlightProjectId || selectedDocumentId), button.dataset.projectHighlight === "true"));
  });
  projectOps.querySelectorAll("[data-personal-mark]").forEach((button) => {
    button.addEventListener("click", () => setPersonalMark(button.dataset.personalMark));
  });
  projectOps.querySelector("[data-add-shortlist]")?.addEventListener("click", () => addToShortlist(selectedDocumentId));
  projectOps.querySelector("[data-nominate-project]")?.addEventListener("click", () => nominateProject(selectedDocumentId));
  projectOps.querySelectorAll("[data-similar-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.similarId));
  });
  projectOps.querySelectorAll("[data-compare-id]").forEach((button) => {
    button.addEventListener("click", () => compareWithSelected(Number(button.dataset.compareId)));
  });
}

function similarProjectCard(item) {
  const project = item.project || {};
  const compare = item.compare || {};
  return `
    <article class="similarCard">
      <strong>${escapeHtml(project.project_name || project.company_name || t("unknown"))}</strong>
      <small>${escapeHtml(project.industry || "")} · ${t("screeningScore")} ${Number(project.screening_score || 0)} · ${t("similarBp")} ${Number(item.similarity_score || 0)}</small>
      <p>${escapeHtml(compare.verdict || "")}</p>
      <div class="tags">${(compare.candidate_better || []).slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="recommendActions">
        <button type="button" data-similar-id="${project.document_id}" ${buttonAttrs(t("view"))}>${iconLabel("chevronRight", t("view"))}</button>
        <button type="button" class="secondary" data-compare-id="${project.document_id}" ${buttonAttrs(t("compare"))}>${iconLabel("copy", t("compare"))}</button>
      </div>
    </article>
  `;
}

async function loadSimilarProjects(documentId) {
  if (!documentId || !selectedProject) return;
  const response = await apiFetch(`/api/projects/${documentId}/similar?lang=${encodeURIComponent(lang)}`);
  if (!response) return;
  const data = await response.json();
  if (data.error) return;
  renderProjectOps(selectedProject, data.similar || []);
}

async function setProjectGlobalStatus(status) {
  await postProjectOps({ action: "global_status", status });
}

async function setProjectVote(vote) {
  await postProjectOps({ action: "vote", vote });
}

async function setPersonalMark(mark) {
  await postProjectOps({ action: "personal_mark", mark });
}

async function postProjectOps(payload) {
  if (!selectedDocumentId) return;
  const response = await apiFetch(`/api/projects/${selectedDocumentId}/marks`, {
    method: "POST",
    body: JSON.stringify({ ...payload, metadata: clientMetadata() }),
  });
  if (!response) return;
  const data = await response.json();
  if (data.ops && selectedProject) {
    selectedProject.ops = data.ops;
    const index = projects.findIndex((item) => Number(item.document_id) === Number(selectedDocumentId));
    if (index >= 0) projects[index] = { ...projects[index], ops: data.ops };
    renderProjectList();
    renderProjectOps(selectedProject);
    await loadSimilarProjects(selectedDocumentId);
    await loadReviewBoard();
  }
}

async function toggleProjectLike(documentId) {
  return toggleProjectReaction(documentId, "like");
}

function projectActionKey(documentId, action) {
  return `${Number(documentId || 0)}:${action}`;
}

function isProjectActionPending(documentId, action) {
  return projectActionRequests.has(projectActionKey(documentId, action));
}

function beginProjectAction(documentId, action) {
  const key = projectActionKey(documentId, action);
  if (projectActionRequests.has(key)) return false;
  projectActionRequests.add(key);
  return true;
}

function finishProjectAction(documentId, action) {
  projectActionRequests.delete(projectActionKey(documentId, action));
}

function cloneProjectOps(ops, documentId = 0) {
  const fallback = {
    document_id: Number(documentId || 0),
    actor: currentUser || "",
    global_status: { status: "new", note: "", set_by: "", updated_at: "" },
    personal_marks: [],
    my_marks: [],
    votes: { support: 0, oppose: 0, neutral: 0 },
    my_vote: "",
    shortlisted_by: [],
    in_my_shortlist: false,
    my_shortlist_position: 0,
    nominated_by: [],
    highlights: { count: 0, actors: [], highlighted_by_me: false },
    likes: { count: 0, actors: [], liked_by_me: false },
    dislikes: { count: 0, actors: [], disliked_by_me: false },
  };
  return JSON.parse(JSON.stringify({ ...fallback, ...(ops || {}) }));
}

function currentProjectOps(documentId) {
  const project = projects.find((item) => Number(item.document_id) === Number(documentId));
  return cloneProjectOps(project?.ops || selectedProject?.ops, documentId);
}

function updateActorBucket(bucket = {}, activeKey, active) {
  const actor = currentUser || "";
  const actors = sortTeamActors((bucket.actors || []).filter((item) => item !== actor));
  if (active && actor) actors.push(actor);
  const nextActors = sortTeamActors(actors);
  return {
    ...bucket,
    actors: nextActors,
    count: nextActors.length,
    [activeKey]: Boolean(active),
  };
}

function optimisticHighlightOps(previousOps, highlighted) {
  const nextOps = cloneProjectOps(previousOps, previousOps?.document_id);
  nextOps.highlights = updateActorBucket(nextOps.highlights, "highlighted_by_me", highlighted);
  const marks = new Set(nextOps.my_marks || []);
  if (highlighted) {
    marks.add("highlight");
  } else {
    marks.delete("highlight");
  }
  nextOps.my_marks = [...marks];
  return nextOps;
}

function optimisticReactionOps(previousOps, reaction = "like") {
  const nextOps = cloneProjectOps(previousOps, previousOps?.document_id);
  const normalizedReaction = reaction === "dislike" ? "dislike" : "like";
  const activeKey = normalizedReaction === "dislike" ? "disliked_by_me" : "liked_by_me";
  const currentBucket = normalizedReaction === "dislike" ? nextOps.dislikes : nextOps.likes;
  const willActivate = !Boolean(currentBucket?.[activeKey]);
  nextOps.likes = updateActorBucket(nextOps.likes, "liked_by_me", false);
  nextOps.dislikes = updateActorBucket(nextOps.dislikes, "disliked_by_me", false);
  if (willActivate) {
    if (normalizedReaction === "dislike") {
      nextOps.dislikes = updateActorBucket(nextOps.dislikes, "disliked_by_me", true);
    } else {
      nextOps.likes = updateActorBucket(nextOps.likes, "liked_by_me", true);
    }
  }
  return nextOps;
}

function showProjectActionError(message = "") {
  window.clearTimeout(projectActionStatusTimer);
  projectListState = {
    phase: "actionError",
    message: message || t("projectActionFailed"),
    error: "",
  };
  renderProjectListStatus();
  projectActionStatusTimer = window.setTimeout(() => {
    if (projectListState.phase === "actionError") {
      setProjectListState({ phase: "idle" });
    }
  }, 3600);
}

async function toggleProjectReaction(documentId, reaction = "like") {
  if (!documentId) return;
  const normalizedReaction = reaction === "dislike" ? "dislike" : "like";
  const action = `reaction:${normalizedReaction}`;
  if (!beginProjectAction(documentId, action)) return;
  const previousOps = currentProjectOps(documentId);
  applyProjectOpsState(Number(documentId), optimisticReactionOps(previousOps, normalizedReaction));
  try {
    const response = await apiFetch(`/api/projects/${documentId}/like`, {
      method: "POST",
      body: JSON.stringify({ reaction: normalizedReaction }),
    });
    if (!response) throw new Error(t("projectActionFailed"));
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) throw new Error(data.error || t("projectActionFailed"));
    if (data.ops) {
      applyProjectOpsState(Number(documentId), data.ops);
    }
  } catch (error) {
    applyProjectOpsState(Number(documentId), previousOps);
    showProjectActionError(error?.message || t("projectActionFailed"));
  } finally {
    finishProjectAction(documentId, action);
    renderProjectList();
  }
}

async function toggleProjectHighlight(documentId, highlighted) {
  if (!documentId) return;
  if (!beginProjectAction(documentId, "highlight")) return;
  const previousOps = currentProjectOps(documentId);
  applyProjectOpsState(Number(documentId), optimisticHighlightOps(previousOps, Boolean(highlighted)));
  try {
    const response = await apiFetch(`/api/projects/${documentId}/marks`, {
      method: "POST",
      body: JSON.stringify({ action: "highlight", highlighted: Boolean(highlighted), metadata: clientMetadata() }),
    });
    if (!response) throw new Error(t("projectActionFailed"));
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) throw new Error(data.error || t("projectActionFailed"));
    if (data.ops) {
      applyProjectOpsState(Number(documentId), data.ops);
    }
  } catch (error) {
    applyProjectOpsState(Number(documentId), previousOps);
    showProjectActionError(error?.message || t("projectActionFailed"));
  } finally {
    finishProjectAction(documentId, "highlight");
    renderProjectList();
  }
}

function applyProjectOpsState(documentId, ops) {
  const index = projects.findIndex((item) => Number(item.document_id) === Number(documentId));
  if (index >= 0) projects[index] = { ...projects[index], ops };
  if (Number(selectedDocumentId) === Number(documentId) && selectedProject) {
    selectedProject.ops = ops;
    renderProjectOps(selectedProject);
  }
  renderProjectList();
}

function updateProjectOpsState(documentId, ops) {
  applyProjectOpsState(documentId, ops);
  if (Number(selectedDocumentId) === Number(documentId) && selectedProject) {
    loadSimilarProjects(documentId);
  }
}

async function addToShortlist(documentId) {
  if (!documentId) return;
  const response = await apiFetch("/api/shortlist", {
    method: "POST",
    body: JSON.stringify({ document_id: Number(documentId) }),
  });
  if (!response) return;
  await loadReviewBoard();
  await refreshProjectOps(Number(documentId));
}

async function nominateProject(documentId) {
  if (!documentId) return;
  const response = await apiFetch("/api/nominations", {
    method: "POST",
    body: JSON.stringify({ document_id: Number(documentId), lang, metadata: clientMetadata() }),
  });
  if (!response) return;
  const data = await response.json().catch(() => ({}));
  if (data.error) {
    alert(data.error);
    return;
  }
  await loadReviewBoard();
  await refreshProjectOps(Number(documentId));
}

async function refreshProjectOps(documentId) {
  const response = await apiFetch(`/api/projects/${documentId}/marks`);
  if (!response) return;
  const data = await response.json();
  const index = projects.findIndex((item) => Number(item.document_id) === Number(documentId));
  if (index >= 0) {
    projects[index] = { ...projects[index], ops: data.ops };
    renderProjectList();
  }
  if (Number(selectedDocumentId) === Number(documentId) && selectedProject) {
    selectedProject.ops = data.ops;
    renderProjectOps(selectedProject);
    await loadSimilarProjects(documentId);
  }
}

async function compareWithSelected(candidateId) {
  if (!selectedDocumentId || !candidateId) return;
  const response = await apiFetch("/api/compare", {
    method: "POST",
    body: JSON.stringify({ document_ids: [selectedDocumentId, candidateId], lang }),
  });
  if (!response) return;
  const data = await response.json();
  const message = [
    data.verdict,
    ...(data.tradeoffs || []),
    ...(data.risks_to_check || []).map((item) => `${t("risks")}: ${item}`),
  ].filter(Boolean).join("\n");
  alert(message || JSON.stringify(data.rows || [], null, 2));
}

async function loadProjectContext(documentId) {
  const response = await apiFetch(`/api/projects/${documentId}/context?lang=${encodeURIComponent(lang)}`);
  if (!response) return;
  const data = await response.json();
  const context = data.context || {};
  if (teamPresence) {
    teamPresence.innerHTML = `<h3>${t("teamPresence")}</h3><div>${renderPresenceChips(context.statuses || [])}</div>`;
  }
  if (teamViewSummary) {
    teamViewSummary.innerHTML = `<h3>${t("teamViewSummary")}</h3><p>${escapeHtml(context.team_summary || "")}</p>`;
  }
  if (contextList) {
    const comments = context.comments || [];
    contextList.innerHTML = comments.length
      ? comments
          .map(
            (item) => `
              <article class="contextItem ${escapeHtml(item.type || "comment")}">
                <strong>${renderAvatar(item.actor, "small")} ${escapeHtml(userDisplayName(item.actor))}</strong>
                <small>${escapeHtml(item.type || "comment")} · ${escapeHtml(item.created_at || "")}</small>
                <p>${escapeHtml(item.content || "")}</p>
              </article>
            `,
          )
          .join("")
      : `<p class="subtle">${t("commentsEmpty")}</p>`;
  }
}

async function addProjectComment() {
  if (!selectedDocumentId || !contextComment) return;
  const content = contextComment.value.trim();
  if (!content) {
    contextComment.focus();
    return;
  }
  const response = await apiFetch(`/api/projects/${selectedDocumentId}/context`, {
    method: "POST",
    body: JSON.stringify({ type: "comment", content, lang, metadata: clientMetadata() }),
  });
  if (!response?.ok) return;
  contextComment.value = "";
  await loadProjectContext(selectedDocumentId);
  await refreshProjectCollaboration(selectedDocumentId);
}

async function markNotInterested() {
  if (!selectedDocumentId) return;
  await recordProjectActivity(selectedDocumentId, "not_interested");
}

async function askProjectAssistant() {
  if (!selectedDocumentId || !projectQuestion) return;
  const question = projectQuestion.value.trim();
  if (!question) {
    projectQuestion.focus();
    return;
  }
  projectAssistantResult.innerHTML = `<p class="subtle">${t("aiThinking")}</p>`;
  const finishVrtAgentWork = beginVrtAgentWork();
  try {
    const response = await apiFetch(`/api/projects/${selectedDocumentId}/assistant`, {
      method: "POST",
      body: JSON.stringify({ question, lang, metadata: clientMetadata() }),
    });
    if (!response) return;
    const data = await response.json();
    if (data.error) {
      projectAssistantResult.innerHTML = `<p class="errorText">${escapeHtml(data.error)}</p>`;
      return;
    }
    projectAssistantResult.innerHTML = `
      <article class="aiAnswer">
        <p>${escapeHtml(data.answer || "")}</p>
        ${data.team_summary ? `<p><strong>${t("teamViewSummary")}:</strong> ${escapeHtml(data.team_summary)}</p>` : ""}
        ${
          data.partner_cues?.length
            ? `<ul>${data.partner_cues.map((cue) => `<li>${escapeHtml(cue)}</li>`).join("")}</ul>`
            : ""
        }
      </article>
    `;
    projectQuestion.value = "";
    await loadProjectContext(selectedDocumentId);
    await refreshProjectCollaboration(selectedDocumentId);
  } finally {
    finishVrtAgentWork();
  }
}

async function recordProjectActivity(documentId, status, options = {}) {
  const response = await apiFetch(`/api/projects/${documentId}/activity`, {
    method: "POST",
    body: JSON.stringify({ status, lang, metadata: clientMetadata() }),
  });
  if (!response?.ok) return;
  if (options.refresh !== false) {
    await loadProjectContext(documentId);
    await refreshProjectCollaboration(documentId);
  }
}

async function refreshProjectCollaboration(documentId) {
  const response = await apiFetch(`/api/projects/${documentId}/context?lang=${encodeURIComponent(lang)}`);
  if (!response) return;
  const data = await response.json();
  const index = projects.findIndex((item) => Number(item.document_id) === Number(documentId));
  if (index >= 0) {
    projects[index] = { ...projects[index], collaboration: data.context };
    renderProjectList();
  }
}

function openSourceFile(documentId, sourceUrl = "") {
  if (/^https?:\/\//i.test(sourceUrl)) {
    window.open(sourceUrl, "_blank", "noopener,noreferrer");
    return;
  }
  fetch(`/api/files/${documentId}`, {
    headers: authHeaders(),
  })
    .then((response) => {
      if (!response.ok) throw new Error("File unavailable");
      return response.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    })
    .catch(() => alert(lang === "zh" ? "原文件暂不可用" : "Source file is not available yet"));
}

async function apiFetch(url, options = {}) {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["content-type"] = "application/json";
  }
  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    const errorPayload = await response.clone().json().catch(() => ({}));
    localStorage.removeItem("bp-screener-user");
    localStorage.removeItem("bp-screener-access-code");
    sessionStorage.removeItem("bp-screener-session-token");
    hasUserConfirmedEntry = false;
    currentUser = "";
    accessCode = "";
    sessionToken = "";
    if (accessCodeInput) accessCodeInput.value = "";
    loginOverlay.classList.remove("hidden");
    loginError.textContent = errorPayload.error || t("invalidAccessCode");
    triggerAuthError(loginForm, userSelect);
    userSelect.focus();
    return null;
  }
  return response;
}

function authHeaders() {
  return {
    "x-bp-user": currentUser,
    "x-bp-timezone": userTimezone,
    "x-bp-locale": currentLocale(),
    ...(sessionToken ? { "x-bp-session-token": sessionToken } : {}),
  };
}

function renderCharts(items) {
  const chartGrid = document.querySelector("#chartGrid");
  renderOverviewStatus();
  if (!chartGrid) return;
  if (!items.length && projectListState.phase === "loading") {
    chartGrid.innerHTML = overviewLoadingBlock("overviewLoading");
    if (bpLeaderboardSpotlight) bpLeaderboardSpotlight.innerHTML = overviewLoadingBlock("overviewLoading");
    return;
  }
  if (!items.length && projectListState.phase === "error") {
    chartGrid.innerHTML = overviewErrorBlock(projectListState.error);
    chartGrid.querySelector("[data-overview-retry]")?.addEventListener("click", loadProjects);
    if (bpLeaderboardSpotlight) bpLeaderboardSpotlight.innerHTML = `<p class="subtle errorText">${escapeHtml(t("overviewLoadError"))}</p>`;
    return;
  }
  if (!items.length) {
    chartGrid.innerHTML = `<article class="chartCard overviewEmptyCard"><strong>${escapeHtml(t("overviewEmpty"))}</strong></article>`;
    return;
  }
  chartGrid.innerHTML = [
    barChart(t("industryChart"), countBy(items, "industry")),
    barChart(t("stageChart"), countBy(items, "financing_stage")),
    barChart(t("recommendationChart"), countBy(items, "recommendation")),
  ].join("");
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const raw = String(item[key] || t("unknown"));
    const parts = raw.split(/[；/|,，]/).map((part) => part.trim()).filter(Boolean);
    const value = parts[0] || t("unknown");
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function barChart(title, rows) {
  const max = Math.max(1, ...rows.map(([, count]) => count));
  return `
    <article class="chartCard">
      <h3>${escapeHtml(title)}</h3>
      ${rows
        .slice(0, 3)
        .map(
          ([name, count]) => `
            <div class="barRow">
              <span title="${escapeHtml(name)}">${escapeHtml(shorten(name))}</span>
              <div class="barTrack"><div class="barFill" style="width:${(count / max) * 100}%"></div></div>
              <strong>${count}</strong>
            </div>
          `,
        )
        .join("")}
    </article>
  `;
}

function shorten(value) {
  const text = String(value || "");
  return text.length > 14 ? `${text.slice(0, 13)}…` : text;
}

function detailItem(label, value) {
  return `<div class="detailItem"><small>${escapeHtml(label)}</small>${escapeHtml(value || t("unknown"))}</div>`;
}

function join(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function icon(name, className = "buttonIcon") {
  const path = ICON_PATHS[name] || ICON_PATHS.chevronRight;
  return `<svg class="${escapeHtml(className)}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path}</svg>`;
}

function iconLabel(name, label) {
  return `${icon(name)}<span>${escapeHtml(label)}</span>`;
}

function buttonAttrs(label) {
  const safeLabel = escapeHtml(label);
  return `title="${safeLabel}" aria-label="${safeLabel}"`;
}

function factorLabel(factor) {
  return factor?.name?.[lang] || factor?.label?.[lang] || factor?.label?.en || factor?.label?.zh || factor?.key || "";
}

function factorDescription(factor) {
  return factor?.description?.[lang] || factor?.description?.en || factor?.description?.zh || "";
}

function factorIdentity(factor) {
  if (!factor) return "";
  return factor.id ? `db:${factor.id}` : `system:${factor.key}`;
}

function factorScope(factor) {
  const scope = String(factor?.scope || (factor?.id ? "personal" : "system")).toLowerCase();
  if (scope === "public" || scope === "personal" || scope === "system") return scope;
  return factor?.id ? "personal" : "system";
}

function factorScopeLabel(scope) {
  if (scope === "public") return t("publicScope");
  if (scope === "personal") return t("personalScope");
  return t("systemScope");
}

function factorCategoryKey(factor) {
  const key = String(factor?.category || "overall_fit").trim();
  return key || "overall_fit";
}

function factorCategoryOrder() {
  const baseOrder = [
    "overall_fit",
    "financial",
    "founder_team",
    "market_industry",
    "product_technology",
    "business_customer",
    "risk",
  ];
  const extra = defaultFactors
    .map(factorCategoryKey)
    .filter((category) => !baseOrder.includes(category));
  return [...baseOrder, ...new Set(extra)];
}

function factorCategoryLabel(category) {
  const labelsByCategory = {
    overall_fit: t("factorCategoryOverall"),
    financial: t("factorCategoryFinancial"),
    founder_team: t("factorCategoryFounderTeam"),
    market_industry: t("factorCategoryMarketIndustry"),
    product_technology: t("factorCategoryProductTechnology"),
    business_customer: t("factorCategoryBusinessCustomer"),
    risk: t("factorCategoryRisk"),
  };
  return labelsByCategory[category] || category;
}

function value(selector) {
  return document.querySelector(selector)?.value.trim() || "";
}

function setParam(params, key, item) {
  if (item) params.set(key, item);
}

function resolveUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function currentLocale() {
  return navigator.language || (lang === "zh" ? "zh-CN" : "en-US");
}

function clientMetadata() {
  return {
    timezone: userTimezone,
    locale: currentLocale(),
    client_time: new Date().toISOString(),
  };
}

function parseUtcTimestamp(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const normalized = /[zZ]|[+-]\d\d:?\d\d$/.test(text)
    ? text
    : `${text.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function localDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: userTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseDateKey(key) {
  const match = String(key || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
}

function dateKeyFromUtcDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, count) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + count);
  return next;
}

function startOfWeek(date) {
  const day = date.getUTCDay() || 7;
  return addDays(date, 1 - day);
}

function formatCalendarMonthLabel(key) {
  const date = parseDateKey(key);
  if (!date) return "";
  return new Intl.DateTimeFormat(currentLocale(), { month: "short", timeZone: "UTC" }).format(date);
}

function formatCalendarDateLabel(key) {
  const date = parseDateKey(key);
  if (!date) return key;
  return new Intl.DateTimeFormat(currentLocale(), {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function formatLocalDateTime(value) {
  const date = parseUtcTimestamp(value);
  if (!date) return value || "";
  return new Intl.DateTimeFormat(currentLocale(), {
    timeZone: userTimezone,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatUtcDateTime(value) {
  const date = parseUtcTimestamp(value);
  if (!date) return value || "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
