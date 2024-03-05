import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Navbar,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import "./databasePage.css";
import Utils from "../common/utils";

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavedSucceed, setIsSavedSucceed] = useState("SUCCESS");
  const [isOnProgress, setIsOnProgress] = useState(false);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      기존의 노션 데이터베이스를 사용하는 경우, "출처"(select 타입), "난이도"(select 타입), "문제
      번호"(number 타입), "문제 제목"(title 타입), "URL"(url 타입) 등 해당 칼럼명과 타입을 가지는
      칼럼이 반드시 존재해야 합니다.
    </Tooltip>
  );

  const handleChange = (e) => {
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
      if (isSavedSucceed === "SUCCESS") {
        return <span className="desc desc-success">Notion 데이터베이스가 저장되었습니다.</span>;
      } else if (isSavedSucceed === "INVALID") {
        return (
          <span className="desc desc-error">데이터베이스 칼럼명과 속성이 올바르지 않습니다.</span>
        );
      } else if (isSavedSucceed === "NOT_FOUND") {
        return (
          <span className="desc desc-error">
            공유한 워크스페이스와 페이지 아래에 있거나, 데이터베이스 형식인지 확인해주세요.
          </span>
        );
      }
    } else {
      if (databaseUrl === "" || isValidUrl) {
        return <span></span>;
      } else {
        return <span className="desc desc-error">노션 데이터베이스 URL 형식에 맞지 않습니다.</span>;
      }
    }
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
        <Row className="d-flex justify-content-center mb-3">
          <Image style={{ width: "auto", height: 300 }} src="/share-database.png" />
        </Row>
        <Row className="mb-5">
          <Col>
            <span>문제를 저장할 Notion 데이터베이스 링크를 공유해주세요.</span>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <Button variant="danger" className="ms-3">
                기존의 데이터베이스를 사용하는 경우
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form className="w-100">
              <div className="d-flex w-100">
                <Form.Control
                  className="mb-2 me-2 w-75"
                  id="inlineFormInput"
                  value={databaseUrl}
                  onChange={handleChange}
                />
                <Button onClick={handleSubmit} className="mb-2 w-25">
                  {isOnProgress ? <Spinner animation="border" size="sm" /> : "공유하기"}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="d-flex mb-4" style={{ height: "20px" }}>
          <span>{msg()}</span>
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
