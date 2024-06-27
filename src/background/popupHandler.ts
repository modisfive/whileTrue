import { ProblemPage } from "../common/class";
import { RESP_STATUS, StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import LocalStorage from "../common/storage";
import Utils from "../common/utils";

const handleRespResult = (status: RESP_STATUS, sendResponse: CallableFunction) => {
  LocalStorage.set(StorageKey.RESP_STATUS, status).then(() => sendResponse(status));
};

/**
 * 문제 있는지 확인한 후, 이미 저장되어 있으면 저장된 문제 리스트 가져오기
 * 저장되어 있지 않다면, 사용자 노션에서 가져오기
 */
const getProblemPageList = async (): Promise<Array<ProblemPage> | RESP_STATUS> => {
  const isSaved = await checkProblemPageList();
  if (isSaved) {
    return await LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST);
  }

  return await fetchProblemPageList();
};

/**
 * 로컬에 저장된 문제 리스트가 있는지 확인하기
 */
const checkProblemPageList = async () => {
  return await LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST).then((problemPageList) => {
    return Utils.isPropertySaved(problemPageList);
  });
};

/**
 * 사용자 노션에서 문제 리스트 가져오기
 */
const fetchProblemPageList = async (): Promise<Array<ProblemPage> | RESP_STATUS> => {
  return HostRequest.getAllProblemPageList().then((resp) => {
    if (resp.httpStatus === 200) {
      LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.data.problemPageList);
      return resp.data.problemPageList;
    } else {
      return RESP_STATUS.FAILED;
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
        getProblemPageList().then((result: Array<ProblemPage> | RESP_STATUS) => {
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
      getProblemPageList().then((result: Array<ProblemPage> | RESP_STATUS) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          LocalStorage.set(StorageKey.RESP_STATUS, RESP_STATUS.SUCCESS).then(() =>
            sendResponse(isProblemIncluded(result as Array<ProblemPage>, request.problemPage))
          );
        }
      });
      break;

    case "fetchAllProblems":
      fetchProblemPageList().then((result: Array<ProblemPage> | RESP_STATUS) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
        }
      });
      break;

    case "checkProblemList":
      getProblemPageList().then((result: Array<ProblemPage> | RESP_STATUS) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
        }
      });
      break;

    case "selectRandomProblem":
      getProblemPageList().then((result: Array<ProblemPage> | RESP_STATUS) => {
        if (result === RESP_STATUS.FAILED) {
          handleRespResult(RESP_STATUS.FAILED, sendResponse);
        } else {
          LocalStorage.set(StorageKey.RESP_STATUS, RESP_STATUS.SUCCESS).then(() => {
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
