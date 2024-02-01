import React, { FC } from "react";
import { Problem } from "../../../common/class";

type CurrentProblemProp = {
  problem: Problem;
};

const submit = (problem: Problem) => {
  alert(JSON.stringify(problem));
};

const CurrentProblem: FC<CurrentProblemProp> = ({ problem }) => {
  return (
    <div>
      <h3>다시풀기에 문제 추가하기</h3>
      <div>
        <div>
          <span id="site">{problem.site}</span>
        </div>
        <div>
          <span id="number">{problem.number}</span>
        </div>
        <div>
          <span id="title">{problem.title}</span>
        </div>
        <div>
          <span id="url">{problem.url}</span>
        </div>
      </div>
      <button id="submit-btn" onClick={() => submit(problem)}>
        저장하기
      </button>
    </div>
  );
};

export default CurrentProblem;
