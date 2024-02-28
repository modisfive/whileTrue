import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Navbar,
  Row,
  Spinner,
  Tab,
  Table,
} from "react-bootstrap";
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
    <Container className="App">
      <Navbar style={{ height: "5%" }}>
        <Navbar.Brand>whileTrue</Navbar.Brand>
      </Navbar>
      <Container style={{ height: "95%" }} className="d-flex flex-column justify-content-evenly">
        <div>
          <Row>
            <Col>
              <span>문제를 저장할 Notion 데이터베이스 링크를 공유해주세요.</span>
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
        <div>
          <Row className="d-flex justify-content-center">
            <span>
              - <span style={{ color: "red" }}>기존의 노션 데이터베이스를 사용하는 경우,</span>{" "}
              공유한 워크스페이스, 페이지 아래에 있어야 하며, 다음의 필수 칼럼이 존재하고 속성이
              일치하는지 확인해주세요.
            </span>
            <Table striped bordered style={{ width: "60%" }}>
              <thead>
                <tr>
                  <th>칼럼명</th>
                  <th>속성</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>출처</td>
                  <td>select</td>
                </tr>
                <tr>
                  <td>난이도</td>
                  <td>select</td>
                </tr>
                <tr>
                  <td>문제 번호</td>
                  <td>number</td>
                </tr>
                <tr>
                  <td>문제 제목</td>
                  <td>title</td>
                </tr>
                <tr>
                  <td>URL</td>
                  <td>url</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </div>
      </Container>
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
