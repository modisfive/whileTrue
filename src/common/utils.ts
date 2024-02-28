import { UserStatus } from "./class";
import { SiteType, SiteHost, StorageKey } from "./constants";
import LocalStorage from "./storage";

const Utils = {
  createProblemUrl: function (siteType: SiteType, problemNumber: string) {
    switch (siteType) {
      case SiteType.BOJ:
        return `https://${SiteHost.BOJ}/problem/${problemNumber}`;

      default:
        break;
    }
  },
  getCurrentHost: function () {
    return window.location.host;
  },
  isPropertySaved: function (property: any) {
    return typeof property !== "undefined";
  },
  validateNotionDatabaseUrl: function (url: string) {
    const regExr = /https:\/\/www\.notion\.so\/(.+?)\/(.+?)\?v=(.+)/;
    if (!regExr.test(url)) {
      return false;
    }
    const target = url.match(regExr)[2];
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
    ]).then(([isLogined, isNotionLinked]) => new UserStatus(isLogined, isNotionLinked));
  },
  selectLogo: function (siteType: SiteType) {
    switch (siteType) {
      case SiteType.BOJ:
        return "/baekjoon_logo.png";
      case SiteType.PROGRAMMERS:
        return "/programmers_logo.png";
    }
  },
};

export default Utils;
