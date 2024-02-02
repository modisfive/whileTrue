enum SiteType {
  BOJ = "백준",
  PROGRAMMERS = "프로그래머스",
  SWEA = "SWEA",
  LEETCODE = "LeetCode",
  DEFAULT = "DEFAULT_SITE",
}

enum SiteHost {
  BOJ = "www.acmicpc.net",
}

enum StorageKey {
  SAVED_PROBLEM = "savedProblem",
  NOTION_ACCESS_TOKEN = "notionAccessToken",
  OAUTH_PROCESS_STATUS = "oauthProcessStatus",
}

export { SiteType, SiteHost, StorageKey };
