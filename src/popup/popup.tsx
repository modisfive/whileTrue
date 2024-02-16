import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./popup.css";
import TabComponent from "./tabs";
import LoginTab from "./tabs/LoginTab";
import { Container } from "react-bootstrap";

type UserStatusProps = {
  isAccessTokenExists: boolean;
  isNotionInfoExists: boolean;
};

const getLoginStatus = (setUserStatus: CallableFunction) => {
  const userStatus = {
    isAccessTokenExists: false,
    isNotionInfoExists: false,
  };

  chrome.runtime.sendMessage({ from: "popup", subject: "accessToken" }, (resp) => {
    userStatus.isAccessTokenExists = resp;
    if (!resp) {
      setUserStatus(userStatus);
    } else {
      chrome.runtime.sendMessage({ from: "popup", subject: "notionInfo" }, (resp) => {
        userStatus.isNotionInfoExists = resp;
        setUserStatus(userStatus);
      });
    }
  });
};

const App: React.FC<{}> = () => {
  const [userStatus, setUserStatus] = useState<UserStatusProps>({
    isAccessTokenExists: false,
    isNotionInfoExists: false,
  });

  useEffect(() => {
    getLoginStatus(setUserStatus);
  }, []);

  return (
    <Container className="App">
      <div>
        <h1>알고리즘 문제 다시 풀기</h1>
      </div>
      <br />
      {!userStatus.isAccessTokenExists ? (
        <LoginTab />
      ) : !userStatus.isNotionInfoExists ? (
        <h2>데이터베이스 정보를 저장해주세요.</h2>
      ) : (
        <TabComponent />
      )}
    </Container>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
