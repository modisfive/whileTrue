import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Container, Row } from "react-bootstrap";

const handleClink = () => {
  chrome.runtime.sendMessage({ from: "options", subject: "databasePage" });
};

const DatabaseInsertTab: React.FC<{}> = () => {
  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <Row>
        <span>데이터베이스 URL을 입력해주세요.</span>
        <Button variant="link" onClick={handleClink}>
          바로가기
        </Button>
      </Row>
    </Container>
  );
};

export default DatabaseInsertTab;
