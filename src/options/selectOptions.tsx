import React, { FC, useEffect, useState } from "react";
import SwitchComponent from "../components/SwitchComponent";
import LocalStorage from "../common/storage";
import { StorageKey } from "../common/constants";
import { ProblemOptions } from "../common/class";
import { Button } from "react-bootstrap";
import Utils from "../common/utils";

// 공통 상태 관리 훅
const useProblemOptions = () => {
  const [options, setOptions] = useState<ProblemOptions>({
    includeBoj: true,
    includeProgrammers: true,
    includeProgrammersSql: true,
  });

  useEffect(() => {
    LocalStorage.get(StorageKey.PROBLEM_OPTIONS).then((problemOptions: ProblemOptions) => {
      setOptions(problemOptions);
    });
  }, []);

  const toggleOption = (option: keyof ProblemOptions) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const saveOptions = () => {
    LocalStorage.set(StorageKey.PROBLEM_OPTIONS, options);
    Utils.filterProblems();
  };

  return { options, toggleOption, saveOptions };
};

const SelectOptions: FC = () => {
  const { options, toggleOption, saveOptions } = useProblemOptions();

  return (
    <div className="options-content flex-column">
      <SwitchComponent
        id="bojOption"
        label="백준 문제 포함"
        checked={options.includeBoj}
        onChange={() => toggleOption("includeBoj")}
      />
      <SwitchComponent
        id="programmersOption"
        label="프로그래머스 문제 포함"
        checked={options.includeProgrammers}
        onChange={() => toggleOption("includeProgrammers")}
      />
      <SwitchComponent
        id="programmersSqlOption"
        label="프로그래머스 SQL 문제 포함"
        checked={options.includeProgrammersSql}
        onChange={() => toggleOption("includeProgrammersSql")}
      />
      <Button onClick={saveOptions}>Save</Button>
    </div>
  );
};

export default SelectOptions;
