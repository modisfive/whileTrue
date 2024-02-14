import { sendAccessCode } from "../common/request";
import { setOAuthProcessStatus } from "../common/storage";

const startOAuthProcess = async (url: string) => {
  const accessCode = parseAccessCode(url);
  const resp = await sendAccessCode(accessCode);

  setOAuthProcessStatus(false).then(() => {
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
