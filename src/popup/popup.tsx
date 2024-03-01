import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./popup.css";
import TabList from "./tabs/TabList";
import LoginTab from "./tabs/LoginTab";
import { Container, Image, Navbar, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
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
  const [waitRefresh, setWaitRefresh] = useState(false);
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      노션 데이터베이스 동기화
    </Tooltip>
  );

  const handleRefresh = () => {
    if (waitRefresh) {
      console.log("no refresh!!");
      return;
    }

    setIsOnProgress(true);
    setWaitRefresh(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "fetchAllProblems" }, () => {
      console.log("Refreshed!!");
      setIsOnProgress(false);
    });
    setTimeout(() => {
      setWaitRefresh(false);
      console.log("now refresh!!");
    }, 10000);
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
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <FontAwesomeIcon icon={faRotate} onClick={handleRefresh} role="button" />
                  </OverlayTrigger>
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
