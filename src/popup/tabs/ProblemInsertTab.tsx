import React, { FC, Fragment, useEffect, useState } from "react";
import { Problem } from "../../common/class";
import { Button, Container, Image, Row } from "react-bootstrap";
import { SiteType } from "../../common/constants";

type CurrentProblemProp = {
  problem: Problem;
};

const selectLogo = (siteType: SiteType) => {
  switch (siteType) {
    case SiteType.BOJ:
      return "/baekjoon_logo.png";
    case SiteType.PROGRAMMERS:
      return "/programmers_logo.png";
  }
};

const handleSubmit = (problem) => {};

const ProblemInsertTab: FC<CurrentProblemProp> = ({ problem }) => {
  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div>
        <Row className="justify-content-center">
          <Image style={{ width: "auto", height: 70 }} src={selectLogo(problem.siteType)} />
        </Row>
        <Row>
          <span>
            {problem.number}. {problem.title}
          </span>
        </Row>
      </div>
      <Row>
        <Button variant="success" onClick={() => handleSubmit(problem)}>
          Save
        </Button>
      </Row>
    </Container>
  );
};

export default ProblemInsertTab;
