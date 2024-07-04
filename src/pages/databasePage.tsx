import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Form, Image, Navbar, Row, Spinner } from "react-bootstrap";
import "./databasePage.css";
import Utils from "../common/utils";

const App: React.FC<{}> = () => {
  const [notionApiKey, setNotionApiKey] = useState("");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavedSucceed, setIsSavedSucceed] = useState("SUCCESS");
  const [isOnProgress, setIsOnProgress] = useState(false);

  const handleChange1 = (e) => {
    const apiKey = e.target.value.trim();
    setNotionApiKey(apiKey);
    setIsSubmitted(false);
  };

  const handleChange2 = (e) => {
    const url = e.target.value.trim();
    setDatabaseUrl(url);
    setIsValidUrl(Utils.validateNotionDatabaseUrl(url));
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (!Utils.validateNotionDatabaseUrl(databaseUrl)) {
      setIsValidUrl(false);
      return;
    }
    setIsOnProgress(true);
    chrome.runtime.sendMessage(
      {
        from: "options",
        subject: "databaseUrl",
        notionApiKey: notionApiKey,
        databaseUrl: databaseUrl,
      },
      (resp) => {
        setIsSubmitted(true);
        setIsSavedSucceed(resp);
        setIsOnProgress(false);
      }
    );
  };

  const msg = () => {
    if (isOnProgress) {
      return <span className="desc">저장 중...</span>;
    }
    if (isSubmitted) {
      if (isSavedSucceed === "SUCCESS") {
        return <span className="desc desc-success">Notion 데이터베이스가 저장되었습니다.</span>;
      }
      if (isSavedSucceed === "INVALID") {
        return (
          <span className="desc desc-error">데이터베이스 칼럼명과 속성이 올바르지 않습니다.</span>
        );
      }
      if (isSavedSucceed === "NOT_FOUND") {
        return (
          <span className="desc desc-error">
            공유한 워크스페이스와 페이지 아래에 있거나, 데이터베이스 형식인지 확인해주세요.
          </span>
        );
      }
    }
    if (databaseUrl !== "" && !isValidUrl) {
      return <span className="desc desc-error">노션 데이터베이스 URL 형식에 맞지 않습니다.</span>;
    }
    return <span></span>;
  };

  return (
    <Container className="App">
      <Navbar className="shadow p-3 bg-body-tertiary rounded" style={{ height: "7%" }}>
        <Navbar.Brand className="d-flex align-items-center">
          <Image style={{ width: "auto", height: 40 }} src={"/icon.png"} className="me-1" />
          whileTrue 노션 데이터베이스 설정
        </Navbar.Brand>
      </Navbar>
      <Container
        style={{ width: "90%", height: "93%" }}
        className="d-flex flex-column justify-content-center"
      >
        <Row className="mb-5">
          <Col className="d-flex justify-content-center">
            <a href="https://school.programmers.co.kr/learn/challenges?order=recent">
              <Button variant="link">Notion 연결 매뉴얼 바로가기</Button>
            </a>
          </Col>
        </Row>
        <Row className="mb-5">
          <Form className="flex align-items-center justify-content-center">
            <Form.Group className="mb-5">
              <Form.Label>Notion API Key를 입력해주세요.</Form.Label>
              <Form.Control
                placeholder="Notion API Key"
                value={notionApiKey}
                onChange={handleChange1}
              />
            </Form.Group>
            <Form.Group className="mb-5">
              <Form.Label>문제를 저장할 Notion 데이터베이스 링크를 공유해주세요.</Form.Label>
              <Form.Control
                placeholder="Notion 데이터베이스 링크"
                value={databaseUrl}
                onChange={handleChange2}
              />
              <Form.Text className="text-muted">{msg()}</Form.Text>
            </Form.Group>
            <Button onClick={handleSubmit} className="w-100">
              {isOnProgress ? <Spinner animation="border" size="sm" /> : "공유하기"}
            </Button>
          </Form>
        </Row>
        <Row className="d-flex">
          <Col className="d-flex justify-content-center">
            <a href="https://www.acmicpc.net/">
              <Button variant="link">백준 바로가기</Button>
            </a>
          </Col>
          <Col className="d-flex justify-content-center">
            <a href="https://school.programmers.co.kr/learn/challenges?order=recent">
              <Button variant="link">프로그래머스 바로가기</Button>
            </a>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
