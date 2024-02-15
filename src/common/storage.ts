import { StorageKey } from "./constants";

const LocalStorage = {
  get: async function (key: StorageKey) {
    return await new Promise((resolve) => {
      chrome.storage.local.get([key]).then((result) => resolve(result[key]));
    });
  },
  set: async function (key: StorageKey, value: any) {
    await new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }).then(resolve);
    });
  },
  remove: async function (key: StorageKey) {
    await chrome.storage.local.remove(key);
  },
};

export default LocalStorage;
