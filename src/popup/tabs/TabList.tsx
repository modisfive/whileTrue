import React, { FC, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ProblemInsertTab from "./ProblemInsertTab";
import RandomSelectTab from "./RandomSelectTab";
import "../popup.css";
import { IProblemPage } from "../../common/models/problem-page.model";

enum TabKey {
  CURRENT_PROBLEM = "currentProblem",
  RANDOM_SELECT = "randomSelect",
}

interface ProblemPageInfo {
  isExist: boolean;
  problemPage: IProblemPage;
}

interface Props {
  setIsError: CallableFunction;
}

const parseProblemPageInfo = (): Promise<ProblemPageInfo> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { from: "popup", subject: "currentProblem" }, (resp) => {
        if (chrome.runtime.lastError) {
          resolve({ isExist: false, problemPage: undefined });
        } else {
          resolve({
            isExist: resp.isExist,
            problemPage: resp.isExist ? resp.problemPage : undefined,
          });
        }
      });
    });
  });
};

const TabList: FC<Props> = ({ setIsError }) => {
  const [key, setKey] = useState<string>(TabKey.CURRENT_PROBLEM);
  const [problemPageInfo, setProblemPageInfo] = useState<ProblemPageInfo>({
    isExist: false,
    problemPage: undefined,
  });

  useEffect(() => {
    parseProblemPageInfo().then((info) => {
      setProblemPageInfo(info);
      setKey(info.isExist ? TabKey.CURRENT_PROBLEM : TabKey.RANDOM_SELECT);
    });
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
