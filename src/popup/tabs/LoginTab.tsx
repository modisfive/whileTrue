import React, { FC } from "react";
import { OAuth, StorageKey } from "../../common/constants";
import LocalStorage from "../../common/storage";
import { Button, ButtonToolbar, Col, Container, Image, Row } from "react-bootstrap";

const handleClick = () => {
  LocalStorage.set(StorageKey.OAUTH_PROCESS_STATUS, true).then(() => {
    chrome.tabs.create({ url: OAuth.NOTION_AUTH_URL, selected: true }, () => {
      window.close();
    });
  });
};

const LoginTab: FC<{}> = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center ">
      <Button
        variant="secondary"
        onClick={handleClick}
        className="d-flex justify-content-center align-items-center shadow-lg p-3 mb-5 rounded"
      >
        <Col>
          <Image width={50} height={50} src="/notion_logo.png" />
        </Col>
        <Col>Notion 로그인하기</Col>
      </Button>
    </Container>
  );
};

export default LoginTab;
