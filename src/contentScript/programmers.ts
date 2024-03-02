import { ProblemPage } from "../common/class";
import { IconType, SiteType } from "../common/constants";

const convertLevelTier = (level: number) => {
  const levels = ["Lv. 0", "Lv. 1", "Lv. 2", "Lv. 3", "Lv. 4", "Lv. 5"];
  if (0 <= level && level < levels.length) {
    return levels[level];
  }
  return "Unrated";
};

const convertLevelEmoji = (level: number) => {
  const emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
  if (0 <= level && level < emojis.length) {
    return emojis[level];
  }
  return "🆕";
};

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
      problemPage: null,
    };
  } else {
    return {
      isExist: true,
      problemPage: new ProblemPage(
        SiteType.PROGRAMMERS,
        convertLevelTier(Number(level)),
        problemNumber,
        problemTitle,
        `https://school.programmers.co.kr/learn/courses/30/lessons/${problemNumber}`,
        IconType.EMOJI,
        convertLevelEmoji(Number(level))
      ),
    };
  }
};

export default programmers;
