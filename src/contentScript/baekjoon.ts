import { Problem } from "../common/class";
import { SiteType } from "../common/constants";
import { createProblemUrl, isProblemSaved } from "../common/utils";

const getBOJTitle = async (problemNumber: string): Promise<string> => {
  return await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { from: "content", subject: "BOJTitle", problemNumber },
      (response) => resolve(response)
    );
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

const parseBaekjoonProblem = async () => {
  const { isExist, problemNumber } = parseProblemNumber();

  if (!isExist) {
    return {
      isExist: false,
      problem: null,
    };
  } else {
    return {
      isExist: true,
      problem: new Problem(
        SiteType.BOJ,
        problemNumber,
        await getBOJTitle(problemNumber),
        createProblemUrl(SiteType.BOJ, problemNumber)
      ),
    };
  }
};

export default parseBaekjoonProblem;
