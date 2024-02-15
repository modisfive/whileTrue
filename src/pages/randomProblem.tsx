import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Problem } from "../common/class";
import { SiteType } from "../common/constants";
import { getProblemList } from "../common/storage";

chrome.runtime.sendMessage({
  from: "problemPage",
  subject: "checkProblemList",
});

const App: React.FC<{}> = () => {
  const [problem, setProblem] = useState<Problem>({
    site: SiteType.DEFAULT,
    number: "",
    title: "",
    url: "",
  });

  const handleClick = () => {
    chrome.runtime.sendMessage(
      {
        from: "problemPage",
        subject: "selectRandomProblem",
      },
      (selectedProblem) => {
        console.log(selectedProblem);
        setProblem(selectedProblem);
      }
    );
  };

  return (
    <div>
      <h2>랜덤 문제 뽑기</h2>
      {problem.site !== SiteType.DEFAULT && (
        <div>
          <span>{problem.site}</span>
          <span>{problem.number}</span>
          <span>{problem.title}</span>
          <a href={problem.url}>
            <button>바로가기</button>
          </a>
        </div>
      )}
      <button onClick={handleClick}>뽑기</button>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
