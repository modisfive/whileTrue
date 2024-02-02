import React, { FC, useState } from "react";
import "../popup.css";
import ProblemInsertionTab from "./ProblemInsertionTab";
import RandomSelectionTab from "./RandomSelectionTab";
import SettingTab from "./SettingTab";
import TabList from "./TabList";

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

const TabComponent: FC<{}> = () => {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

  return <TabList selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />;
};

export default TabComponent;
