import { RESP_STATUS, StorageKey } from "../common/constants";
import HostRequest from "../api/request";
import LocalStorage from "../common/storage";
import CheckDatabaseResponseDto from "../api/dto/response/CheckDatabaseResponseDto";
import Utils from "../common/utils";

const handleMessageFromOptions = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "databaseUrl":
      const databaseId = Utils.parseNotionDatabaseId(request.databaseUrl);
      HostRequest.validateUserNotion(request.notionApiKey, databaseId).then(
        (resp: CheckDatabaseResponseDto) => {
          if (resp.validCheck == RESP_STATUS.SUCCESS) {
            LocalStorage.set(StorageKey.NOTION_API_KEY, request.notionApiKey);
            LocalStorage.set(StorageKey.DATABASE_ID, resp.databaseId);
          }
          LocalStorage.set(StorageKey.RESP_STATUS, resp.validCheck).then(() =>
            sendResponse(resp.validCheck)
          );
        }
      );
      break;

    case "databasePage":
      const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
      chrome.tabs.create({ url: databasePage, selected: true }).then(() => sendResponse());
      break;

    case "exit":
      Promise.all([
        LocalStorage.remove(StorageKey.NOTION_API_KEY),
        LocalStorage.remove(StorageKey.DATABASE_ID),
        LocalStorage.remove(StorageKey.PROBLEM_PAGE_LIST),
        LocalStorage.remove(StorageKey.RESP_STATUS),
      ]).then(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          chrome.tabs.remove(tabs[0].id);
        });
      });
      break;

    default:
      break;
  }
};

export default handleMessageFromOptions;
