import React, { FC, useEffect, useState } from "react";
import "../popup.css";
import ProblemInsertTab from "./ProblemInsertTab";
import RandomSelectTab from "./RandomSelectTab";
import { Tab, Tabs } from "react-bootstrap";
import { Problem } from "../../common/class";
import { SiteType } from "../../common/constants";

const parseProblemInfo = (setProblemInfo: CallableFunction, setKey: CallableFunction) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { from: "popup", subject: "currentProblem" }, (resp) => {
      setProblemInfo(resp);
      setKey(resp.isExist ? "currentProblem" : "randomSelect");
    });
  });
};

const TabList: FC<{}> = () => {
  const [key, setKey] = useState("currentProblem");
  const [problemInfo, setProblemInfo] = useState<{ isExist: boolean; problem: Problem }>({
    isExist: false,
    problem: {
      siteType: SiteType.DEFAULT,
      number: "DEFAULT_NUMBER",
      title: "DEFAULT_TITLE",
      url: "DEFAULT_URL",
    },
  });

  useEffect(() => {
    parseProblemInfo(setProblemInfo, setKey);
  }, []);

  return (
    <Tabs activeKey={key} onSelect={(k) => setKey(k)} transition={false} className="mb-3" justify>
      <Tab eventKey="currentProblem" title="문제 저장하기" disabled={!problemInfo.isExist}>
        {problemInfo.isExist && <ProblemInsertTab problem={problemInfo.problem} />}
      </Tab>
      <Tab eventKey="randomSelect" title="문제 뽑기">
        <RandomSelectTab />
      </Tab>
    </Tabs>
  );
};

export default TabList;
