import { StorageKey } from "../common/enums/storage.enum";
import { ProblemOptions } from "../common/models/problem-options.model";
import LocalStorage from "../common/storage";

/* 연동 초기 설정 */
export const initialize = async ({ notionApiKey, databaseId }) => {
  await LocalStorage.set(StorageKey.NOTION_API_KEY, notionApiKey);
  await LocalStorage.set(StorageKey.DATABASE_ID, databaseId);
  /* 기본으로 모든 문제 필터 하지 않도록 설정 */
  await LocalStorage.set(StorageKey.PROBLEM_OPTIONS, new ProblemOptions(true, true, true));
};
