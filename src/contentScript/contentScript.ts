import { Problem } from "../common/class";
import { getSavedProblem, setSavedProblem } from "../common/storage";
import getBaekjoonProblem from "./baekjoon";

const handleMessage = async (request: any, sender: any, sendResponse: any) => {
  if (request.from === "popup" && request.subject === "ProblemInfo") {
    const savedProblem: Problem = await getSavedProblem();
    const { isExist, isChanged, problem } = await getBaekjoonProblem(savedProblem);

    if (isChanged) {
      await setSavedProblem(problem);
    }

    sendResponse(problem);
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
