import { IconType, SiteType } from "./constants";

export class ProblemPage {
  siteType: SiteType;
  level: string;
  number: string;
  title: string;
  url: string;
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
    this.siteType = siteType;
    this.level = level;
    this.number = number;
    this.title = title;
    this.url = url;
    this.iconType = iconType;
    this.iconSrc = iconSrc;
  }
}

export class UserStatus {
  isLogined: boolean;
  isNotionLinked: boolean;
  isError: string;

  constructor(isLogined: boolean, isNotionLinked: boolean, isError: string) {
    this.isLogined = isLogined;
    this.isNotionLinked = isNotionLinked;
    this.isError = isError;
  }
}
