import { ProblemPage } from "../common/class";
import { StorageKey } from "../common/constants";
import LocalStorage from "../common/storage";
import DefaultDatabaseRequestDto from "./dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "./dto/request/ProblemPageRequestDto";
import CheckDatabaseResponseDto from "./dto/response/CheckDatabaseResponseDto";
import ProblemListResponseDto from "./dto/response/ProblemListResponseDto";
import SuccessResponseDto from "./dto/response/SuccessResponseDto";

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
  validateUserNotion: async function (
    notionApiKey: string,
    databaseId: string
  ): Promise<CheckDatabaseResponseDto> {
    const requestURL = `${HOST_URL}/api/notion/database/check`;
    return await requestPost(requestURL, new DefaultDatabaseRequestDto(notionApiKey, databaseId));
  },
  fetchAllProblemPageList: async function (): Promise<ProblemListResponseDto> {
    const requestURL = `${HOST_URL}/api/notion/problem/list`;
    const notionApiKey = await LocalStorage.get(StorageKey.NOTION_API_KEY);
    const databaseId = await LocalStorage.get(StorageKey.DATABASE_ID);
    return await requestPost(requestURL, new DefaultDatabaseRequestDto(notionApiKey, databaseId));
  },
  saveNewProblem: async function (problemPage: ProblemPage): Promise<SuccessResponseDto> {
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
