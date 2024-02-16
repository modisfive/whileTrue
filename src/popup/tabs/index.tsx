import React, { FC } from "react";
import "../popup.css";
import ProblemInsertTab from "./ProblemInsertTab";
import RandomSelectTab from "./RandomSelectTab";
import { Tab, Tabs } from "react-bootstrap";

const TabComponent: FC<{}> = () => {
  return (
    <Tabs defaultActiveKey="currentProblem" className="mb-3" justify>
      <Tab eventKey="currentProblem" title="문제 저장하기">
        <ProblemInsertTab />
      </Tab>
      <Tab eventKey="randomSelect" title="문제 뽑기">
        <RandomSelectTab />
      </Tab>
    </Tabs>
  );
};

export default TabComponent;
