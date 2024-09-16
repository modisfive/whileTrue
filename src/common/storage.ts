import { StorageKey } from "./enums/storage.enum";

const LocalStorage = {
  get: async function (key: StorageKey) {
    return await chrome.storage.local.get([key]).then((result) => result[key]);
  },
  set: async function (key: StorageKey, value: any) {
    await chrome.storage.local.set({ [key]: value });
  },
  remove: async function (key: StorageKey) {
    await chrome.storage.local.remove(key);
  },
};

export default LocalStorage;
