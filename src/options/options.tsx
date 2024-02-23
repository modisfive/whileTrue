import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Form, Image, Navbar, Row } from "react-bootstrap";
import "./options.css";
import Utils from "../common/utils";

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [isError, setIsError] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState(true);

  const handleChange = (e) => {
    const url = e.target.value;
    setDatabaseUrl(url);
    setIsError(!Utils.validateNotionDatabaseUrl(url));
  };

  const handleSubmit = () => {
    if (!Utils.validateNotionDatabaseUrl(databaseUrl)) {
      return;
    }

    chrome.runtime.sendMessage(
      {
        from: "options",
        subject: "databaseUrl",
        databaseUrl: databaseUrl,
      },
      (resp) => setDatabaseStatus(resp)
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

  const handleExit = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "exit",
    });
  };

  return (
    <Container>
      <Navbar expand="lg" className="mb-5">
        <Navbar.Brand>whileTrue 설정</Navbar.Brand>
      </Navbar>
      <div>
        <Row className="property">
          <Col className="property-item">
            <span>현재 연결되어 있는 노션 정보</span>
          </Col>
          <Col className="property-item"></Col>
        </Row>
        <hr />
        <Row className="property">
          <Col className="property-item">
            <span>Notion Database URL 재입력하기</span>
          </Col>
          <Col className="property-item">
            <Form className="w-100">
              <div className="d-flex">
                <Form.Control
                  width="200em"
                  className="mb-2"
                  id="inlineFormInput"
                  value={databaseUrl}
                  onChange={handleChange}
                />
                <Button onClick={handleSubmit} className="mb-2">
                  Submit
                </Button>
              </div>

              {isError ? (
                <span className="desc desc-error">Notion Database URL 형식에 맞지 않습니다.</span>
              ) : databaseStatus ? (
                <span className="desc">Notion Database URL을 입력해주세요.</span>
              ) : (
                <span className="desc desc-error">형식을 확인해주세요</span>
              )}
            </Form>
          </Col>
        </Row>
        <hr />
        <Row className="property">
          <Col className="property-item">
            <span>재로그인하기</span>
          </Col>
          <Col className="property-item justify-content-end">
            <Button
              variant="dark"
              // onClick={handleClick}
              className="d-flex justify-content-center align-items-center p-3"
            >
              <Image width={35} height={35} className="mx-1" src="/notion_logo.png" />
              Notion 로그인
            </Button>
          </Col>
        </Row>
        <hr />
        <Row className="property">
          <Col className="property-item">
            <span></span>
          </Col>
          <Col className="property-item justify-content-end">
            <Button variant="danger" className="p-3" onClick={handleExit}>
              탈퇴하기
            </Button>
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
