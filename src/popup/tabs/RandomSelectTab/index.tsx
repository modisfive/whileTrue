import React, { FC, Fragment, useState } from "react";
import { SiteType } from "../../../common/constants";
import { Problem } from "../../../common/class";

chrome.runtime.sendMessage({
  from: "problemPage",
  subject: "checkProblemList",
});

const RandomSelectTab: FC<{}> = () => {
  const [problem, setProblem] = useState<Problem>({
    siteType: SiteType.DEFAULT,
    number: "",
    title: "",
    url: "",
  });

  const handleClick = () => {
    chrome.runtime.sendMessage(
      { from: "problemPage", subject: "selectRandomProblem" },
      (selectedProblem) => {
        console.log("from", selectedProblem);
        setProblem(selectedProblem);
      }
    );
  };

  return (
    <Fragment>
      <h2>랜덤 문제 뽑기</h2>
      {problem.siteType !== SiteType.DEFAULT && (
        <div>
          <span>{problem.siteType}</span>
          <span>{problem.number}</span>
          <span>{problem.title}</span>
          <a href={problem.url}>
            <button>바로가기</button>
          </a>
        </div>
      )}
      <button onClick={handleClick}>뽑기</button>
    </Fragment>
  );
};

export default RandomSelectTab;
