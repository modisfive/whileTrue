import React, { FC, useState } from "react";
import SwitchComponent from "../components/SwitchComponent";

const AlgorithmOptions = () => {
  const [includeAlgorithm, setIncludeAlgorithm] = useState(true);
  const [includeBoj, setIncludeBoj] = useState(true);
  const [includeProgrammers, setIncludeProgrammers] = useState(true);

  const handleAllOptions = () => {
    const flag = !includeAlgorithm;
    setIncludeAlgorithm(flag);
    setIncludeBoj(flag);
    setIncludeProgrammers(flag);
  };

  const handleBojOption = () => {
    const flag = !includeBoj;
    setIncludeBoj(flag);
    if (!includeAlgorithm) {
      setIncludeAlgorithm(true);
    }
  };

  const handleProgrammersOption = () => {
    const flag = !includeProgrammers;
    setIncludeProgrammers(flag);
    if (!includeAlgorithm) {
      setIncludeAlgorithm(true);
    }
  };

  return (
    <>
      <SwitchComponent
        id="algorithmOption"
        label="알고리즘 문제 포함"
        checked={includeAlgorithm}
        onChange={handleAllOptions}
      />
      <div className="ms-5">
        <SwitchComponent
          id="bojOption"
          label="백준 문제 포함"
          checked={includeBoj}
          onChange={handleBojOption}
        />
        <SwitchComponent
          id="programmersOption"
          label="프로그래머스 문제 포함"
          checked={includeProgrammers}
          onChange={handleProgrammersOption}
        />
      </div>
    </>
  );
};

const SqlOptions = () => {
  const [includeSql, setIncludeSql] = useState(true);
  const [includeProgrammersSql, setIncludeProgrammersSql] = useState(true);

  const handleAllOptions = () => {
    const flag = !includeSql;
    setIncludeSql(flag);
    setIncludeProgrammersSql(flag);
  };

  const handleIncludeProgrammersSql = () => {
    const flag = !includeProgrammersSql;
    setIncludeProgrammersSql(flag);
    if (!includeSql) {
      setIncludeSql(true);
    }
  };

  return (
    <>
      <SwitchComponent
        id="sqlOption"
        label="SQL 문제 포함"
        checked={includeSql}
        onChange={handleAllOptions}
      />
      <div className="ms-5">
        <SwitchComponent
          id="programmersSqlOption"
          label="프로그래머스 SQL 문제 포함"
          checked={includeProgrammersSql}
          onChange={handleIncludeProgrammersSql}
        />
      </div>
    </>
  );
};

const SelectOptions: FC = () => {
  return (
    <div className="options-content flex-column">
      <AlgorithmOptions />
      <SqlOptions />
    </div>
  );
};

export default SelectOptions;
