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
  isNotionLinked: boolean;
  isError: string;

  constructor(isNotionLinked: boolean, isError: string) {
    this.isNotionLinked = isNotionLinked;
    this.isError = isError;
  }
}
