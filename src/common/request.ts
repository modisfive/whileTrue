import { Problem } from "./class";
import { StorageKey } from "./constants";
import LocalStorage from "./storage";

const HOST_URL = "http://localhost:80";

const HostRequest = {
  sendGetRequest: async function (targetUrl: string, accessToken: string) {
    return await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }).then((resp) => resp.json());
  },
  sendPostRequest: async function (targetUrl: string, accessToken: string, body: any) {
    return await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      credentials: "include",
    }).then((resp) => resp.json());
  },
  sendAccessCode: async function (accessCode: string) {
    const requestURL = `${HOST_URL}/member/oauth/${accessCode}`;
    return await fetch(requestURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }).then((resp) => resp.json());
  },
  sendDatabaseID: async function (notionDatabaseUrl: string) {
    const requestURL = `${HOST_URL}/member/notion-database-id`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await this.sendPostRequest(requestURL, accessToken, {
      notionDatabaseUrl,
    });
  },
  getMemberNotionInfo: async function () {
    const requestURL = `${HOST_URL}/member/notion-space`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await this.sendGetRequest(requestURL, accessToken);
  },
  getAllProblemList: async function () {
    const requestURL = `${HOST_URL}/problem`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await this.sendGetRequest(requestURL, accessToken);
  },
  saveNewProblem: async function (problem: Problem) {
    const requestURL = `${HOST_URL}/prolbem`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await this.sendPostRequest(requestURL, accessToken, {
      problem: {
        siteType: problem.site,
        number: problem.number,
        title: problem.title,
        url: problem.url,
      },
    });
  },
  isProblemExists: async function (problem: Problem) {
    const requestURL = `${HOST_URL}/prolbem/check`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await this.sendPostRequest(requestURL, accessToken, {
      problem: {
        siteType: problem.site,
        number: problem.number,
        title: problem.title,
        url: problem.url,
      },
    });
  },
};

export default HostRequest;
