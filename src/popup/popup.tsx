import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import TabList from "./tabs/TabList";
import ProblemInsertionTab from "./tabs/ProblemInsertionTab/index";
import RandomSelectionTab from "./tabs/RandomSelectionTab";
import SettingTab from "./tabs/SettingTab";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

const tabs: TabsType = [
  {
    label: "문제 다시풀기 저장",
    index: 1,
    Component: ProblemInsertionTab,
  },
  {
    label: "문제 랜덤으로 뽑기",
    index: 2,
    Component: RandomSelectionTab,
  },
  {
    label: "환경설정",
    index: 3,
    Component: SettingTab,
  },
];

const App: React.FC<{}> = () => {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

  return (
    <div className="App">
      <h1>알고리즘 문제 다시 풀기</h1>
      <br />
      <TabList selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
