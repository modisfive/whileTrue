import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./popup.css";
import TabComponent from "./tabs";
import LoginTab from "./tabs/LoginTab";

type UserStatusProps = {
  isAccessTokenExists: boolean;
  isUserNotionIntoExists: boolean;
};

const getLoginStatus = (setUserStatus: CallableFunction) => {
  const userStatus = {
    isAccessTokenExists: false,
    isUserNotionIntoExists: false,
  };

  chrome.runtime.sendMessage({ from: "popup", subject: "accessToken" }, (resp) => {
    userStatus.isAccessTokenExists = resp;
    if (!resp) {
      setUserStatus(userStatus);
    } else {
      chrome.runtime.sendMessage({ from: "popup", subject: "notionInfo" }, (resp) => {
        userStatus.isUserNotionIntoExists = resp;
        setUserStatus(userStatus);
      });
    }
  });
};

const App: React.FC<{}> = () => {
  const [userStatus, setUserStatus] = useState<UserStatusProps>({
    isAccessTokenExists: false,
    isUserNotionIntoExists: false,
  });

  useEffect(() => {
    getLoginStatus(setUserStatus);
  }, []);

  return (
    <div className="App">
      <h1>알고리즘 문제 다시 풀기</h1>
      <br />
      {!userStatus.isAccessTokenExists ? (
        <LoginTab />
      ) : !userStatus.isUserNotionIntoExists ? (
        <h2>데이터베이스 정보를 저장해주세요.</h2>
      ) : (
        <TabComponent />
      )}
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
