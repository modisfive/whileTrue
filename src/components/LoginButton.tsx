import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Image } from "react-bootstrap";
import LocalStorage from "../common/storage";
import { OAuth, StorageKey } from "../common/constants";

const handleClick = () => {
  LocalStorage.set(StorageKey.OAUTH_PROCESS_STATUS, true).then(() => {
    chrome.tabs.create({ url: OAuth.NOTION_AUTH_URL, selected: true }, () => {
      window.close();
    });
  });
};

const LoginButton: React.FC<{}> = () => {
  return (
    <Button
      variant="dark"
      onClick={handleClick}
      className="d-flex justify-content-center align-items-center p-3"
    >
      <Image width={35} height={35} className="mx-1" src="/logo/notion_logo.png" />
      Notion 로그인
    </Button>
  );
};

export default LoginButton;
