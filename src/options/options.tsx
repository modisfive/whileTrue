import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState("");

  const handleChange = (e) => {
    setDatabaseUrl(e.target.value);
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
      todo: "show",
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={databaseUrl} onChange={handleChange} />
        </label>
        <button type="submit">데이터베이스 저장하기</button>
      </form>
      <button onClick={handleClick1}>Access Token 출력하기</button>
      <button onClick={handleClick2}>Access Token 삭제하기</button>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
