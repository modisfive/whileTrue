import React, { FC, Fragment, useEffect, useState } from "react";
import { Problem } from "../../../common/class";
import { Button } from "react-bootstrap";

type CurrentProblemProp = {
  problem: Problem;
};

const handleSubmit = (problem) => {};

const ProblemInsertTab: FC<CurrentProblemProp> = ({ problem }) => {
  return (
    <Fragment>
      <div>
        <div>
          <span id="siteType">{problem.siteType}</span>
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
      <Button variant="success" onClick={() => handleSubmit(problem)}>
        Save
      </Button>
    </Fragment>
  );
};

export default ProblemInsertTab;
