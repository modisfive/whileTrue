import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row } from "react-bootstrap";

const DatabaseInsertTab: React.FC<{}> = () => {
  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <Row>
        <span>데이터베이스 URL을 입력해주세요.</span>
      </Row>
    </Container>
  );
};

export default DatabaseInsertTab;
