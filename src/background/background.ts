import { isProblemExists } from "../common/request";
import { getAccessToken, getUserInfo, setAccessToken } from "../common/storage";
import { isPropertyExists } from "../common/utils";

const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "content" && request.subject === "BOJTitle") {
    fetchSolvedAcJson(request.problemNumber).then((resp) => sendResponse(resp.titleKo));
  } else if (request.from === "popup" && request.subject === "accessToken") {
    getAccessToken().then((accessToken) => {
      console.log(accessToken);
      sendResponse(isPropertyExists(accessToken));
    });
  } else if (request.from === "popup" && request.subject === "userNotionInfo") {
    getUserInfo().then((userInfo) => {
      sendResponse(isPropertyExists(userInfo));
    });
  } else if (request.from === "oauth" && request.subject === "accessToken") {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
      if (request.isSuccess) {
        setAccessToken(request.token);
      }
    });
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
