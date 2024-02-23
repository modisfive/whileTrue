import Utils from "../common/utils";
import LocalStorage from "../common/storage";
import { StorageKey } from "../common/constants";
import HostRequest from "../common/request";
import startOAuthProcess from "./oauth";
import { Problem } from "../common/class";

const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

const handleMessageFromContent = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "bojTitle":
      fetchSolvedAcJson(request.problemNumber).then((resp) => sendResponse(resp.titleKo));
      break;

    case "oauth":
      startOAuthProcess(request.url);
      break;

    default:
      break;
  }
};

const handleMessageFromPopup = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "accessToken":
      LocalStorage.get(StorageKey.ACCESS_TOKEN).then((accessToken) =>
        sendResponse(Utils.isPropertySaved(accessToken))
      );
      break;

    case "notionInfo":
      LocalStorage.get(StorageKey.NOTION_INFO).then((notionInfo) => {
        sendResponse(Utils.isPropertySaved(notionInfo));
      });
      break;

    case "openProblemTab":
      chrome.tabs.create({ url: request.url, selected: true });
      break;

    case "openOptionsTab":
      const optionsPage = `chrome-extension://${chrome.runtime.id}/options.html`;
      chrome.tabs.create({ url: optionsPage, selected: true });
      break;

    case "insertProblem":
      LocalStorage.get(StorageKey.PROBLEM_LIST).then((problemList: Array<Problem>) => {
        problemList.push(request.problem);
        LocalStorage.set(StorageKey.PROBLEM_LIST, problemList);
      });
      HostRequest.saveNewProblem(request.problem).then((resp) => {
        if (resp.httpStatus == 200) {
          sendResponse(true);
        }
      });
      break;

    case "isProblemSaved":
      HostRequest.isProblemExists(request.problem).then((resp) => {
        if (resp.httpStatus == 200) {
          sendResponse(resp.data.problemExits);
        }
      });
      break;

    default:
      break;
  }
};

const handleMessageFromOptions = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "databaseUrl":
      HostRequest.sendDatabaseID(request.databaseUrl).then((resp: any) => {
        if (resp.httpStatus == 200) {
          LocalStorage.set(StorageKey.NOTION_INFO, resp.data);
          sendResponse(true);
        } else if (resp.code === "MEMBER-400-2") {
          sendResponse(false);
        }
      });
      break;

    case "accessToken":
      if (request.todo === "show") {
        LocalStorage.get(StorageKey.ACCESS_TOKEN).then((accessToken) => console.log(accessToken));
      } else if (request.todo === "delete") {
        LocalStorage.remove(StorageKey.ACCESS_TOKEN).then(() =>
          console.log("Access Token을 삭제했습니다.")
        );
      }
      break;

    case "notionInfo":
      HostRequest.getMemberNotionInfo().then((resp) => console.log(resp));
      break;

    case "allProblems":
      HostRequest.getAllProblemList().then((resp: any) => {
        console.log(resp.data.problemList);
        LocalStorage.set(StorageKey.PROBLEM_LIST, resp.data.problemList);
      });
      break;

    case "exit":
      LocalStorage.remove(StorageKey.ACCESS_TOKEN);
      LocalStorage.remove(StorageKey.NOTION_INFO);
      LocalStorage.remove(StorageKey.OAUTH_PROCESS_STATUS);
      LocalStorage.remove(StorageKey.PROBLEM_LIST);
      break;

    case "databasePage":
      const databasePage = `chrome-extension://${chrome.runtime.id}/database.html`;
      chrome.tabs.create({ url: databasePage, selected: true });
      break;

    default:
      break;
  }
};

const handleMessageFromProblemPage = (request: any, sendResponse: any) => {
  switch (request.subject) {
    case "checkProblemList":
      LocalStorage.get(StorageKey.PROBLEM_LIST).then((problemList) => {
        if (!Utils.isPropertySaved(problemList)) {
          HostRequest.getAllProblemList().then((resp: any) =>
            LocalStorage.set(StorageKey.PROBLEM_LIST, resp.data.problemList)
          );
        }
      });
      break;

    case "selectRandomProblem":
      LocalStorage.get(StorageKey.PROBLEM_LIST).then((problemList: any) => {
        const totalCount = problemList.length;
        const randomIndex = Math.floor(Math.random() * totalCount);
        sendResponse(problemList[randomIndex]);
      });
      break;

    default:
      break;
  }
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  switch (request.from) {
    case "content":
      handleMessageFromContent(request, sendResponse);
      break;

    case "popup":
      handleMessageFromPopup(request, sendResponse);
      break;

    case "options":
      handleMessageFromOptions(request, sendResponse);
      break;

    case "problemPage":
      handleMessageFromProblemPage(request, sendResponse);
      break;

    default:
      break;
  }

  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
