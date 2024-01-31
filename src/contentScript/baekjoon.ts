import { Problem } from "../common/class";
import { SiteType } from "../common/enum";
import { createProblemUrl, isProblemSaved } from "../common/utils";

const getBOJTitle = async (problemNumber: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        { from: "content", subject: "BOJTitle", problemNumber },
        (response) => resolve(response)
      );
    } catch (error) {
      reject(error);
    }
  });
};

const parseProblemNumber = () => {
  try {
    const problemNumber = document.querySelector('meta[name="problem-id"]').getAttribute("content");
    return {
      isExist: true,
      problemNumber,
    };
  } catch (error) {
    return {
      isExist: false,
      problemNumber: null,
    };
  }
};

const getBaekjoonProblem = async (savedProblem: undefined | Problem) => {
  const { isExist, problemNumber } = parseProblemNumber();

  if (!isExist) {
    return {
      isExist: false,
      isChanged: null,
      problem: null,
    };
  } else if (isProblemSaved(problemNumber, savedProblem)) {
    return {
      isExist: true,
      isChanged: false,
      problem: savedProblem,
    };
  } else {
    return {
      isExist: true,
      isChanged: true,
      problem: new Problem(
        SiteType.BOJ,
        problemNumber,
        await getBOJTitle(problemNumber),
        createProblemUrl(SiteType.BOJ, problemNumber)
      ),
    };
  }
};

export default getBaekjoonProblem;
