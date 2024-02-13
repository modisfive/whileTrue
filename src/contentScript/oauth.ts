import { sendAccessCode } from "../common/request";

const startOAuthProcess = async (url: string) => {
  const accessCode = parseAccessCode(url);
  const resp = await sendAccessCode(accessCode);

  console.log(resp);
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
