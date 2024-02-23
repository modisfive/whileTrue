import React, { FC, Fragment, useEffect, useState } from "react";
import { Problem } from "../../common/class";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import { SiteType } from "../../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

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

const ProblemInsertTab: FC<CurrentProblemProp> = ({ problem }) => {
  const [saveResult, setSaveResult] = useState(false);
  const [isOnProgress, setIsOnProgress] = useState(true);

  const handleSubmit = () => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "insertProblem", problem }, (resp) => {
      setIsOnProgress(false);
      setSaveResult(resp);
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ from: "popup", subject: "isProblemSaved", problem }, (resp) => {
      setIsOnProgress(false);
      setSaveResult(resp);
    });
  }, []);

  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div style={{ height: "50%" }}>
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
      </div>
      <Row>
        {isOnProgress ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" />
          </div>
        ) : saveResult ? (
          <div className="d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faCircleCheck} size="2xl" color="green" />
          </div>
        ) : (
          <Button variant="success" onClick={handleSubmit}>
            저장하기
          </Button>
        )}
      </Row>
    </Container>
  );
};

export default ProblemInsertTab;
