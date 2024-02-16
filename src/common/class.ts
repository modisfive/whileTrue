import { SiteType } from "./constants";

class Problem {
  siteType: SiteType;
  number: string;
  title: string;
  url: string;

  constructor(siteType: SiteType, number: string, title: string, url: string) {
    this.siteType = siteType;
    this.number = number;
    this.title = title;
    this.url = url;
  }
}

export { Problem };
