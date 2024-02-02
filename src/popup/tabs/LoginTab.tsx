import React, { FC } from "react";

const handleClick = () => {
  chrome.tabs.create({ url: "", selected: true }, () => {
    window.close();
    chrome.tabs.getCurrent(function (tab) {
      // chrome.tabs.remove(tab.id, function () {});
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
