import React, { FC } from "react";
import { Container } from "react-bootstrap";
import LoginButton from "../../components/login-button";

const LoginTab: FC = () => {
  return (
    <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
      <LoginButton />
    </Container>
  );
};

export default LoginTab;
