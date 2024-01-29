const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === "content" && request.subject === "BOJTitle") {
    fetchSolvedAcJson(request.param).then((resp) => sendResponse(resp.titleKo));
  }

  return true;
});
