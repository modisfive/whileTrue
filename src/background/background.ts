import { isPropertyExists } from "../common/utils";
import LocalStorage from "../common/storage";
import { StorageKey } from "../common/constants";
import HostRequest from "../common/request";

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
    LocalStorage.get(StorageKey.ACCESS_TOKEN).then((accessToken) =>
      sendResponse(isPropertyExists(accessToken))
    );
  } else if (request.from === "popup" && request.subject === "notionInfo") {
    LocalStorage.get(StorageKey.NOTION_INFO).then((notionInfo) => {
      sendResponse(isPropertyExists(notionInfo));
    });
  } else if (request.from === "oauth" && request.subject === "accessToken") {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
      if (request.isSuccess) {
        LocalStorage.set(StorageKey.ACCESS_TOKEN, request.token);
        const optionsPage = `chrome-extension://${chrome.runtime.id}/options.html`;
        chrome.tabs.create({ url: optionsPage, selected: true });
      }
    });
  } else if (request.from === "options" && request.subject === "databaseUrl") {
    HostRequest.sendDatabaseID(request.databaseUrl).then((resp) => {
      LocalStorage.set(StorageKey.NOTION_INFO, resp.data);
    });
  } else if (request.from === "options" && request.subject === "accessToken") {
    if (request.todo === "show") {
      LocalStorage.get(StorageKey.ACCESS_TOKEN).then((accessToken) => console.log(accessToken));
    } else if (request.todo === "delete") {
      LocalStorage.remove(StorageKey.ACCESS_TOKEN).then(() =>
        console.log("Access Token을 삭제했습니다.")
      );
    }
  } else if (request.from === "options" && request.subject === "notionInfo") {
    HostRequest.getMemberNotionInfo().then((resp) => console.log(resp));
  } else if (request.from === "options" && request.subject === "allProblems") {
    HostRequest.getAllProblemList().then((resp) => console.log(resp));
  } else if (request.from === "problemPage" && request.subject === "checkProblemList") {
    LocalStorage.get(StorageKey.PROBLEM_LIST).then((problemList) => {
      if (!isPropertyExists(problemList)) {
        HostRequest.getAllProblemList().then((resp) =>
          LocalStorage.set(StorageKey.PROBLEM_LIST, resp.data.problemList)
        );
      }
    });
  } else if (request.from === "problemPage" && request.subject === "selectRandomProblem") {
    LocalStorage.get(StorageKey.PROBLEM_LIST).then((problemList: any) => {
      const totalCount = problemList.length;
      const randomIndex = Math.floor(Math.random() * totalCount);
      sendResponse(problemList[randomIndex]);
    });
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
