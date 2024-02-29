import React, { FC, useEffect, useState } from "react";
import { Problem } from "../../common/class";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import Utils from "../../common/utils";

const RandomSelectTab: FC<{}> = () => {
  const [problem, setProblem] = useState<Problem>(undefined);
  const [isOnProgress, setIsOnProgress] = useState(false);

  useEffect(() => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "checkProblemList" }, () => {
      setIsOnProgress(false);
    });
  }, []);

  const handleClick1 = () => {
    chrome.runtime.sendMessage({ from: "popup", subject: "openProblemTab", url: problem.url });
  };

  const handleClick2 = () => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage(
      { from: "popup", subject: "selectRandomProblem" },
      (selectedProblem) => {
        setIsOnProgress(false);
        setProblem(selectedProblem);
      }
    );
  };

  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div style={{ height: "50%" }}>
        {isOnProgress ? (
          <div className="h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" />
          </div>
        ) : problem === undefined ? (
          <div className="h-100 d-flex justify-content-center align-items-center">
            <span>문제를 선택해주세요.</span>
          </div>
        ) : (
          <>
            <div>
              <Row className="justify-content-center">
                <Image
                  style={{ width: "auto", height: 70 }}
                  src={Utils.selectLogo(problem.siteType)}
                />
              </Row>
              <Row>
                <span>
                  {problem.number}. {problem.title}
                </span>
              </Row>
            </div>
            <Row className="mt-4">
              <Button variant="primary" onClick={handleClick1}>
                바로가기
              </Button>
            </Row>
          </>
        )}
      </div>
      <Row>
        <Button variant="secondary" onClick={handleClick2}>
          문제 선택하기
        </Button>
      </Row>
    </Container>
  );
};

export default RandomSelectTab;
