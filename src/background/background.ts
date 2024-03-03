import Utils from "../common/utils";
import LocalStorage from "../common/storage";
import { RESP_STATUS, StorageKey } from "../common/constants";
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
        if (resp.httpStatus === 200) {
          LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.data.problemPageList);
          return resp.data.problemPageList;
        } else {
          return RESP_STATUS.FAILED;
        }
      });
    } else {
      return problemPageList;
    }
  });
};

const handleRespResult = (status: RESP_STATUS, sendResponse: CallableFunction) => {
  LocalStorage.set(StorageKey.IS_ERROR, status).then(() => sendResponse(status));
};

const isProblemIncluded = (problemPageList: Array<ProblemPage>, targetProblem: ProblemPage) => {
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
      chrome.tabs.create({ url: request.url, selected: true }).then(() => sendResponse());
      break;

    case "insertProblem":
      Promise.all([
        checkOrFetchProblemPageList().then((result: Array<ProblemPage> | string) => {
          if (result === RESP_STATUS.FAILED) {
            return result;
          } else {
            (result as Array<ProblemPage>).push(request.problemPage);
            LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, result);
            return RESP_STATUS.SUCCESS;
          }
        }),
        HostRequest.saveNewProblem(request.problemPage),
      ]).then(([result1, result2]) => {
        if (result1 === RESP_STATUS.SUCCESS && result2.httpStatus === 200) {
          handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
        } else {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        }
      });
      break;

    case "isProblemSaved":
      checkOrFetchProblemPageList().then((result: Array<ProblemPage> | string) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          LocalStorage.set(StorageKey.IS_ERROR, RESP_STATUS.SUCCESS).then(() =>
            sendResponse(isProblemIncluded(result as Array<ProblemPage>, request.problemPage))
          );
        }
      });
      break;

    case "fetchAllProblems":
      HostRequest.getAllProblemPageList().then((resp: any) => {
        if (resp.httpStatus === 200) {
          LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.data.problemPageList);
          handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
        } else {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        }
      });
      break;

    case "checkProblemList":
      checkOrFetchProblemPageList().then((result: Array<ProblemPage> | string) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
        }
      });
      break;

    case "selectRandomProblem":
      checkOrFetchProblemPageList().then((result: Array<ProblemPage> | string) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          LocalStorage.set(StorageKey.IS_ERROR, RESP_STATUS.SUCCESS).then(() => {
            const totalCount = result.length;
            const randomIndex = Math.floor(Math.random() * totalCount);
            sendResponse(result[randomIndex]);
          });
        }
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
      startOAuthProcess(request.url).then(() => sendResponse());
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
          sendResponse("SUCCESS");
        } else if (resp.code === "MEMBER-400-2") {
          sendResponse("INVALID");
        } else if (resp.code === "MEMBER-404-3") {
          sendResponse("NOT_FOUND");
        }
      });
      break;

    case "databasePage":
      const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
      chrome.tabs.create({ url: databasePage, selected: true }).then(() => sendResponse());
      break;

    case "exit":
      Promise.all([
        HostRequest.deleteMember(),
        LocalStorage.remove(StorageKey.ACCESS_TOKEN),
        LocalStorage.remove(StorageKey.NOTION_INFO),
        LocalStorage.remove(StorageKey.OAUTH_PROCESS_STATUS),
        LocalStorage.remove(StorageKey.PROBLEM_PAGE_LIST),
      ]).then(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          chrome.tabs.remove(tabs[0].id);
        });
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
