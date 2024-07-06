import React, { FC, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ProblemInsertTab from "./ProblemInsertTab";
import RandomSelectTab from "./RandomSelectTab";
import "../popup.css";
import { ProblemPage } from "../../common/class";

enum TabKey {
  CURRENT_PROBLEM = "currentProblem",
  RANDOM_SELECT = "randomSelect",
}

interface ProblemPageInfo {
  isExist: boolean;
  problemPage: ProblemPage;
}

interface Props {
  setIsError: CallableFunction;
}

const TabList: FC<Props> = ({ setIsError }) => {
  const [key, setKey] = useState<string>(TabKey.CURRENT_PROBLEM);
  const [problemPageInfo, setProblemPageInfo] = useState<ProblemPageInfo>({
    isExist: false,
    problemPage: undefined,
  });

  const parseProblemPageInfo = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { from: "popup", subject: "currentProblem" }, (resp) => {
        if (chrome.runtime.lastError) {
          setProblemPageInfo({ isExist: false, problemPage: undefined });
          setKey(TabKey.RANDOM_SELECT);
        } else {
          setProblemPageInfo({
            isExist: resp.isExist,
            problemPage: resp.isExist ? resp.problemPage : undefined,
          });
          setKey(resp.isExist ? TabKey.CURRENT_PROBLEM : TabKey.RANDOM_SELECT);
        }
      });
    });
  };

  useEffect(() => {
    parseProblemPageInfo();
  }, []);

  const renderProblemInsertTab = () => {
    if (problemPageInfo.isExist)
      return <ProblemInsertTab problemPage={problemPageInfo.problemPage} setIsError={setIsError} />;
  };

  return (
    <Tabs activeKey={key} onSelect={setKey} transition={false} className="mb-3" justify>
      <Tab
        eventKey={TabKey.CURRENT_PROBLEM}
        title="문제 저장하기"
        disabled={!problemPageInfo.isExist}
      >
        {renderProblemInsertTab()}
      </Tab>
      <Tab eventKey={TabKey.RANDOM_SELECT} title="문제 풀기">
        <RandomSelectTab setIsError={setIsError} />
      </Tab>
    </Tabs>
  );
};

export default TabList;
