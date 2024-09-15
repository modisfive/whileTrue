import { RESP_STATUS, StorageKey } from "../common/constants";
import HostRequest from "../api/request";
import LocalStorage from "../common/storage";
import CheckDatabaseResponseDto from "../api/dto/response/CheckDatabaseResponseDto";
import Utils from "../common/utils";
import { initialize } from "./initalSettings";

const handleDatabaseUrl = async (request: any, sendResponse: CallableFunction) => {
  const databaseId = Utils.parseNotionDatabaseId(request.databaseUrl);
  const resp: CheckDatabaseResponseDto = await HostRequest.validateUserNotion(
    request.notionApiKey,
    databaseId
  );

  /* 연동 성공 시 초기 기본 설정 */
  if (resp.validCheck === RESP_STATUS.SUCCESS) {
    await initialize({ notionApiKey: request.notionApiKey, databaseId: resp.databaseId });
  }
  await LocalStorage.set(StorageKey.RESP_STATUS, resp.validCheck);
  sendResponse(resp.validCheck);
};

const handleDatabasePage = async () => {
  const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
  await chrome.tabs.create({ url: databasePage, selected: true });
};

const handleExit = async () => {
  await Promise.all([
    LocalStorage.remove(StorageKey.NOTION_API_KEY),
    LocalStorage.remove(StorageKey.DATABASE_ID),
    LocalStorage.remove(StorageKey.PROBLEM_PAGE_LIST),
    LocalStorage.remove(StorageKey.RESP_STATUS),
  ]);

  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  await chrome.tabs.remove(tabs[0].id);
};

const handleMessageFromOptions = (request: any, sendResponse: CallableFunction) => {
  switch (request.subject) {
    case "databaseUrl":
      handleDatabaseUrl(request, sendResponse);
      break;

    case "databasePage":
      handleDatabasePage();
      break;

    case "exit":
      handleExit();
      break;

    default:
      break;
  }
};

export default handleMessageFromOptions;
