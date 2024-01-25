import { SiteType } from "./enum";

class Problem {
  site: SiteType;
  number: string;
  title: string;
  url: string;
  createdAt: string;

  constructor(site: SiteType, number: string, title: string, url: string) {
    this.site = site;
    this.number = number;
    this.title = title;
    this.url = url;
    this.createdAt = new Date().toString();
  }
}

export { Problem };
