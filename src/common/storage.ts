import { Problem } from "./class";
import { StorageKey } from "./enum";

const getByKey = async (key: string): Promise<any> => {
  return await new Promise((resolve) => {
    chrome.storage.local.get([key]).then((result) => resolve(result[key]));
  });
};

const setByKey = async (key: string, value: any) => {
  return await new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }).then(() => resolve);
  });
};

const getSavedProblem = async (): Promise<Problem> => {
  return await getByKey(StorageKey.SAVED_PROBLEM);
};

const setSavedProblem = async (problem: Problem) => {
  await setByKey(StorageKey.SAVED_PROBLEM, problem);
};

export { getSavedProblem, setSavedProblem };
