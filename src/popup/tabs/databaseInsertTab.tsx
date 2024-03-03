import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Container, Row } from "react-bootstrap";

const handleClick = () => {
  chrome.runtime.sendMessage({ from: "options", subject: "databasePage" });
};

const DatabaseInsertTab: React.FC<{}> = () => {
  return (
    <Container className="h-75">
      <div className="h-100 d-flex flex-column justify-content-center">
        <span>데이터베이스 URL을 입력해주세요.</span>
        <Button variant="link" onClick={handleClick}>
          바로가기
        </Button>
      </div>
    </Container>
  );
};

export default DatabaseInsertTab;
