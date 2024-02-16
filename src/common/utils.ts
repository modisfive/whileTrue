import { Problem } from "./class";
import { SiteType, SiteHost } from "./constants";

export const createProblemUrl = (siteType: SiteType, problemNumber: string) => {
  switch (siteType) {
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
  } else if (currSiteType === savedProblem.siteType && currProblemNumber === savedProblem.number) {
    return true;
  }
  return false;
};

export const getCurrentHost = () => {
  return window.location.host;
};

export const isPropertyExists = (property: any) => {
  return typeof property !== "undefined";
};
