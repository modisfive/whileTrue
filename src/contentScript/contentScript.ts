import { getSavedProblem, setSavedProblem } from "../common/storage";
import getBaekjoonProblem from "./baekjoon";

const getProblemInfo = async () => {
  const savedProblem = await getSavedProblem();
  const { isExist, isChanged, problem } = await getBaekjoonProblem(savedProblem);

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
