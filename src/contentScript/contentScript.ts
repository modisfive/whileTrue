import bojParse from "./boj/parse";

const savedProblemKey = "savedProblem";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === "popup" && request.subject === "ProblemInfo") {
    chrome.storage.local.get([savedProblemKey]).then((result) => {
      const savedProblem = result[savedProblemKey];

      bojParse(savedProblem).then((problem) => {
        chrome.storage.local.set({ [savedProblemKey]: problem }).then(() => {
          sendResponse(problem);
        });
      });
    });
  }

  return true;
});
