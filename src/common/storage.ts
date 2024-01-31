import { Problem } from "./class";
import { StorageKey } from "./enum";

const getByKey = async (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key]).then((result) => resolve(result[key]));
    } catch (error) {
      reject(error);
    }
  });
};

const setByKey = async (key: string, value: any) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ [key]: value }).then(() => resolve);
    } catch (error) {
      reject(error);
    }
  });
};

const getSavedProblem = async (): Promise<Problem> => {
  return await getByKey(StorageKey.SAVED_PROBLEM);
};

const setSavedProblem = async (problem: Problem) => {
  await setByKey(StorageKey.SAVED_PROBLEM, problem);
};

export { getSavedProblem, setSavedProblem };
