import { Problem } from "./class";
import { getAccessToken } from "./storage";

const HOST_URL = "http://localhost:80";

const sendGetRequest = async (targetUrl: string, accessToken: string) => {
  return await fetch(targetUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  }).then((resp) => resp.json());
};

const sendPostRequest = async (targetUrl: string, accessToken: string, body: any) => {
  return await fetch(targetUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
    credentials: "include",
  }).then((resp) => resp.json());
};

export const sendAccessCode = async (accessCode: string) => {
  const requestURL = `${HOST_URL}/member/oauth/${accessCode}`;
  return await fetch(requestURL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  }).then((resp) => resp.json());
};

// 토큰 리프레시

export const sendDatabaseID = async (notionDatabaseUrl: string) => {
  const requestURL = `${HOST_URL}/member/notion-database-id`;
  const accessToken = await getAccessToken();
  return await sendPostRequest(requestURL, accessToken, {
    notionDatabaseUrl,
  });
};

export const getMemberNotionInfo = async () => {
  const requestURL = `${HOST_URL}/member/notion-space`;
  const accessToken = await getAccessToken();
  return await sendGetRequest(requestURL, accessToken);
};

export const getAllProblemList = async () => {
  const requestURL = `${HOST_URL}/problem`;
  const accessToken = await getAccessToken();
  return await sendGetRequest(requestURL, accessToken);
};

export const saveNewProblem = async (problem: Problem) => {
  const requestURL = `${HOST_URL}/prolbem`;
  const accessToken = await getAccessToken();
  return await sendPostRequest(requestURL, accessToken, {
    problem: {
      siteType: problem.site,
      number: problem.number,
      title: problem.title,
      url: problem.url,
    },
  });
};

export const isProblemExists = async (problem: Problem) => {
  const requestURL = `${HOST_URL}/prolbem/check`;
  const accessToken = await getAccessToken();
  return await sendPostRequest(requestURL, accessToken, {
    problem: {
      siteType: problem.site,
      number: problem.number,
      title: problem.title,
      url: problem.url,
    },
  });
};
