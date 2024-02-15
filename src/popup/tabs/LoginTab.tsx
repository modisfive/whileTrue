import React, { FC } from "react";
import { OAuth, StorageKey } from "../../common/constants";
import LocalStorage from "../../common/storage";

const handleClick = () => {
  LocalStorage.set(StorageKey.OAUTH_PROCESS_STATUS, true).then(() => {
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
