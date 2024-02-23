import { SiteHost, StorageKey } from "../common/constants";
import LocalStorage from "../common/storage";
import { getCurrentHost } from "../common/utils";
import parseBaekjoonProblem from "./baekjoon";

if (window.location.host === "github.com") {
  LocalStorage.get(StorageKey.OAUTH_PROCESS_STATUS).then((isStarted) => {
    if (isStarted) {
      chrome.runtime.sendMessage({
        from: "content",
        subject: "oauth",
        url: window.location.href,
      });
    }
  });
}

const getProblemInfo = async () => {
  const currentHost = getCurrentHost();

  switch (currentHost) {
    case SiteHost.BOJ:
      return await parseBaekjoonProblem();

    default:
      return {
        isExist: false,
        problem: null,
      };
  }
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "popup" && request.subject === "currentProblem") {
    getProblemInfo().then((resp) => {
      sendResponse(resp);
    });
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
