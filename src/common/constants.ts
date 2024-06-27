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
  ACCESS_TOKEN = "access_token",
  DATABASE_ID = "database_id",
  NOTION_INFO = "notion_information",
  PROBLEM_PAGE_LIST = "problem_page_list",
  RESP_STATUS = "response_status",
}

enum RESP_STATUS {
  SUCCESS = "success",
  FAILED = "failed",
  NOT_FOUND = "not_found",
  INVALID = "invalid",
}

export { SiteType, IconType, SiteHost, StorageKey, RESP_STATUS };
