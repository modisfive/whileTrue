const HOST_URL = "http://localhost:80";

const sendGetRequest = async (targetUrl: string) => {
  return await fetch(targetUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  }).then((resp) => resp.json());
};

export const sendAccessCode = async (accessCode: string) => {
  const requestURL = `${HOST_URL}/member/oauth/${accessCode}`;
  return await sendGetRequest(requestURL);
};
