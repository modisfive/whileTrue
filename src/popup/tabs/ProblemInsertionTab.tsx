import React, { FC, Fragment, useEffect, useState } from "react";
import { Problem } from "../../common/class";
import { SiteType } from "../../common/enum";

const parseProblemInfo = (setProblemInfo: CallableFunction) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { from: "popup", subject: "ProblemInfo" }, (resp) => {
      setProblemInfo(resp);
    });
  });
};

const submit = (problem: Problem) => {
  alert(JSON.stringify(problem));
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
      {problemInfo.isExist ? (
        <div>
          <h3>다시풀기에 문제 추가하기</h3>
          <div>
            <div>
              <span id="site">{problemInfo.problem.site}</span>
            </div>
            <div>
              <span id="number">{problemInfo.problem.number}</span>
            </div>
            <div>
              <span id="title">{problemInfo.problem.title}</span>
            </div>
            <div>
              <span id="url">{problemInfo.problem.url}</span>
            </div>
          </div>
          <button id="submit-btn" onClick={() => submit(problemInfo.problem)}>
            저장하기
          </button>
        </div>
      ) : (
        <h1>현재 문제가 없습니다.</h1>
      )}
    </Fragment>
  );
};

export default ProblemInsertionTab;
