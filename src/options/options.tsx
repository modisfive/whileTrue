import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Image, ListGroup, Navbar, Row, Tab } from "react-bootstrap";
import "./options.css";

const App: React.FC<{}> = () => {
  const handleDatabase = () => {
    chrome.runtime.sendMessage({ from: "options", subject: "databasePage" });
  };

  const handleExit = () => {
    chrome.runtime.sendMessage({ from: "options", subject: "exit" });
  };

  return (
    <Container className="App">
      <Navbar style={{ height: "7%" }} className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <Navbar.Brand className="d-flex align-items-center">
          <Image style={{ width: "auto", height: 40 }} src={"/icon.png"} className="me-1" />
          whileTrue 설정
        </Navbar.Brand>
      </Navbar>
      <Container style={{ width: "90%" }}>
        <Tab.Container defaultActiveKey="#link1">
          <Row>
            <Col sm={4}>
              <ListGroup>
                <ListGroup.Item action href="#link2">
                  노션 데이터베이스 링크 다시 공유하기
                </ListGroup.Item>
                <ListGroup.Item action href="#link3">
                  탈퇴하기
                </ListGroup.Item>
                <ListGroup.Item action href="#link4">
                  프로젝트 정보
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                <Tab.Pane eventKey="#link2">
                  <div className="options-content">
                    <Button onClick={handleDatabase} className="p-3">
                      공유하기
                    </Button>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="#link3">
                  <div className="options-content">
                    <div className="w-100">
                      <span className="desc desc-error">
                        탈퇴하더라도 사용 중이던 노션 데이터베이스는 삭제되지 않습니다. <br />
                        이후 다시 해당 데이터베이스를 연결하여 사용할 수 있습니다.
                      </span>
                      <div className="d-flex justify-content-end">
                        <Button variant="danger" className="p-3" onClick={handleExit}>
                          탈퇴하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="#link4">
                  <div className="options-content">
                    <a href="https://github.com/namgons/whileTrue">
                      <Image style={{ width: "auto", height: 40 }} src="/logo/github.svg" />
                    </a>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Container>
  );
};

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
