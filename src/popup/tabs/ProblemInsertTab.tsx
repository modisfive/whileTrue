import React, { FC, useEffect, useState } from "react";
import { ProblemPage } from "../../common/class";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Utils from "../../common/utils";
import { RESP_STATUS } from "../../common/constants";

interface Props {
  problemPage: ProblemPage;
  setIsError: CallableFunction;
}

const ProblemInsertTab: FC<Props> = ({ problemPage, setIsError }) => {
  const [saveResult, setSaveResult] = useState<boolean | null>(null);
  const [isOnProgress, setIsOnProgress] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { from: "popup", subject: "isProblemSaved", problemPage },
      (resp) => {
        setIsOnProgress(false);
        if (resp === RESP_STATUS.FAILED) {
          setIsError(true);
          setSaveResult(false);
        } else {
          setSaveResult(resp);
        }
      }
    );
  }, []);

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

  const renderSaveButton = () => {
    if (isOnProgress) return <Spinner animation="border" />;
    if (saveResult) return <FontAwesomeIcon icon={faCircleCheck} size="2x" color="green" />;
    return (
      <Button variant="success" onClick={handleSubmit}>
        저장하기
      </Button>
    );
  };

  return (
    <Container className="h-100 d-flex flex-column justify-content-evenly">
      <div style={{ height: "50%" }}>
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
      <Row className="d-flex justify-content-center align-items-center">{renderSaveButton()}</Row>
    </Container>
  );
};

export default ProblemInsertTab;
