import { ProblemPage } from "../common/class";
import { RESP_STATUS, StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import LocalStorage from "../common/storage";
import Utils from "../common/utils";

const handleRespResult = (status: RESP_STATUS, sendResponse: CallableFunction) => {
  LocalStorage.set(StorageKey.IS_ERROR, status).then(() => sendResponse(status));
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

    case "databasePage":
      const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
      chrome.tabs.create({ url: databasePage, selected: true }).then(() => sendResponse());
      break;

    default:
      break;
  }
};

export default handleMessageFromPopup;
