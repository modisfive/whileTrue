import { SiteType, SiteBaseUrl } from "./enum";

const createProblemUrl = (site: SiteType, problemNumber: string) => {
  switch (site) {
    case SiteType.BOJ:
      return SiteBaseUrl.BOJ + "/problem/" + problemNumber;

    default:
      break;
  }
};

export { createProblemUrl };
