import React, { FC, useState, ChangeEvent } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Form, Image, Navbar, Row, Spinner } from "react-bootstrap";
import "./databasePage.css";
import Utils from "../common/utils";
import { RESP_STATUS } from "../common/constants";

const App: FC = () => {
  return (
    <Container className="App">
      <CustomNavbar />
      <Container
        style={{ width: "90%", height: "93%" }}
        className="d-flex flex-column justify-content-center"
      >
        <GuideRow />
        <FormRow />
        <LinkRow />
      </Container>
    </Container>
  );
};

const CustomNavbar: FC = () => (
  <Navbar className="shadow p-3 bg-body-tertiary rounded" style={{ height: "7%" }}>
    <Navbar.Brand className="d-flex align-items-center">
      <Image style={{ width: "auto", height: 40 }} src={"/icon.png"} className="me-1" />
      whileTrue 노션 데이터베이스 설정
    </Navbar.Brand>
  </Navbar>
);

const GuideRow: FC = () => (
  <Row className="mb-5">
    <Col className="d-flex justify-content-center">
      <a href="https://github.com/namgons/whileTrue/blob/main/start_guide.md" target="_blank">
        <Button variant="link">Notion 연결 매뉴얼 바로가기</Button>
      </a>
    </Col>
  </Row>
);

const FormRow: FC = () => {
  const [notionApiKey, setNotionApiKey] = useState<string>("");
  const [databaseUrl, setDatabaseUrl] = useState<string>("");
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSavedSucceed, setIsSavedSucceed] = useState<RESP_STATUS>(RESP_STATUS.SUCCESS);
  const [isOnProgress, setIsOnProgress] = useState<boolean>(false);

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNotionApiKey(e.target.value.trim());
    setIsSubmitted(false);
  };

  const handleDatabaseUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      (resp: RESP_STATUS) => {
        setIsSubmitted(true);
        setIsSavedSucceed(resp);
        setIsOnProgress(false);
      }
    );
  };

  const renderMessage = () => {
    if (isOnProgress) {
      return renderProgressMessage();
    }
    if (isSubmitted) {
      switch (isSavedSucceed) {
        case RESP_STATUS.SUCCESS:
          return renderSuccessMessage();
        case RESP_STATUS.INVALID:
          return renderInvalidMessage();
        case RESP_STATUS.NOT_FOUND:
          return renderNotFoundMessage();
        case RESP_STATUS.UNAUTHORIZED:
          return renderUnauthorizedMessage();
        default:
          return null;
      }
    }
    if (databaseUrl !== "" && !isValidUrl) {
      return renderUrlInvalidMessage();
    }
    return null;
  };

  return (
    <Row className="mb-5">
      <Form className="flex align-items-center justify-content-center">
        <Form.Group className="mb-5">
          <Form.Label>Notion API Key를 입력해주세요.</Form.Label>
          <Form.Control
            placeholder="Notion API Key"
            value={notionApiKey}
            onChange={handleApiKeyChange}
            type="password"
          />
        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label>문제를 저장할 Notion 데이터베이스 링크를 공유해주세요.</Form.Label>
          <Form.Control
            placeholder="Notion 데이터베이스 링크"
            value={databaseUrl}
            onChange={handleDatabaseUrlChange}
          />
          <Form.Text className="text-muted">{renderMessage()}</Form.Text>
        </Form.Group>
        <Button onClick={handleSubmit} className="w-100">
          {isOnProgress ? <Spinner animation="border" size="sm" /> : "공유하기"}
        </Button>
      </Form>
    </Row>
  );
};

const LinkRow: FC = () => (
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
);

const renderProgressMessage = () => <span className="desc">저장 중...</span>;
const renderSuccessMessage = () => (
  <span className="desc desc-success">Notion 데이터베이스가 저장되었습니다.</span>
);
const renderInvalidMessage = () => (
  <span className="desc desc-error">데이터베이스 칼럼명과 속성이 올바르지 않습니다.</span>
);
const renderNotFoundMessage = () => (
  <span className="desc desc-error">
    데이터베이스에 API를 연결했는지, 데이터베이스 형식인지 확인해주세요.
  </span>
);
const renderUnauthorizedMessage = () => (
  <span className="desc desc-error">Notion API Key가 유효하지 않습니다.</span>
);
const renderUrlInvalidMessage = () => (
  <span className="desc desc-error">노션 데이터베이스 URL 형식에 맞지 않습니다.</span>
);

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
