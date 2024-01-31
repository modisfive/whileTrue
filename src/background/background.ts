import { fetchSolvedAcJson } from "../common/utils";

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "content" && request.subject === "BOJTitle") {
    fetchSolvedAcJson(request.problemNumber).then((resp) => sendResponse(resp.titleKo));
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
