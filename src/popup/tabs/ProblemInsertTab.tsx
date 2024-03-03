import React, { FC, useEffect, useState } from "react";
import { ProblemPage } from "../../common/class";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Utils from "../../common/utils";
import { RESP_STATUS } from "../../common/constants";

const ProblemInsertTab: FC<{ problemPage: ProblemPage; setIsError: CallableFunction }> = ({
  problemPage,
  setIsError,
}) => {
  const [saveResult, setSaveResult] = useState(false);
  const [isOnProgress, setIsOnProgress] = useState(true);

  const handleSubmit = () => {
    setIsOnProgress(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "insertProblem", problemPage }, (resp) => {
      setIsOnProgress(false);
      if (resp === RESP_STATUS.FAILED) {
        setIsError(true);
        setSaveResult(false);
      } else {
        setIsError(false);
        setSaveResult(true);
      }
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage(
      { from: "popup", subject: "isProblemSaved", problemPage },
      (resp) => {
        setIsOnProgress(false);
        if (resp === RESP_STATUS.FAILED) {
          setIsError(true);
          setSaveResult(false);
        } else {
          setSaveResult(true);
        }
      }
    );
  }, []);

  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div style={{ height: "50%" }}>
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
