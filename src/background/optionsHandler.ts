import { StorageKey } from "../common/constants";
import HostRequest from "../api/request";
import LocalStorage from "../common/storage";

const handleMessageFromOptions = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "databaseUrl":
      HostRequest.sendDatabaseID(request.databaseUrl).then((resp: any) => {
        if (resp.httpStatus == 200) {
          LocalStorage.set(StorageKey.NOTION_INFO, resp.data);
          sendResponse("SUCCESS");
        } else if (resp.code === "MEMBER-400-2") {
          sendResponse("INVALID");
        } else if (resp.code === "MEMBER-404-3") {
          sendResponse("NOT_FOUND");
        }
      });
      break;

    case "databasePage":
      const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
      chrome.tabs.create({ url: databasePage, selected: true }).then(() => sendResponse());
      break;

    case "exit":
      Promise.all([
        LocalStorage.remove(StorageKey.ACCESS_TOKEN),
        LocalStorage.remove(StorageKey.NOTION_INFO),
        LocalStorage.remove(StorageKey.PROBLEM_PAGE_LIST),
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
