import React, { FC } from "react";
import { Problem } from "../../../common/class";
import { Button } from "react-bootstrap";

type CurrentProblemProp = {
  problem: Problem;
};

const submit = (problem: Problem) => {
  alert(JSON.stringify(problem));
};

const CurrentProblem: FC<CurrentProblemProp> = ({ problem }) => {
  return (
    <div>
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
      <Button variant="success" onClick={() => submit(problem)}>
        Save
      </Button>
    </div>
  );
};

export default CurrentProblem;
