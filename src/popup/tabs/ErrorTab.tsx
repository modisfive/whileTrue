import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const ErrorTab: React.FC<{}> = () => {
  return (
    <Container className="h-75">
      <div className="h-100 d-flex flex-column justify-content-center">
        <FontAwesomeIcon icon={faTriangleExclamation} size="2xl" style={{ color: "#FFD43B" }} />
        <span>노션 데이터베이스의 칼럼이 적절하지 않습니다.</span>
      </div>
    </Container>
  );
};

export default ErrorTab;
