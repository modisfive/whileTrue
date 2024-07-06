import { ProblemPage } from "../common/class";
import { RESP_STATUS, StorageKey } from "../common/constants";
import HostRequest from "../api/request";
import LocalStorage from "../common/storage";
import Utils from "../common/utils";
import ProblemListResponseDto from "../api/dto/response/ProblemListResponseDto";
import SuccessResponseDto from "../api/dto/response/SuccessResponseDto";

const handleRespResult = async (status: RESP_STATUS, sendResponse: CallableFunction) => {
  await LocalStorage.set(StorageKey.RESP_STATUS, status);
  sendResponse(status);
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
  const problemPageList = await LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST);
  return Utils.isPropertySaved(problemPageList);
};

/**
 * 사용자 노션에서 문제 리스트 가져오기
 */
const fetchProblemPageList = async (): Promise<Array<ProblemPage> | RESP_STATUS> => {
  const resp: ProblemListResponseDto = await HostRequest.fetchAllProblemPageList();
  if (resp.validCheck === RESP_STATUS.SUCCESS) {
    await LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.problemPageList);
    return resp.problemPageList;
  } else {
    return RESP_STATUS.FAILED;
  }
};

const isProblemIncluded = (problemPageList: Array<ProblemPage>, targetProblem: ProblemPage) => {
  return problemPageList.some(
    (problem) => problem.title === targetProblem.title && problem.url === targetProblem.url
  );
};

const handleOpenProblemTab = async (request: any) => {
  await chrome.tabs.create({ url: request.url, selected: true });
};

const handleInsertProblem = async (request: any, sendResponse: CallableFunction) => {
  const [problemPageList, saveResult]: [Array<ProblemPage> | RESP_STATUS, SuccessResponseDto] =
    await Promise.all([getProblemPageList(), HostRequest.saveNewProblem(request.problemPage)]);

  if (problemPageList !== RESP_STATUS.FAILED && saveResult.isSucceed === RESP_STATUS.SUCCESS) {
    (problemPageList as Array<ProblemPage>).push(request.problemPage);
    await LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, problemPageList);
    handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
  } else {
    handleRespResult(RESP_STATUS.FAILED, sendResponse);
  }
};

const handleIsProblemSaved = async (request: any, sendResponse: CallableFunction) => {
  const problemPageList = await getProblemPageList();
  if (problemPageList === RESP_STATUS.FAILED) {
    handleRespResult(RESP_STATUS.FAILED, sendResponse);
  } else {
    await LocalStorage.set(StorageKey.RESP_STATUS, RESP_STATUS.SUCCESS);
    sendResponse(isProblemIncluded(problemPageList as Array<ProblemPage>, request.problemPage));
  }
};

const handleFetchAllProblems = async (sendResponse: CallableFunction) => {
  const result = await fetchProblemPageList();
  handleRespResult(
    result === RESP_STATUS.FAILED ? RESP_STATUS.FAILED : RESP_STATUS.SUCCESS,
    sendResponse
  );
};

const handleCheckProblemList = async (sendResponse: CallableFunction) => {
  const result = await getProblemPageList();
  handleRespResult(
    result === RESP_STATUS.FAILED ? RESP_STATUS.FAILED : RESP_STATUS.SUCCESS,
    sendResponse
  );
};

const handleSelectRandomProblem = async (sendResponse: CallableFunction) => {
  const problemPageList = await getProblemPageList();
  if (problemPageList === RESP_STATUS.FAILED) {
    handleRespResult(RESP_STATUS.FAILED, sendResponse);
  } else {
    await LocalStorage.set(StorageKey.RESP_STATUS, RESP_STATUS.SUCCESS);
    const totalCount = problemPageList.length;
    const randomIndex = Math.floor(Math.random() * totalCount);
    sendResponse(problemPageList[randomIndex]);
  }
};

const handleDatabasePage = async () => {
  const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
  await chrome.tabs.create({ url: databasePage, selected: true });
};

const handleMessageFromPopup = (request: any, sendResponse: CallableFunction) => {
  switch (request.subject) {
    case "openProblemTab":
      handleOpenProblemTab(request);
      break;
    case "insertProblem":
      handleInsertProblem(request, sendResponse);
      break;
    case "isProblemSaved":
      handleIsProblemSaved(request, sendResponse);
      break;
    case "fetchAllProblems":
      handleFetchAllProblems(sendResponse);
      break;
    case "checkProblemList":
      handleCheckProblemList(sendResponse);
      break;
    case "selectRandomProblem":
      handleSelectRandomProblem(sendResponse);
      break;
    case "databasePage":
      handleDatabasePage();
      break;
    default:
      break;
  }
};

export default handleMessageFromPopup;
