import { SiteType } from "./constants";

class Problem {
  site: SiteType;
  number: string;
  title: string;
  url: string;

  constructor(site: SiteType, number: string, title: string, url: string) {
    this.site = site;
    this.number = number;
    this.title = title;
    this.url = url;
  }
}

export { Problem };
