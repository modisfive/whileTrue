import { getAccessToken, setAccessToken } from "../common/storage";

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
      sendResponse(typeof accessToken !== "undefined");
    });
  } else if (
    request.from === "oauth" &&
    request.subject === "accessToken" &&
    request.isSuccess === true
  ) {
    alert("Login Success!!!");
    setAccessToken(request.token).then(() => {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.remove(tabs[0].id);
      });
    });
  } else if (
    request.from === "oauth" &&
    request.subject === "accessToken" &&
    request.isSuccess === false
  ) {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
    });
  }
  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
