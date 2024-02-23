import { Problem } from "../common/class";
import { SiteType } from "../common/constants";
import Utils from "../common/utils";

const getBojTitle = async (problemNumber: string): Promise<string> => {
  return await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { from: "content", subject: "bojTitle", problemNumber },
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
        await getBojTitle(problemNumber),
        Utils.createProblemUrl(SiteType.BOJ, problemNumber)
      ),
    };
  }
};

export default parseBaekjoonProblem;
