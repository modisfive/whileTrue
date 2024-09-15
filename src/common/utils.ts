import { ProblemPage, UserStatus } from "./class";
import { SiteType, StorageKey, RESP_STATUS } from "./constants";
import LocalStorage from "./storage";

const NOTION_URL_REGEX = /https:\/\/www\.notion\.so(\/(.+?))?\/(.+?)\?v=(.+)/;

const Utils = {
  isPropertySaved(property: any): boolean {
    return typeof property !== "undefined";
  },

  validateNotionDatabaseUrl(url: string): boolean {
    const match = url.match(NOTION_URL_REGEX);
    return match ? match[3].length === 32 : false;
  },

  parseNotionDatabaseId(url: string): string {
    return url.match(NOTION_URL_REGEX)[3];
  },

  async getUserStatus(): Promise<UserStatus> {
    const [notionApiKey, databaseId, respStatus] = await Promise.all([
      LocalStorage.get(StorageKey.NOTION_API_KEY),
      LocalStorage.get(StorageKey.DATABASE_ID),
      LocalStorage.get(StorageKey.RESP_STATUS),
    ]);

    const isNotionLinked = this.isPropertySaved(notionApiKey) && this.isPropertySaved(databaseId);
    const finalRespStatus = this.isPropertySaved(respStatus) ? respStatus : RESP_STATUS.SUCCESS;

    return new UserStatus(isNotionLinked, finalRespStatus);
  },

  selectLogo(siteType: SiteType): string {
    switch (siteType) {
      case SiteType.BOJ:
        return "/logo/baekjoon_logo.png";
      case SiteType.PROGRAMMERS:
      case SiteType.PROGRAMMERS_SQL:
        return "/logo/programmers_logo.png";
    }
  },

  async filterProblems() {
    const [problemOptions, allProblems] = await Promise.all([
      LocalStorage.get(StorageKey.PROBLEM_OPTIONS),
      LocalStorage.get(StorageKey.PROBLEM_PAGE_LIST),
    ]);

    const allowedSiteType = [
      problemOptions.includeBoj && SiteType.BOJ,
      problemOptions.includeProgrammers && SiteType.PROGRAMMERS,
      problemOptions.includeProgrammersSql && SiteType.PROGRAMMERS_SQL,
    ].filter(Boolean);

    const filteredProblems = allProblems.filter((problem: ProblemPage) =>
      allowedSiteType.includes(problem.siteType)
    );

    await LocalStorage.set(StorageKey.FILTERED_PROBLEM, filteredProblems);
  },
};

export default Utils;
