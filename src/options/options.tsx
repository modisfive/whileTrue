import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const validateNotionDatabaseUrl = (url: string) => {
  const regExr = /https:\/\/www\.notion\.so\/(.+?)\/(.+?)\?v=(.+)/;
  if (!regExr.test(url)) {
    return false;
  }
  const target = url.match(regExr)[2];
  return target.length == 32;
};

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const url = e.target.value;
    setDatabaseUrl(url);
    setIsError(!validateNotionDatabaseUrl(url));
  };

  const handleSubmit = (e) => {
    if (!isError) {
      return;
    }

    e.preventDefault();
    chrome.runtime.sendMessage({
      from: "options",
      subject: "databaseUrl",
      databaseUrl: databaseUrl,
    });
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
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Label htmlFor="inlineFormInput">Notion Database URL</Form.Label>
            <Form.Control
              width="200em"
              className="mb-2"
              id="inlineFormInput"
              placeholder="Notion Database URL을 입력해주세요."
              value={databaseUrl}
              onChange={handleChange}
            />
          </Col>
          {isError && (
            <Col>
              <Alert key="danger" variant="danger">
                This is a alert—check it out!
              </Alert>
            </Col>
          )}
          <Col xs="auto">
            <Button type="submit" className="mb-2">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      <button onClick={handleClick1}>Access Token 출력하기</button>
      <button onClick={handleClick2}>Access Token 삭제하기</button>
      <button onClick={handleClick3}>사용자 정보 가져오기</button>
      <button onClick={handleClick4}>모든 문제 가져오기</button>
    </Container>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
