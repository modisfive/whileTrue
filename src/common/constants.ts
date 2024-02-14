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
  ACCESS_TOKEN = "accessToken",
  OAUTH_PROCESS_STATUS = "oauthProcessStatus",
}

enum OAuth {
  NOTION_AUTH_URL = "https://api.notion.com/v1/oauth/authorize?client_id=36993609-798b-4704-ab63-e8f864eecfdd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fgithub.com",
}

export { SiteType, SiteHost, StorageKey, OAuth };
