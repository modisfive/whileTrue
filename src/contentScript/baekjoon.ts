import { ProblemPage } from "../common/class";
import { IconType, SiteType } from "../common/constants";

const getSolvedAcInfo = async (problemNumber: string) => {
  return await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { from: "content", subject: "solvedAc", problemNumber },
      (response) => resolve(response)
    );
  });
};

const convertLevelTier = (level: number) => {
  const levels = [
    "Unrated",
    "Bronze 5",
    "Bronze 4",
    "Bronze 3",
    "Bronze 2",
    "Bronze 1",
    "Silver 5",
    "Silver 4",
    "Silver 3",
    "Silver 2",
    "Silver 1",
    "Gold 5",
    "Gold 4",
    "Gold 3",
    "Gold 2",
    "Gold 1",
    "Platinum 5",
    "Platinum 4",
    "Platinum 3",
    "Platinum 2",
    "Platinum 1",
    "Diamond 5",
    "Diamond 4",
    "Diamond 3",
    "Diamond 2",
    "Diamond 1",
    "Ruby 5",
    "Ruby 4",
    "Ruby 3",
    "Ruby 2",
    "Ruby 1",
  ];
  if (0 <= level && level < levels.length) {
    return levels[level];
  }
  return "Unrated";
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
      problemPage: null,
    };
  } else {
    const solvedAcResp: any = await getSolvedAcInfo(problemNumber);
    return {
      isExist: true,
      problemPage: new ProblemPage(
        SiteType.BOJ,
        convertLevelTier(Number(solvedAcResp.level)),
        problemNumber,
        solvedAcResp.titleKo,
        `https://www.acmicpc.net/problem/${problemNumber}`,
        IconType.EXTERNAL,
        `https://d2gd6pc034wcta.cloudfront.net/tier/${solvedAcResp.level}.svg`
      ),
    };
  }
};

export default baekjoon;
