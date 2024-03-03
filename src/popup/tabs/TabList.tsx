import React, { FC, useEffect, useState } from "react";
import "../popup.css";
import ProblemInsertTab from "./ProblemInsertTab";
import RandomSelectTab from "./RandomSelectTab";
import { Tab, Tabs } from "react-bootstrap";

const parseProblemPageInfo = (setProblemPageInfo: CallableFunction, setKey: CallableFunction) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { from: "popup", subject: "currentProblem" }, (resp) => {
      if (chrome.runtime.lastError) {
        setProblemPageInfo({
          isExist: false,
          problemPage: undefined,
        });
        setKey("randomSelect");
      } else {
        setProblemPageInfo(resp);
        setKey(resp.isExist ? "currentProblem" : "randomSelect");
      }
    });
  });
};

const TabList: FC<{ setIsError: CallableFunction }> = ({ setIsError }) => {
  const [key, setKey] = useState("currentProblem");
  const [problemPageInfo, setProblemPageInfo] = useState({
    isExist: false,
    problemPage: undefined,
  });

  useEffect(() => {
    parseProblemPageInfo(setProblemPageInfo, setKey);
  }, []);

  return (
    <Tabs activeKey={key} onSelect={(k) => setKey(k)} transition={false} className="mb-3" justify>
      <Tab eventKey="currentProblem" title="문제 저장하기" disabled={!problemPageInfo.isExist}>
        {problemPageInfo.isExist && (
          <ProblemInsertTab problemPage={problemPageInfo.problemPage} setIsError={setIsError} />
        )}
      </Tab>
      <Tab eventKey="randomSelect" title="문제 풀기">
        <RandomSelectTab setIsError={setIsError} />
      </Tab>
    </Tabs>
  );
};

export default TabList;
