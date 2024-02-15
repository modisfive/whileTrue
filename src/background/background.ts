import { getAllProblemList, getMemberNotionInfo, sendDatabaseID } from "../common/request";
import {
  getAccessToken,
  getProblemList,
  getUserInfo,
  setAccessToken,
  setProblemList,
} from "../common/storage";
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
  } else if (request.from === "options" && request.subject === "databaseUrl") {
    sendDatabaseID(request.databaseUrl).then((resp) => {
      console.log(resp);
    });
  } else if (
    request.from === "options" &&
    request.subject === "accessToken" &&
    request.todo === "show"
  ) {
    getAccessToken().then((accessToken) => console.log(accessToken));
  } else if (
    request.from === "options" &&
    request.subject === "accessToken" &&
    request.todo === "delete"
  ) {
    chrome.storage.local
      .remove("access_token")
      .then(() => console.log("Access Token을 삭제했습니다."));
  } else if (request.from === "options" && request.subject === "userInfo") {
    getMemberNotionInfo().then((resp) => console.log(resp));
  } else if (request.from === "options" && request.subject === "allProblems") {
    getAllProblemList().then((resp) => console.log(resp));
  } else if (request.from === "problemPage" && request.subject === "checkProblemList") {
    getProblemList().then((problemList) => {
      if (!isPropertyExists(problemList)) {
        getAllProblemList().then((resp) => {
          setProblemList(resp.data.problemList);
        });
      }
    });
  } else if (request.from === "problemPage" && request.subject === "selectRandomProblem") {
    getProblemList().then((problemList: any) => {
      const totalCount = problemList.length;
      const randomIndex = Math.floor(Math.random() * totalCount);
      sendResponse(problemList[randomIndex]);
    });
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
