import { SiteHost } from "../common/enum";
import { getOAuthProcessStatus, getSavedProblem, setSavedProblem } from "../common/storage";
import { getCurrentHost } from "../common/utils";
import getBaekjoonProblem from "./baekjoon";
import startOAuthProcess from "./oauth";

if (window.location.host === "github.com") {
  getOAuthProcessStatus().then((isStarted) => {
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
  const savedProblem = await getSavedProblem();
  const { isExist, isChanged, problem } = await parse(savedProblem);

  if (isChanged) {
    setSavedProblem(problem);
  }

  return { isExist, problem };
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "popup" && request.subject === "ProblemInfo") {
    getProblemInfo().then((resp) => sendResponse(resp));
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
