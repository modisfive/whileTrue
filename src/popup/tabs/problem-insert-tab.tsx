import React, { FC, useEffect, useState } from "react";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Utils from "../../common/utils";
import { RESP_STATUS } from "../../common/enums/response-status.enum";
import { IProblemPage } from "../../common/models/problem-page.model";

interface Props {
  problemPage: IProblemPage;
  setIsError: CallableFunction;
}

const ProblemInsertTab: FC<Props> = ({ problemPage, setIsError }) => {
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { from: "popup", subject: "isProblemSaved", problemPage },
      (resp) => {
        setIsLoading(false);
        if (resp === RESP_STATUS.FAILED) {
          setIsError(true);
          setIsSaved(false);
        } else {
          setIsSaved(resp);
        }
      }
    );
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    chrome.runtime.sendMessage({ from: "popup", subject: "insertProblem", problemPage }, (resp) => {
      setIsLoading(false);
      if (resp === RESP_STATUS.FAILED) {
        setIsError(true);
        setIsSaved(false);
      } else {
        setIsError(false);
        setIsSaved(true);
      }
    });
  };

  const renderSaveButton = () => {
    if (isLoading) return <Spinner animation="border" />;
    if (isSaved) return <FontAwesomeIcon icon={faCircleCheck} size="2x" color="green" />;
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
