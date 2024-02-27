import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Navbar, Row } from "react-bootstrap";
import "./options.css";
import LoginButton from "../components/LoginButton";

const App: React.FC<{}> = () => {
  const handleDatabase = () => {
    chrome.runtime.sendMessage({ from: "options", subject: "databasePage" }, (resp) => {});
  };

  const handleExit = () => {
    chrome.runtime.sendMessage(
      {
        from: "options",
        subject: "exit",
      },
      (resp) => {}
    );
  };

  const handleClick1 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "accessToken",
      todo: "show",
    });
  };

  const handleClick2 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "accessToken",
      todo: "delete",
    });
  };

  const handleClick3 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "notionInfo",
    });
  };

  const handleClick4 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "allProblems",
    });
  };

  return (
    <Container>
      <Navbar style={{ height: "5%" }} className="mb-5">
        <Navbar.Brand>whileTrue 설정</Navbar.Brand>
      </Navbar>
      <div style={{ height: "95%" }}>
        <Row className="property">
          <Col className="property-item">
            <span>현재 연결되어 있는 노션 정보</span>
          </Col>
          <Col className="property-item"></Col>
        </Row>
        <hr />
        <Row className="property">
          <Col className="property-item">
            <span>노션 데이터베이스 링크 다시 공유하기</span>
          </Col>
          <Col className="property-item justify-content-end">
            <Button onClick={handleDatabase} className="p-3">
              공유하기
            </Button>
          </Col>
        </Row>
        <hr />
        <Row className="property">
          <Col className="property-item">
            <span>공유할 워크스페이스, 페이지 다시 선택하기</span>
          </Col>
          <Col className="property-item justify-content-end">
            <LoginButton />
          </Col>
        </Row>
        <hr />
        <Row className="property">
          <Col className="property-item">
            <Button variant="danger" className="p-3" onClick={handleExit}>
              탈퇴하기
            </Button>
          </Col>
          <Col className="property-item justify-content-end">
            <span>
              탈퇴하시더라도 사용자의 노션 데이터베이스는 삭제되지 않으며, 이후 다시 whileTrue에
              연결할 수 있습니다.
            </span>
          </Col>
        </Row>

        <Row>
          <button onClick={handleClick1}>Access Token 출력하기</button>
          <button onClick={handleClick2}>Access Token 삭제하기</button>
          <button onClick={handleClick3}>사용자 정보 가져오기</button>
          <button onClick={handleClick4}>모든 문제 가져오기</button>
        </Row>
      </div>
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
