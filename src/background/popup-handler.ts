import HostRequest from "../api/request";
import LocalStorage from "../common/storage";
import Utils from "../common/utils";
import { RESP_STATUS } from "../common/enums/response-status.enum";
import { StorageKey } from "../common/enums/storage.enum";
import { SiteType } from "../common/enums/site.enum";
import { IProblemPage } from "../common/models/problem-page.model";
import { IProblemListResponse } from "../api/dto/response/problem-list-response.dto";
import { ISuccessResponse } from "../api/dto/response/success-response.dto";

type Result<T> = { success: boolean; data: T };

const handleRespResult = async (status: RESP_STATUS, sendResponse: CallableFunction) => {
  await LocalStorage.set(StorageKey.RESP_STATUS, status);
  sendResponse(status);
};

/**
 * 문제 있는지 확인한 후, 이미 저장되어 있으면 저장된 문제 리스트 가져오기
 * 저장되어 있지 않다면, 사용자 노션에서 가져오기
 */
const getProblemPageList = async (): Promise<Result<Array<IProblemPage>>> => {
  const isSaved = await checkProblemPageList();

  if (isSaved) {
    return { success: true, data: await LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST) };
  }

  return await fetchProblemPageList();
};

/**
 * 로컬에 저장된 문제 리스트가 있는지 확인하기
 */
const checkProblemPageList = async () => {
  return Utils.isPropertySaved(await LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST));
};

/**
 * 사용자 노션에서 문제 리스트 가져오기
 */
const fetchProblemPageList = async (): Promise<Result<Array<IProblemPage>>> => {
  const resp: IProblemListResponse = await HostRequest.fetchAllProblemPageList();
  if (resp.validCheck === RESP_STATUS.SUCCESS) {
    await LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, resp.problemPageList);
    return { success: true, data: resp.problemPageList }; // 성공 시 문제 목록 반환
  } else {
    return { success: false, data: null }; // 실패 시 상태 반환
  }
};

const isProblemIncluded = (problemPageList: Array<IProblemPage>, targetProblem: IProblemPage) => {
  return problemPageList.some(
    (problem) => problem.title === targetProblem.title && problem.url === targetProblem.url
  );
};

const handleOpenProblemTab = async (request: any) => {
  await chrome.tabs.create({ url: request.url, selected: true });
};

const handleInsertProblem = async (request: any, sendResponse: CallableFunction) => {
  const [result, saveResult]: [Result<Array<IProblemPage>>, ISuccessResponse] = await Promise.all([
    getProblemPageList(),
    HostRequest.saveNewProblem(request.problemPage),
  ]);

  if (!result.success || saveResult.isSucceed !== RESP_STATUS.SUCCESS) {
    handleRespResult(RESP_STATUS.FAILED, sendResponse);
  }

  const problemPageList = result.data;
  problemPageList.push(request.problemPage);
  await LocalStorage.set(StorageKey.PROBLEM_PAGE_LIST, problemPageList);
  handleRespResult(RESP_STATUS.SUCCESS, sendResponse);
};

const handleIsProblemSaved = async (request: any, sendResponse: CallableFunction) => {
  const result = await getProblemPageList();
  if (!result.success) {
    handleRespResult(RESP_STATUS.FAILED, sendResponse);
    return;
  }

  await LocalStorage.set(StorageKey.RESP_STATUS, RESP_STATUS.SUCCESS);
  sendResponse(isProblemIncluded(result.data, request.problemPage));
};

const handleFetchAllProblems = async (sendResponse: CallableFunction) => {
  const result = await fetchProblemPageList();
  handleRespResult(result.success ? RESP_STATUS.SUCCESS : RESP_STATUS.FAILED, sendResponse);
};

const handleCheckProblemList = async (sendResponse: CallableFunction) => {
  const result = await getProblemPageList();
  handleRespResult(result.success ? RESP_STATUS.SUCCESS : RESP_STATUS.FAILED, sendResponse);
};

const handleSelectRandomProblem = async (sendResponse: CallableFunction) => {
  const result = await getProblemPageList();
  if (!result.success) {
    handleRespResult(RESP_STATUS.FAILED, sendResponse);
    return;
  }

  await LocalStorage.set(StorageKey.RESP_STATUS, RESP_STATUS.SUCCESS);

  const problemOptions = await LocalStorage.get(StorageKey.PROBLEM_OPTIONS);
  const problemPageList = result.data;

  const allowedSiteTypes = [
    problemOptions.includeBoj && SiteType.BOJ,
    problemOptions.includeProgrammers && SiteType.PROGRAMMERS,
    problemOptions.includeProgrammersSql && SiteType.PROGRAMMERS_SQL,
  ].filter(Boolean);

  const filteredProblems = problemPageList.filter((problem: IProblemPage) =>
    allowedSiteTypes.includes(problem.siteType)
  );

  if (filteredProblems.length === 0) {
    sendResponse(null);
    return;
  }

  const selectedProblem = selectRandomProblem(filteredProblems);
  sendResponse(selectedProblem);
};

// 랜덤 문제 선택 함수
const selectRandomProblem = (problems: Array<IProblemPage>): IProblemPage => {
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex];
};

const handleDatabasePage = async () => {
  const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
  await chrome.tabs.create({ url: databasePage, selected: true });
};

const handleMessageFromPopup = (request: any, sendResponse: CallableFunction) => {
  const messageHandlers: { [key: string]: CallableFunction } = {
    openProblemTab: () => handleOpenProblemTab(request),
    insertProblem: () => handleInsertProblem(request, sendResponse),
    isProblemSaved: () => handleIsProblemSaved(request, sendResponse),
    fetchAllProblems: () => handleFetchAllProblems(sendResponse),
    checkProblemList: () => handleCheckProblemList(sendResponse),
    selectRandomProblem: () => handleSelectRandomProblem(sendResponse),
    databasePage: () => handleDatabasePage(),
  };

  const handler = messageHandlers[request.subject];
  if (handler) handler();
};

export default handleMessageFromPopup;
