import React, { FC } from "react";
import { NOTION_AUTH_URL } from "../../../env";
import { setOAuthProcessStatus } from "../../common/storage";

const handleClick = () => {
  chrome.tabs.create({ url: NOTION_AUTH_URL, selected: true }, () => {
    window.close();
    setOAuthProcessStatus(true);
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
