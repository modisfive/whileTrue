const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

const handleMessage = (request: any, sender: any, sendResponse: any) => {
  if (request.from === "content" && request.subject === "BOJTitle") {
    fetchSolvedAcJson(request.problemNumber).then((resp) => sendResponse(resp.titleKo));
    return true;
  }

  if (request.from === "popup" && request.subject === "NotionAccessToken") {
    console.log("background is working!!");
    sendResponse(false);
    return true;
  }
};

chrome.runtime.onMessage.addListener(handleMessage);
