import { SiteType, SiteBaseUrl } from "./enum";

const createProblemUrl = (site: SiteType, problemNumber: string) => {
  switch (site) {
    case SiteType.BOJ:
      return SiteBaseUrl.BOJ + "/problem/" + problemNumber;

    default:
      break;
  }
};

const fetchSolvedAcJson = async (problemNumber: string) => {
  return await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((resp) => resp.json());
};

export { createProblemUrl, fetchSolvedAcJson };
