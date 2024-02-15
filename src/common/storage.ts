import { Problem } from "./class";
import { StorageKey } from "./constants";

const getByKey = async (key: string): Promise<any> => {
  return await new Promise((resolve) => {
    chrome.storage.local.get([key]).then((result) => resolve(result[key]));
  });
};

const setByKey = async (key: string, value: any) => {
  return await new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }).then(resolve);
  });
};

export const getSavedProblem = async (): Promise<Problem | undefined> => {
  return await getByKey(StorageKey.LATEST_PROBLEM);
};

export const setSavedProblem = async (problem: Problem) => {
  await setByKey(StorageKey.LATEST_PROBLEM, problem);
};

export const getAccessToken = async (): Promise<string | undefined> => {
  return await getByKey(StorageKey.ACCESS_TOKEN);
};

export const setAccessToken = async (notionAccessToken: string) => {
  await setByKey(StorageKey.ACCESS_TOKEN, notionAccessToken);
};

export const getOAuthProcessStatus = async () => {
  return await getByKey(StorageKey.OAUTH_PROCESS_STATUS);
};

export const setOAuthProcessStatus = async (status: boolean) => {
  await setByKey(StorageKey.OAUTH_PROCESS_STATUS, status);
};

export const getUserInfo = async () => {
  return await getByKey(StorageKey.USER_INFO);
};

export const setUserInfo = async (userInfo: any) => {
  await setByKey(StorageKey.USER_INFO, userInfo);
};

export const getProblemList = async () => {
  return await getByKey(StorageKey.PROBLEM_LIST);
};

export const setProblemList = async (problemList: any) => {
  await setByKey(StorageKey.PROBLEM_LIST, problemList);
};
