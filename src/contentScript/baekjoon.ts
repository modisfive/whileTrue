import { Problem } from "../common/class";
import { SiteType } from "../common/constants";
import Utils from "../common/utils";

const getSolvedAcInfo = async (problemNumber: string) => {
  return await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { from: "content", subject: "solvedAc", problemNumber },
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
  } catch {
    return {
      isExist: false,
      problemNumber: null,
    };
  }
};

const baekjoon = async () => {
  const { isExist, problemNumber } = parseProblemNumber();

  if (!isExist) {
    return {
      isExist: false,
      problem: null,
    };
  } else {
    const solvedAcResp: any = await getSolvedAcInfo(problemNumber);
    return {
      isExist: true,
      problem: new Problem(
        SiteType.BOJ,
        solvedAcResp.level,
        problemNumber,
        solvedAcResp.titleKo,
        Utils.createProblemUrl(SiteType.BOJ, problemNumber)
      ),
    };
  }
};

export default baekjoon;
