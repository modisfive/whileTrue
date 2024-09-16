import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { RESP_STATUS } from "../common/enums/response-status.enum";
import Utils from "../common/utils";
import { Button, Form, Row, Spinner } from "react-bootstrap";
import LocalStorage from "../common/storage";
import { StorageKey } from "../common/enums/storage.enum";
import "./NotionDatabaseForm.css";

const STATUS_MESSAGES = {
  [RESP_STATUS.SUCCESS]: "Notion 데이터베이스가 저장되었습니다.",
  [RESP_STATUS.INVALID]: "데이터베이스 칼럼명과 속성이 올바르지 않습니다.",
  [RESP_STATUS.NOT_FOUND]: "데이터베이스에 API를 연결했는지, 데이터베이스 형식인지 확인해주세요.",
  [RESP_STATUS.UNAUTHORIZED]: "Notion API Key가 유효하지 않습니다.",
};

const NotionDatabaseForm: FC = () => {
  const [notionApiKey, setNotionApiKey] = useState<string>("");
  const [databaseUrl, setDatabaseUrl] = useState<string>("");
  const [isOnProgress, setIsOnProgress] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<RESP_STATUS | null>(null);

  useEffect(() => {
    LocalStorage.get(StorageKey.NOTION_API_KEY).then((savedNotionApiKey) =>
      setNotionApiKey(savedNotionApiKey)
    );
    LocalStorage.get(StorageKey.DATABASE_URL).then((savedDatabaseUrl) => {
      setDatabaseUrl(savedDatabaseUrl);
    });
  }, []);

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNotionApiKey(e.target.value.trim());
    setSubmitStatus(null);
  };

  const handleDatabaseUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setDatabaseUrl(url);
    setSubmitStatus(null);
  };

  const handleSubmit = () => {
    if (!Utils.validateNotionDatabaseUrl(databaseUrl)) {
      setSubmitStatus(RESP_STATUS.INVALID);
      return;
    }
    setIsOnProgress(true);
    chrome.runtime.sendMessage(
      {
        from: "options",
        subject: "databaseUrl",
        notionApiKey,
        databaseUrl,
      },
      (resp: RESP_STATUS) => {
        setSubmitStatus(resp);
        setIsOnProgress(false);
      }
    );
  };

  const renderMessage = () => {
    if (isOnProgress) return <span className="desc">저장 중...</span>;

    if (databaseUrl && !Utils.validateNotionDatabaseUrl(databaseUrl)) {
      return <span className="desc desc-error">노션 데이터베이스 URL 형식에 맞지 않습니다.</span>;
    }

    const message = STATUS_MESSAGES[submitStatus];
    if (message) {
      const messageClass = submitStatus === RESP_STATUS.SUCCESS ? "desc-success" : "desc-error";
      return <span className={`desc ${messageClass}`}>{message}</span>;
    }

    return null;
  };

  return (
    <Row className="mb-5">
      <Form className="flex align-items-center justify-content-center">
        <Form.Group className="mb-5">
          <Form.Label>Notion API Key를 입력해주세요.</Form.Label>
          <Form.Control
            placeholder="Notion API Key"
            value={notionApiKey}
            onChange={handleApiKeyChange}
            type="password"
          />
        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label>문제를 저장할 Notion 데이터베이스 링크를 공유해주세요.</Form.Label>
          <Form.Control
            placeholder="Notion 데이터베이스 링크"
            value={databaseUrl}
            onChange={handleDatabaseUrlChange}
          />
          <Form.Text className="text-muted">{renderMessage()}</Form.Text>
        </Form.Group>
        <Button onClick={handleSubmit} className="w-100">
          {isOnProgress ? <Spinner animation="border" size="sm" /> : "공유하기"}
        </Button>
      </Form>
    </Row>
  );
};

export default NotionDatabaseForm;
