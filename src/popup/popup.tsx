import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./popup.css";
import TabList from "./tabs/TabList";
import LoginTab from "./tabs/LoginTab";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

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

const handleClick = () => {
  chrome.runtime.sendMessage({ from: "popup", subject: "openOptionsTab" });
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
      <Navbar>
        <Container>
          <Navbar.Brand>whileTrue</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <FontAwesomeIcon icon={faGear} size="xl" onClick={handleClick} role="button" />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {!userStatus.isAccessTokenExists ? (
        <LoginTab />
      ) : !userStatus.isNotionInfoExists ? (
        <h2>데이터베이스 정보를 저장해주세요.</h2>
      ) : (
        <TabList />
      )}
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
