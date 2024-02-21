import React, { FC } from "react";
import { OAuth, StorageKey } from "../../common/constants";
import LocalStorage from "../../common/storage";
import { Button, Col, Container, Image } from "react-bootstrap";

const handleClick = () => {
  LocalStorage.set(StorageKey.OAUTH_PROCESS_STATUS, true).then(() => {
    chrome.tabs.create({ url: OAuth.NOTION_AUTH_URL, selected: true }, () => {
      window.close();
    });
  });
};

const LoginTab: FC<{}> = () => {
  return (
    <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
      <Button
        variant="dark"
        onClick={handleClick}
        className="d-flex justify-content-center align-items-center p-3"
      >
        <Image width={35} height={35} className="mx-1" src="/notion_logo.png" />
        Notion 로그인
      </Button>
    </Container>
  );
};

export default LoginTab;
