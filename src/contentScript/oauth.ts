import { HOST_URL } from "../common/constants";

const startOAuthProcess = async (url: string) => {
  const accessCode = parseAccessCode(url);
  const requestURL = `${HOST_URL}/auth/${accessCode}`;

  await fetch(requestURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
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
