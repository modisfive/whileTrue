import Utils from "../common/utils";
import LocalStorage from "../common/storage";
import { StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import startOAuthProcess from "./oauth";
import { Problem } from "../common/class";

const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

const checkOrFetchProblemList = async () => {
  return await LocalStorage.get(StorageKey.PROBLEM_LIST).then((problemList) => {
    if (!Utils.isPropertySaved(problemList)) {
      return HostRequest.getAllProblemList().then((resp) => {
        LocalStorage.set(StorageKey.PROBLEM_LIST, resp.data.problemList);
        return resp.data.problemList;
      });
    } else {
      return problemList;
    }
  });
};

const handleMessageFromPopup = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "openProblemTab":
      chrome.tabs.create({ url: request.url, selected: true });
      break;

    case "insertProblem":
      Promise.all([
        checkOrFetchProblemList().then((problemList: Array<Problem>) => {
          problemList.push(request.problem);
          LocalStorage.set(StorageKey.PROBLEM_LIST, problemList);
        }),
        HostRequest.saveNewProblem(request.problem),
      ]).then(([_, result]) => {
        sendResponse(result.httpStatus == 200);
      });
      break;

    case "isProblemSaved":
      HostRequest.isProblemExists(request.problem).then((resp) => {
        if (resp.httpStatus == 200) {
          sendResponse(resp.data.problemExists);
        }
      });
      break;

    case "fetchAllProblems":
      HostRequest.getAllProblemList().then((resp: any) => {
        LocalStorage.set(StorageKey.PROBLEM_LIST, resp.data.problemList);
        sendResponse();
      });
      break;

    case "checkProblemList":
      checkOrFetchProblemList().then(() => sendResponse());
      break;

    case "selectRandomProblem":
      checkOrFetchProblemList().then((problemList: any) => {
        const totalCount = problemList.length;
        const randomIndex = Math.floor(Math.random() * totalCount);
        sendResponse(problemList[randomIndex]);
      });
      break;

    default:
      break;
  }
};

const handleMessageFromContent = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "solvedAc":
      fetchSolvedAcJson(request.problemNumber).then((resp) => sendResponse(resp));
      break;

    case "oauth":
      startOAuthProcess(request.url);
      break;

    default:
      break;
  }
};

const handleMessageFromOptions = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "databaseUrl":
      HostRequest.sendDatabaseID(request.databaseUrl).then((resp: any) => {
        if (resp.httpStatus == 200) {
          LocalStorage.set(StorageKey.NOTION_INFO, resp.data);
          sendResponse(true);
        } else if (resp.code === "MEMBER-400-2") {
          sendResponse(false);
        }
      });
      break;

    case "databasePage":
      const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
      chrome.tabs.create({ url: databasePage, selected: true });
      break;

    case "exit":
      HostRequest.deleteMember();
      LocalStorage.remove(StorageKey.ACCESS_TOKEN);
      LocalStorage.remove(StorageKey.NOTION_INFO);
      LocalStorage.remove(StorageKey.OAUTH_PROCESS_STATUS);
      LocalStorage.remove(StorageKey.PROBLEM_LIST);
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.remove(tabs[0].id);
      });
      break;

    default:
      break;
  }
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  switch (request.from) {
    case "content":
      handleMessageFromContent(request, sendResponse);
      break;

    case "popup":
      handleMessageFromPopup(request, sendResponse);
      break;

    case "options":
      handleMessageFromOptions(request, sendResponse);
      break;

    default:
      break;
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
