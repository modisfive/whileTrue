import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const validateNotionDatabaseUrl = (url: string) => {
  const regExr = /https:\/\/www\.notion\.so\/(.+?)\/(.+?)\?v=(.+)/;
  if (!regExr.test(url)) {
    return false;
  }
  const target = url.match(regExr)[2];
  return target.length == 32;
};

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setDatabaseUrl(e.target.value);
    const url = e.target.value;
    if (!validateNotionDatabaseUrl(url)) {
      setErrorMessage("데이터베이스 URL을 다시 확인해주세요.");
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({
      from: "options",
      subject: "databaseUrl",
      databaseUrl: databaseUrl,
    });
  };

  const handleClick1 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "accessToken",
      todo: "show",
    });
  };

  const handleClick2 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "accessToken",
      todo: "delete",
    });
  };

  const handleClick3 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "notionInfo",
    });
  };

  const handleClick4 = () => {
    chrome.runtime.sendMessage({
      from: "options",
      subject: "allProblems",
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={databaseUrl} onChange={handleChange} />
        </label>
        <span>{errorMessage}</span>
        <button type="submit">데이터베이스 저장하기</button>
      </form>
      <button onClick={handleClick1}>Access Token 출력하기</button>
      <button onClick={handleClick2}>Access Token 삭제하기</button>
      <button onClick={handleClick3}>사용자 정보 가져오기</button>
      <button onClick={handleClick4}>모든 문제 가져오기</button>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
