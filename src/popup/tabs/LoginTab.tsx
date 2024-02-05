import React, { FC } from "react";
import { setOAuthProcessStatus } from "../../common/storage";
import { OAuth } from "../../common/constants";

const handleClick = () => {
  setOAuthProcessStatus(true).then(() => {
    chrome.tabs.create({ url: OAuth.NOTION_AUTH_URL, selected: true }, () => {
      window.close();
    });
  });
};

const LoginTab: FC<{}> = () => {
  return (
    <div>
      <h1>로그인하기</h1>
      <button onClick={handleClick}>Notion 로그인</button>
    </div>
  );
};

export default LoginTab;
