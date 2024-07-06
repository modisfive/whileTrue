import React, { FC, useEffect, useState } from "react";
import { ProblemPage } from "../../common/class";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import Utils from "../../common/utils";
import { RESP_STATUS } from "../../common/constants";

interface Props {
  setIsError: CallableFunction;
}

const RandomSelectTab: FC<Props> = ({ setIsError }) => {
  const [problemPage, setProblemPage] = useState<ProblemPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "checkProblemList" }, (resp) => {
      setIsLoading(false);
      setIsError(resp === RESP_STATUS.FAILED);
    });
  }, []);

  const selectRandomProblem = () => {
    setIsLoading(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "selectRandomProblem" }, (resp) => {
      setIsLoading(false);
      setIsError(resp === RESP_STATUS.FAILED);
      if (resp !== RESP_STATUS.FAILED) {
        setProblemPage(resp);
      }
    });
  };

  const handleOpenProblemTab = () => {
    chrome.runtime.sendMessage({ from: "popup", subject: "openProblemTab", url: problemPage.url });
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      );
    }
    if (!problemPage) {
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
          <Button variant="primary" onClick={handleOpenProblemTab}>
            바로가기
          </Button>
        </Row>
      </>
    );
  };

  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div style={{ height: "50%" }}>{renderBody()}</div>
      <Row>
        <Button variant="secondary" onClick={selectRandomProblem}>
          문제 선택하기
        </Button>
      </Row>
    </Container>
  );
};

export default RandomSelectTab;
