chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === "content" && request.subject === "BOJTitle") {
    const problemNumber = request.param;
    console.log("background:", problemNumber);
    sendResponse(problemNumber);
  }
});
