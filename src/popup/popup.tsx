import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./popup.css";
import TabList from "./tabs/TabList";
import LoginTab from "./tabs/LoginTab";
import { Container, Image, Navbar, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Utils from "../common/utils";
import { UserStatus } from "../common/class";
import { RESP_STATUS } from "../common/constants";
import ErrorTab from "./tabs/ErrorTab";

const App: React.FC<{}> = () => {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isNotionLinked: false,
    respStatus: RESP_STATUS.SUCCESS,
  });
  const [isOnProgress, setIsOnProgress] = useState(false);
  const [waitRefresh, setWaitRefresh] = useState(false);
  const [isError, setIsError] = useState(false);
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      노션 데이터베이스 동기화
    </Tooltip>
  );

  const handleRefresh = () => {
    setIsOnProgress(true);

    /* 연속해서 새로고침하는 경우를 방지하기 위한 코드 (10초에 한번씩만 새로고침할 수 있다) */
    if (waitRefresh) {
      setTimeout(() => setIsOnProgress(false), 500);
      return;
    }

    chrome.runtime.sendMessage({ from: "popup", subject: "fetchAllProblems" }, (resp) => {
      setIsOnProgress(false);
      setIsError(false);
      if (resp === RESP_STATUS.FAILED) {
        setIsError(true);
      }
    });
    setWaitRefresh(true);
    setTimeout(() => setWaitRefresh(false), 10000);
  };

  useEffect(() => {
    Utils.getUserStatus().then((resp) => setUserStatus(resp));
  }, []);

  const body = () => {
    if (!userStatus.isNotionLinked) {
      return <LoginTab />;
    }
    if (userStatus.respStatus === RESP_STATUS.FAILED || isError) {
      return <ErrorTab />;
    }
    return <TabList setIsError={setIsError} />;
  };

  const refreshBtn = () => {
    if (!userStatus.isNotionLinked) {
      return;
    }
    if (isOnProgress) {
      return <Spinner animation="border" size="sm" />;
    }
    return (
      <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <FontAwesomeIcon icon={faRotate} onClick={handleRefresh} role="button" />
      </OverlayTrigger>
    );
  };

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
            <Navbar.Text>{refreshBtn()}</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {body()}
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
