import React, { FC } from "react";
import "../popup.css";
import ProblemInsertionTab from "./ProblemInsertionTab";
import RandomSelectionTab from "./RandomSelectionTab";
import { Tab, Tabs } from "react-bootstrap";

const TabComponent: FC<{}> = () => {
  return (
    <Tabs defaultActiveKey="home" className="mb-3" justify>
      <Tab eventKey="home" title="Home">
        <ProblemInsertionTab />
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <RandomSelectionTab />
      </Tab>
    </Tabs>
  );
};

export default TabComponent;
