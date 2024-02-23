import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Alert, Button, Col, Container, Form, Image, Navbar, Row } from "react-bootstrap";
import "./databasePage.css";

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
  const [databaseStatus, setDatabaseStatus] = useState(true);

  const handleChange = (e) => {
    const url = e.target.value;
    setDatabaseUrl(url);
    setIsError(!validateNotionDatabaseUrl(url));
  };

  const handleSubmit = () => {
    if (!validateNotionDatabaseUrl(databaseUrl)) {
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

  return (
    <Container className="h-100 d-flex flex-column align-items-center justify-content-center">
      <div className="w-75">
        <Row>
          <span>whileTrue 설정</span>
        </Row>
        <Row>
          <Col>
            <span>Notion Database URL을 입력해주세요.</span>
          </Col>
        </Row>
        <Row>
          <Col>
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
      </div>
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
