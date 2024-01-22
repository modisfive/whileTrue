import bojParse from "./boj/parse";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === "popup" && request.subject === "ProblemInfo") {
    const problemInfo = bojParse();
    sendResponse(problemInfo);
  }
});
