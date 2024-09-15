enum SiteHost {
  BOJ = "www.acmicpc.net",
  PROGRAMMERS = "school.programmers.co.kr",
}

enum SiteType {
  BOJ = "BOJ",
  PROGRAMMERS = "PROGRAMMERS",
  PROGRAMMERS_SQL = "PROGRAMMERS_SQL",
  SWEA = "SWEA",
}

enum StorageKey {
  NOTION_API_KEY = "notion_api_key",
  DATABASE_ID = "database_id",
  PROBLEM_PAGE_LIST = "problem_page_list",
  RESP_STATUS = "response_status",
  PROBLEM_OPTIONS = "problem_options",
}

enum IconType {
  EMOJI = "EMOJI",
  EXTERNAL = "EXTERNAL",
  FILE = "FILE",
}

enum RESP_STATUS {
  SUCCESS = "success",
  FAILED = "failed",
  NOT_FOUND = "not_found",
  INVALID = "invalid",
  UNAUTHORIZED = "unauthorized",
}

export { SiteType, IconType, SiteHost, StorageKey, RESP_STATUS };
