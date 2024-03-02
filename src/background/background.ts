import Utils from "../common/utils";
import LocalStorage from "../common/storage";
import { StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import startOAuthProcess from "./oauth";
import { ProblemPage } from "../common/class";

const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

const checkOrFetchProblemPageList = async () => {
  return await LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST).then((problemPageList) => {
    if (!Utils.isPropertySaved(problemPageList)) {
      return HostRequest.getAllProblemPageList().then((resp) => {
        LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.data.problemPageList);
        return resp.data.problemPageList;
      });
    } else {
      return problemPageList;
    }
  });
};

const isProblemIncluded = (problemPageList, targetProblem) => {
  for (let problem of problemPageList) {
    if (problem.title === targetProblem.title && problem.url === targetProblem.url) {
      return true;
    }
  }
  return false;
};

const handleMessageFromPopup = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "openProblemTab":
      chrome.tabs.create({ url: request.url, selected: true });
      break;

    case "insertProblem":
      Promise.all([
        checkOrFetchProblemPageList().then((problemPageList: Array<ProblemPage>) => {
          problemPageList.push(request.problemPage);
          LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, problemPageList);
        }),
        HostRequest.saveNewProblem(request.problem),
      ]).then(([_, result]) => {
        sendResponse(result.httpStatus == 200);
      });
      break;

    case "isProblemSaved":
      LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST).then((problemPageList) => {
        if (
          Utils.isPropertySaved(problemPageList) &&
          isProblemIncluded(problemPageList, request.problemPage)
        ) {
          sendResponse(true);
        } else {
          HostRequest.isProblemExists(request.problem).then((resp) => {
            if (resp.httpStatus == 200) {
              sendResponse(resp.data.problemExists);
            }
          });
        }
      });

      break;

    case "fetchAllProblems":
      HostRequest.getAllProblemPageList().then((resp: any) => {
        LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.data.problemPageList);
        sendResponse();
      });
      break;

    case "checkProblemList":
      checkOrFetchProblemPageList().then(() => sendResponse());
      break;

    case "selectRandomProblem":
      checkOrFetchProblemPageList().then((problemPageList: any) => {
        const totalCount = problemPageList.length;
        const randomIndex = Math.floor(Math.random() * totalCount);
        sendResponse(problemPageList[randomIndex]);
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
      LocalStorage.remove(StorageKey.PROBLEM_PAGE_LIST);
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
