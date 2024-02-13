import { Problem } from "./class";
import { SiteType, SiteHost } from "./constants";

export const createProblemUrl = (site: SiteType, problemNumber: string) => {
  switch (site) {
    case SiteType.BOJ:
      return `https://${SiteHost.BOJ}/problem/${problemNumber}`;

    default:
      break;
  }
};

export const isProblemSaved = (
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

export const getCurrentHost = () => {
  return window.location.host;
};
