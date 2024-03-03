import { StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import LocalStorage from "../common/storage";

const startOAuthProcess = async (url: string) => {
  const accessCode = parseAccessCode(url);
  const resp = await HostRequest.sendAccessCode(accessCode);

  LocalStorage.set(StorageKey.OAUTH_PROCESS_STATUS, false).then(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
      if (resp.httpStatus == 200) {
        LocalStorage.set(StorageKey.ACCESS_TOKEN, resp.data.accessToken);
        const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
        chrome.tabs.create({ url: databasePage, selected: true });
      }
    });
  });
};

const parseAccessCode = (url: string) => {
  if (url.match(/\?state=(.+)/)) {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id);
    });
  } else {
    const accessCode = url.match(/\?code=([\w\/\-]+)/);
    if (accessCode) {
      return accessCode[1];
    }
  }
};

export default startOAuthProcess;
