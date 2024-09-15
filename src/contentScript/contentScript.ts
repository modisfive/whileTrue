import { SiteHost } from "../common/enums/site.enum";
import baekjoon from "./baekjoon";
import programmers from "./programmers";

const getProblemInfo = async () => {
  const currentHost = window.location.host;

  switch (currentHost) {
    case SiteHost.BOJ:
      return await baekjoon();

    case SiteHost.PROGRAMMERS:
      return await programmers();

    default:
      return {
        isExist: false,
        problemPage: null,
      };
  }
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "popup" && request.subject === "currentProblem") {
    getProblemInfo().then((resp) => {
      sendResponse(resp);
    });
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
