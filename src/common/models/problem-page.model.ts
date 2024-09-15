import { IconType } from "../enums/icon.enum";
import { SiteType } from "../enums/site.enum";

export interface IProblemPage {
  siteType: SiteType;
  level: string;
  number: string;
  title: string;
  url: string;
  iconType: IconType;
  iconSrc: string;
}

export class ProblemPage implements IProblemPage {
  constructor(
    public siteType: SiteType,
    public level: string,
    public number: string,
    public title: string,
    public url: string,
    public iconType: IconType,
    public iconSrc: string
  ) {}
}
