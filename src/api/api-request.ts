import { StorageKey } from "../common/enums/storage.enum";
import { IProblemPage } from "../common/models/problem-page.model";
import LocalStorage from "../common/storage";
import DefaultDatabaseRequestDto from "./dto/request/default-database-request.dto";
import ProblemPageRequestDto from "./dto/request/problem-page-request.dto";
import { ICheckDatabaseResponse } from "./dto/response/check-database-response.dto";
import { IProblemListResponse } from "./dto/response/problem-list-response.dto";
import { ISuccessResponse } from "./dto/response/success-response.dto";
const HOST_URL = "https://whiletrue-notion-api.fly.dev";

const requestPost = async (targetUrl: string, body: any) => {
  return await fetch(targetUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "same-origin",
  }).then((resp) => resp.json());
};

const HostRequest = {
  async validateUserNotion(
    notionApiKey: string,
    databaseId: string
  ): Promise<ICheckDatabaseResponse> {
    const requestURL = `${HOST_URL}/api/notion/database/check`;
    return await requestPost(requestURL, new DefaultDatabaseRequestDto(notionApiKey, databaseId));
  },
  async fetchAllProblemPageList(): Promise<IProblemListResponse> {
    const requestURL = `${HOST_URL}/api/notion/problem/list`;
    const notionApiKey = await LocalStorage.get(StorageKey.NOTION_API_KEY);
    const databaseId = await LocalStorage.get(StorageKey.DATABASE_ID);
    return await requestPost(requestURL, new DefaultDatabaseRequestDto(notionApiKey, databaseId));
  },
  async saveNewProblem(problemPage: IProblemPage): Promise<ISuccessResponse> {
    const requestURL = `${HOST_URL}/api/notion/problem/save`;
    const notionApiKey = await LocalStorage.get(StorageKey.NOTION_API_KEY);
    const databaseId = await LocalStorage.get(StorageKey.DATABASE_ID);
    return await requestPost(
      requestURL,
      new ProblemPageRequestDto(notionApiKey, databaseId, problemPage)
    );
  },
};

export default HostRequest;
