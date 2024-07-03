import { ProblemPage } from "../common/class";
import { StorageKey } from "../common/constants";
import LocalStorage from "../common/storage";

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

const HostRequest = {
  validateUserNotion: async function name(accessToken: string, databaseUrl: string) {
    const requestURL = "";
    // return await requestGet(requestURL);
  },
  fetchAllProblemPageList: async function () {
    const requestURL = `${HOST_URL}/problem`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await requestGet(requestURL, accessToken);
  },
  saveNewProblem: async function (problemPage: ProblemPage) {
    const requestURL = `${HOST_URL}/problem`;
    const accessToken = await LocalStorage.get(StorageKey.ACCESS_TOKEN);
    return await requestPost(requestURL, accessToken, {
      problemPage,
    });
  },
};

export default HostRequest;
