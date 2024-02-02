import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import TabComponent from "./tabs";
import LoginTab from "./tabs/LoginTab";

const App: React.FC<{}> = () => {
  const [isLogined, setIsLogined] = useState<boolean>(false);

  return (
    <div className="App">
      <h1>알고리즘 문제 다시 풀기</h1>
      <br />
      {isLogined ? <TabComponent /> : <LoginTab />}
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
