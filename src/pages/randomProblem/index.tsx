import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const App: React.FC<{}> = () => {
  const [databaseUrl, setDatabaseUrl] = useState(0);

  const handleSubmit = () => {
    console.log("CLICKED!!!");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={databaseUrl} />
        </label>
        <button type="submit">데이터베이스 저장하기</button>
      </form>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
