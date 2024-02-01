import { Problem } from "./class";
import { SiteType, SiteHost } from "./enum";

const createProblemUrl = (site: SiteType, problemNumber: string) => {
  switch (site) {
    case SiteType.BOJ:
      return `https://${SiteHost.BOJ}/problem/${problemNumber}`;

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

const getCurrentHost = () => {
  return window.location.host;
};

export { createProblemUrl, fetchSolvedAcJson, isProblemSaved, getCurrentHost };
