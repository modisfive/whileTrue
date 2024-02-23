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
};

export default Utils;
