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
  getUserStatus: async function () {
    return Promise.all([
      LocalStorage.get(StorageKey.ACCESS_TOKEN).then((accessToken) =>
        Utils.isPropertySaved(accessToken)
      ),
      LocalStorage.get(StorageKey.NOTION_INFO).then((notionInfo) =>
        Utils.isPropertySaved(notionInfo)
      ),
      LocalStorage.get(StorageKey.RESP_STATUS).then((isError) => {
        if (Utils.isPropertySaved(isError)) {
          return isError;
        } else {
          return RESP_STATUS.SUCCESS;
        }
      }),
    ]).then(
      ([isLogined, isNotionLinked, isError]) => new UserStatus(isLogined, isNotionLinked, isError)
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
