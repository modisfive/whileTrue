import { ProblemPage } from "./class";
import { StorageKey } from "./constants";
import LocalStorage from "./storage";

// const HOST_URL = "http://localhost:80";
const HOST_URL = "https://whiletrue.co.kr";

const requestGet = async (targetUrl: string, accessToken: any) => {
  return await fetch(targetUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  }).then((resp) => resp.json());
};

const requestPost = async (targetUrl: string, accessToken: any, body: any) => {
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
};

const requestDelete = async (targetUrl: string, accessToken: any) => {
  return await fetch(targetUrl, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  }).then((resp) => resp.json());
};

const requestRefreshToken = async () => {
  const requestURL = `${HOST_URL}/member/auth/token/refresh`;
  return await fetch(requestURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  }).then((resp) => resp.json());
};

const sendGetRequest = async (targetUrl: string, accessToken: any) => {
  return await requestGet(targetUrl, accessToken).then((resp) => {
    if (resp.code === "AUTH-401-1") {
      return requestRefreshToken().then((resp) => {
        LocalStorage.set(StorageKey.ACCESS_TOKEN, resp.data.accessToken);
        return requestGet(targetUrl, accessToken);
      });
    } else {
      return resp;
    }
  });
};

const sendPostRequest = async (targetUrl: string, accessToken: any, body: any) => {
  return await requestPost(targetUrl, accessToken, body).then((resp) => {
    if (resp.code === "AUTH-401-1") {
      return requestRefreshToken().then(async (resp) => {
        LocalStorage.set(StorageKey.ACCESS_TOKEN, resp.data.accessToken);
        return requestPost(targetUrl, resp.data.accessToken, body);
      });
    } else {
      return resp;
    }
  });
};

const sendDeleteRequest = async (targetUrl: string, accessToken: any) => {
  return await requestDelete(targetUrl, accessToken).then((resp) => {
    if (resp.code === "AUTH-401-1") {
      return requestRefreshToken().then(async (resp) => {
        return requestDelete(targetUrl, resp.data.accessToken);
      });
    } else {
      return resp;
    }
  });
};

const HostRequest = {
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
    return await sendPostRequest(requestURL, accessToken, {
      notionDatabaseUrl,
    });
  },
  getMemberNotionInfo: async function () {
    const requestURL = `${HOST_URL}/member/notion-space`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await sendGetRequest(requestURL, accessToken);
  },
  getAllProblemPageList: async function () {
    const requestURL = `${HOST_URL}/problem`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await sendGetRequest(requestURL, accessToken);
  },
  saveNewProblem: async function (problemPage: ProblemPage) {
    const requestURL = `${HOST_URL}/problem`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await sendPostRequest(requestURL, accessToken, {
      problemPage,
    });
  },
  isProblemExists: async function (problemPage: ProblemPage) {
    const requestURL = `${HOST_URL}/problem/check`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await sendPostRequest(requestURL, accessToken, {
      problemPage,
    });
  },
  deleteMember: async function () {
    const requestUrl = `${HOST_URL}/member`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await sendDeleteRequest(requestUrl, accessToken);
  },
};

export default HostRequest;
