import React, { FC } from "react";
import { Container } from "react-bootstrap";
import LoginButton from "../../components/LoginButton";

const LoginTab: FC<{}> = () => {
  return (
    <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
      <LoginButton />
    </Container>
  );
};

export default LoginTab;
