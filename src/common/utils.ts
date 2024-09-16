import { RESP_STATUS } from "./enums/response-status.enum";
import { SiteType } from "./enums/site.enum";
import { StorageKey } from "./enums/storage.enum";
import { IUserStatus, UserStatus } from "./models/user-status.model";
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

  async getUserStatus(): Promise<IUserStatus> {
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
};

export default Utils;
