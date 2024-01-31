import { Problem } from "../common/class";
import { SiteType } from "../common/enum";
import { createProblemUrl } from "../common/utils";

const isSaved = (currProblemNumber: string, savedProblem: undefined | Problem) => {
  if (typeof savedProblem === "undefined") {
    return false;
  } else if (currProblemNumber == savedProblem.number) {
    return true;
  }
  return false;
};

const getBOJTitle = async (number: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        { from: "content", subject: "BOJTitle", param: number },
        (response) => resolve(response)
      );
    } catch (error) {
      reject(error);
    }
  });
};

const parse = async (savedProblem: undefined | Problem) => {
  const problemNumber = document.querySelector('meta[name="problem-id"]').getAttribute("content");

  if (isSaved(problemNumber, savedProblem)) {
    return {
      isChanged: false,
      problem: savedProblem,
    };
  }

  const title = await getBOJTitle(problemNumber);
  const url = createProblemUrl(SiteType.BOJ, problemNumber);
  return {
    isChanged: true,
    problem: new Problem(SiteType.BOJ, problemNumber, title, url),
  };
};

export default parse;
