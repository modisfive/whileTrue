import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./popup.css";
import TabList from "./tabs/TabList";
import LoginTab from "./tabs/LoginTab";
import { Container, Image, Navbar, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import DatabaseInsertTab from "./tabs/DatabaseInsertTab";
import Utils from "../common/utils";
import { UserStatus } from "../common/class";

const App: React.FC<{}> = () => {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isLogined: false,
    isNotionLinked: false,
  });
  const [isOnProgress, setIsOnProgress] = useState(false);

  const handleClick = () => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "fetchAllProblems" }, () => {
      setIsOnProgress(false);
    });
  };

  useEffect(() => {
    Utils.getUserStatus().then((resp) => setUserStatus(resp));
  }, []);

  return (
    <Container className="App">
      <Navbar>
        <Container>
          <Navbar.Brand className="d-flex align-items-center">
            <Image style={{ width: "auto", height: 30 }} src={"/icon.png"} className="me-1" />
            whileTrue
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {userStatus.isNotionLinked &&
                (isOnProgress ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <FontAwesomeIcon icon={faRotate} onClick={handleClick} role="button" />
                ))}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {!userStatus.isLogined ? (
        <LoginTab />
      ) : !userStatus.isNotionLinked ? (
        <DatabaseInsertTab />
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
