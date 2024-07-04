import { UserStatus } from "./class";
import { SiteType, SiteHost, StorageKey, RESP_STATUS } from "./constants";
import LocalStorage from "./storage";

const Utils = {
  isPropertySaved: function (property: any) {
    return typeof property !== "undefined";
  },
  validateNotionDatabaseUrl: function (url: string) {
    const regExr = /https:\/\/www\.notion\.so(\/(.+?))?\/(.+?)\?v=(.+)/;
    if (!regExr.test(url)) {
      return false;
    }
    const target = url.match(regExr)[3];
    return target.length == 32;
  },
  parseNotionDatabaseId: function (url: string) {
    const regExr = /https:\/\/www\.notion\.so(\/(.+?))?\/(.+?)\?v=(.+)/;
    const target = url.match(regExr)[3];
    return target;
  },
  getUserStatus: async function () {
    return Promise.all([
      LocalStorage.get(StorageKey.NOTION_API_KEY).then((notionApiKey) =>
        Utils.isPropertySaved(notionApiKey)
      ),
      LocalStorage.get(StorageKey.DATABASE_ID).then((databaseId) =>
        Utils.isPropertySaved(databaseId)
      ),
      LocalStorage.get(StorageKey.RESP_STATUS).then((respStatus) => {
        if (Utils.isPropertySaved(respStatus)) {
          return respStatus;
        }
        return RESP_STATUS.SUCCESS;
      }),
    ]).then(
      ([isNotionApiKeySaved, isDatabaseIdSaved, respStatus]) =>
        new UserStatus(isNotionApiKeySaved && isDatabaseIdSaved, respStatus)
    );
  },
  selectLogo: function (siteType: SiteType) {
    switch (siteType) {
      case SiteType.BOJ:
        return "/logo/baekjoon_logo.png";
      case SiteType.PROGRAMMERS:
        return "/logo/programmers_logo.png";
    }
  },
};

export default Utils;
