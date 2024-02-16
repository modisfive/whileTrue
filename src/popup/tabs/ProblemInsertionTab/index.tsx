import React, { FC, Fragment, useEffect, useState } from "react";
import { Problem } from "../../../common/class";
import { SiteType } from "../../../common/constants";
import CurrentProblem from "./CurrentProblem";
import ProblemNotFound from "./ProblemNotFound";

const parseProblemInfo = (setProblemInfo: CallableFunction) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { from: "popup", subject: "currentProblem" }, (resp) => {
      setProblemInfo(resp);
    });
  });
};

const ProblemInsertionTab: FC<{}> = () => {
  const [problemInfo, setProblemInfo] = useState<{ isExist: boolean; problem: Problem }>({
    isExist: false,
    problem: {
      site: SiteType.DEFAULT,
      number: "DEFAULT_NUMBER",
      title: "DEFAULT_TITLE",
      url: "DEFAULT_URL",
    },
  });

  useEffect(() => {
    parseProblemInfo(setProblemInfo);
  }, []);

  return (
    <Fragment>
      {problemInfo.isExist ? <CurrentProblem problem={problemInfo.problem} /> : <ProblemNotFound />}
    </Fragment>
  );
};

export default ProblemInsertionTab;
