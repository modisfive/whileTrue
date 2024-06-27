import React, { FC, useEffect, useState } from "react";
import { ProblemPage } from "../../common/class";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import Utils from "../../common/utils";
import { RESP_STATUS } from "../../common/constants";

const RandomSelectTab: FC<{ setIsError: CallableFunction }> = ({ setIsError }) => {
  const [problemPage, setProblemPage] = useState<ProblemPage>(undefined);
  const [isOnProgress, setIsOnProgress] = useState(false);

  useEffect(() => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "checkProblemList" }, (resp) => {
      setIsOnProgress(false);
      setIsError(false);
      if (resp === RESP_STATUS.FAILED) {
        setIsError(true);
      }
    });
  }, []);

  const handleClick1 = () => {
    chrome.runtime.sendMessage({ from: "popup", subject: "openProblemTab", url: problemPage.url });
  };

  const handleClick2 = () => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "selectRandomProblem" }, (resp) => {
      setIsOnProgress(false);
      if (resp == RESP_STATUS.FAILED) {
        setIsError(true);
      } else {
        setIsError(false);
        setProblemPage(resp);
      }
    });
  };

  const body = () => {
    if (isOnProgress) {
      return (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      );
    }
    if (problemPage === undefined) {
      return (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <span>문제를 선택해주세요.</span>
        </div>
      );
    }
    return (
      <>
        <div>
          <Row className="justify-content-center">
            <Image
              style={{ width: "auto", height: 70 }}
              src={Utils.selectLogo(problemPage.siteType)}
            />
          </Row>
          <Row>
            <span>
              {problemPage.number}. {problemPage.title}
            </span>
          </Row>
        </div>
        <Row className="mt-4">
          <Button variant="primary" onClick={handleClick1}>
            바로가기
          </Button>
        </Row>
      </>
    );
  };

  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div style={{ height: "50%" }}>{body()}</div>
      <Row>
        <Button variant="secondary" onClick={handleClick2}>
          문제 선택하기
        </Button>
      </Row>
    </Container>
  );
};

export default RandomSelectTab;
