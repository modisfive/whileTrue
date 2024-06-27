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
    case "solvedAc":
      fetchSolvedAcJson(request.problemNumber).then((resp) => sendResponse(resp));
      break;

    default:
      break;
  }
};

export default handleMessageFromContent;
