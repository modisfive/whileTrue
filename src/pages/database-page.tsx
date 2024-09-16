import React, { FC } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Col, Container, Image, Navbar, Row } from "react-bootstrap";
import "./databasePage.css";
import NotionDatabaseForm from "../components/notion-database-form";

const App: FC = () => {
  return (
    <Container className="App">
      <CustomNavbar />
      <Container
        style={{ width: "90%", height: "93%" }}
        className="d-flex flex-column justify-content-center"
      >
        <GuideRow />
        <NotionDatabaseForm />
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

const container = document.createElement("div");
container.setAttribute("id", "root");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
