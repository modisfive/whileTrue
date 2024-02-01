import { Problem } from "./class";
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

const isProblemSaved = (
  currSiteType: SiteType,
  currProblemNumber: string,
  savedProblem: undefined | Problem
) => {
  if (typeof savedProblem === "undefined") {
    return false;
  } else if (currSiteType === savedProblem.site && currProblemNumber === savedProblem.number) {
    return true;
  }
  return false;
};

export { createProblemUrl, fetchSolvedAcJson, isProblemSaved };
