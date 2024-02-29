import { Problem } from "../common/class";
import { SiteType } from "../common/constants";
import Utils from "../common/utils";

const parseProblemInformation = () => {
  try {
    const content = document.querySelector(".main > .lesson-content");
    const level = content.getAttribute("data-challenge-level");
    const problemNumber = content.getAttribute("data-lesson-id");
    const problemTitle = content.getAttribute("data-lesson-title").trim();
    return {
      isExist: true,
      level,
      problemNumber,
      problemTitle,
    };
  } catch {
    return {
      isExist: false,
      level: null,
      problemNumber: null,
      problemTitle: null,
    };
  }
};

const programmers = async () => {
  const { isExist, level, problemNumber, problemTitle } = parseProblemInformation();

  if (!isExist) {
    return {
      isExist: false,
      problem: null,
    };
  } else {
    return {
      isExist: true,
      problem: new Problem(
        SiteType.PROGRAMMERS,
        level,
        problemNumber,
        problemTitle,
        Utils.createProblemUrl(SiteType.PROGRAMMERS, problemNumber)
      ),
    };
  }
};

export default programmers;
