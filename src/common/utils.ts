import { SiteType, SiteHost } from "./constants";

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
};

export default Utils;
