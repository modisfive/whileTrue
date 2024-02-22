import { SiteHost, StorageKey } from "../common/constants";
import LocalStorage from "../common/storage";
import { getCurrentHost } from "../common/utils";
import getBaekjoonProblem from "./baekjoon";

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

const parse = async (savedProblem) => {
  const currentHost = getCurrentHost();

  switch (currentHost) {
    case SiteHost.BOJ:
      return await getBaekjoonProblem(savedProblem);

    default:
      return {
        isExist: false,
        isChanged: null,
        problem: null,
      };
  }
};

const getProblemInfo = async () => {
  return LocalStorage.get(StorageKey.LATEST_PROBLEM).then((savedProblem) => {
    return parse(savedProblem).then(({ isExist, isChanged, problem }) => {
      if (isChanged) {
        LocalStorage.set(StorageKey.LATEST_PROBLEM, problem);
      }
      return { isExist, problem };
    });
  });
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
