import { SiteType } from "../../common/enum";
import { createProblemUrl } from "../../common/utils";

const isSaved = (currProblemNumber: string, savedProblem: any) => {
  if (typeof savedProblem === "undefined") {
    return false;
  } else if (currProblemNumber == savedProblem.number) {
    return true;
  }
  return false;
};

const getBOJTitle = async (number: string): Promise<string> => {
  return new Promise((resolve, reject) =>
    chrome.runtime.sendMessage(
      {
        from: "content",
        subject: "BOJTitle",
        param: number,
      },
      (response) => {
        resolve(response);
      }
    )
  );
};

const parse = async (savedProblem: any) => {
  try {
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
      problem: {
        site: SiteType.BOJ,
        number: problemNumber,
        title,
        url,
      },
    };
  } catch (error) {
    return;
  }
};

export default parse;
