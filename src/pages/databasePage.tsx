import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Form, Image, Navbar, Row, Spinner } from "react-bootstrap";
import "./databasePage.css";
import Utils from "../common/utils";

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavedSucceed, setIsSavedSucceed] = useState(true);
  const [isOnProgress, setIsOnProgress] = useState(false);

  const handleChange = (e) => {
    const url = e.target.value.trim();
    setDatabaseUrl(url);
    setIsValidUrl(Utils.validateNotionDatabaseUrl(url));
  };

  const handleSubmit = () => {
    if (!Utils.validateNotionDatabaseUrl(databaseUrl)) {
      return;
    }
    setIsOnProgress(true);
    chrome.runtime.sendMessage(
      { from: "options", subject: "databaseUrl", databaseUrl: databaseUrl },
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
      if (isSavedSucceed) {
        return <span className="desc desc-success">Notion 데이터베이스가 저장되었습니다.</span>;
      } else {
        return <span className="desc desc-error">형식을 확인해주세요</span>;
      }
    } else {
      if (databaseUrl === "" || isValidUrl) {
        return <span></span>;
      } else {
        return <span className="desc desc-error">Notion Database URL 형식에 맞지 않습니다.</span>;
      }
    }
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
                  {isOnProgress ? <Spinner animation="border" size="sm" /> : "Submit"}
                </Button>
              </div>
              {msg()}
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
