import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Image } from "react-bootstrap";

const handleClick = () => {
  chrome.runtime.sendMessage({ from: "options", subject: "databasePage" }, () => {});
};

const LoginButton: React.FC<{}> = () => {
  return (
    <Button
      variant="dark"
      onClick={handleClick}
      className="d-flex justify-content-center align-items-center p-3"
    >
      <Image width={35} height={35} className="mx-1" src="/logo/notion_logo.png" />
      Notion 연동하기
    </Button>
  );
};

export default LoginButton;
