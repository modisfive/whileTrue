import { SiteHost, StorageKey } from "../common/constants";
import LocalStorage from "../common/storage";
import { getCurrentHost } from "../common/utils";
import getBaekjoonProblem from "./baekjoon";
import startOAuthProcess from "./oauth";

if (window.location.host === "github.com") {
  LocalStorage.get(StorageKey.OAUTH_PROCESS_STATUS).then((isStarted) => {
    if (isStarted) {
      startOAuthProcess(window.location.href);
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
  const savedProblem = await LocalStorage.get(StorageKey.LATEST_PROBLEM);
  const { isExist, isChanged, problem } = await parse(savedProblem);

  if (isChanged) {
    LocalStorage.set(StorageKey.LATEST_PROBLEM, problem);
  }

  return { isExist, problem };
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "popup" && request.subject === "ProblemInfo") {
    getProblemInfo().then((resp) => {
      sendResponse(resp);
    });
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
