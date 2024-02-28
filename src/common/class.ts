import { IconType, SiteType } from "./constants";

export class Problem {
  siteType: SiteType;
  level: string;
  number: string;
  title: string;
  url: string;

  constructor(siteType: SiteType, level: string, number: string, title: string, url: string) {
    this.siteType = siteType;
    this.level = level;
    this.number = number;
    this.title = title;
    this.url = url;
  }
}

export class ProblemPage extends Problem {
  iconType: IconType;
  iconSrc: string;

  constructor(
    siteType: SiteType,
    level: string,
    number: string,
    title: string,
    url: string,
    iconType: IconType,
    iconSrc: string
  ) {
    super(siteType, level, number, title, url);
    this.iconType = iconType;
    this.iconSrc = iconSrc;
  }
}

export class UserStatus {
  isLogined: boolean;
  isNotionLinked: boolean;

  constructor(isLogined: boolean, isNotionLinked: boolean) {
    this.isLogined = isLogined;
    this.isNotionLinked = isNotionLinked;
  }
}
