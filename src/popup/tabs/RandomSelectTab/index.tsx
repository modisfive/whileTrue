import React, { FC, Fragment, useState } from "react";
import { SiteType } from "../../../common/constants";
import { Problem } from "../../../common/class";
import { Button, Image } from "react-bootstrap";

chrome.runtime.sendMessage({
  from: "problemPage",
  subject: "checkProblemList",
});

const selectLogo = (siteType: SiteType) => {
  switch (siteType) {
    case SiteType.BOJ:
      return "/baekjoon_logo.png";
    case SiteType.PROGRAMMERS:
      return "/programmers_logo.png";
  }
};

const RandomSelectTab: FC<{}> = () => {
  const [problem, setProblem] = useState<Problem>({
    siteType: SiteType.DEFAULT,
    number: "",
    title: "",
    url: "",
  });

  const handleClick1 = () => {
    chrome.runtime.sendMessage({ from: "popup", subject: "openProblemTab", url: problem.url });
  };

  const handleClick2 = () => {
    chrome.runtime.sendMessage(
      { from: "problemPage", subject: "selectRandomProblem" },
      (selectedProblem) => setProblem(selectedProblem)
    );
  };

  return (
    <Fragment>
      {problem.siteType !== SiteType.DEFAULT && (
        <div>
          <div>
            <Image width={300} src={selectLogo(problem.siteType)} />
          </div>
          <div>
            <span>{problem.number}</span>
            <span>{problem.title}</span>
          </div>
          <div>
            <Button variant="primary" onClick={handleClick1}>
              바로가기
            </Button>
          </div>
        </div>
      )}
      <Button variant="secondary" onClick={handleClick2}>
        Select
      </Button>
    </Fragment>
  );
};

export default RandomSelectTab;
