import { SiteHost, StorageKey } from "../common/constants";
import LocalStorage from "../common/storage";
import Utils from "../common/utils";
import baekjoon from "./baekjoon";

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
  const currentHost = Utils.getCurrentHost();

  switch (currentHost) {
    case SiteHost.BOJ:
      return await baekjoon();

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
