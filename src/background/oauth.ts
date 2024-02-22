import { StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import LocalStorage from "../common/storage";

const startOAuthProcess = async (url: string) => {
  const accessCode = parseAccessCode(url);
  const resp = await HostRequest.sendAccessCode(accessCode);

  LocalStorage.set(StorageKey.OAUTH_PROCESS_STATUS, false).then(() => {
    if (resp.httpStatus == 200) {
      chrome.runtime.sendMessage({
        from: "oauth",
        subject: "accessToken",
        isSuccess: true,
        token: resp.data.accessToken,
      });
    } else {
      chrome.runtime.sendMessage({
        from: "oauth",
        subject: "accessToken",
        isSuccess: false,
      });
    }
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
