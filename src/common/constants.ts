enum SiteType {
  BOJ = "BOJ",
  PROGRAMMERS = "PROGRAMMERS",
  SWEA = "SWEA",
}

enum IconType {
  EMOJI = "EMOJI",
  EXTERNAL = "EXTERNAL",
  FILE = "FILE",
}

enum SiteHost {
  BOJ = "www.acmicpc.net",
  PROGRAMMERS = "school.programmers.co.kr",
}

enum StorageKey {
  OAUTH_PROCESS_STATUS = "oauth_process_status",
  ACCESS_TOKEN = "access_token",
  NOTION_INFO = "notion_information",
  PROBLEM_PAGE_LIST = "problem_page_list",
}

enum OAuth {
  REDIRECT_HOST = "whiletrue.co.kr",
  NOTION_AUTH_URL = "https://api.notion.com/v1/oauth/authorize?client_id=36993609-798b-4704-ab63-e8f864eecfdd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fwhiletrue.co.kr%2Fmember%2Foauth%2Fredirect",
}

export { SiteType, IconType, SiteHost, StorageKey, OAuth };
