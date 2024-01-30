import bojParse from "./boj/parse";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === "popup" && request.subject === "ProblemInfo") {
    bojParse().then((resp) => sendResponse(resp));
  }

  return true;
});
