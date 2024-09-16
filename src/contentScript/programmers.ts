import { IconType } from "../common/enums/icon.enum";
import { SiteType } from "../common/enums/site.enum";
import { ProblemPage } from "../common/models/problem-page.model";

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
  const content = document.querySelector(".main > .lesson-content");
  const category = content.getAttribute("data-challenge-category").trim().toLowerCase();
  const source =
    category !== "database" && category !== "sql" ? SiteType.PROGRAMMERS : SiteType.PROGRAMMERS_SQL;
  const level = content.getAttribute("data-challenge-level");
  const problemNumber = content.getAttribute("data-lesson-id");
  const problemTitle = content.getAttribute("data-lesson-title").trim();

  return {
    source,
    level,
    problemNumber,
    problemTitle,
  };
};

const programmers = async () => {
  try {
    const { source, level, problemNumber, problemTitle } = parseProblemInformation();
    return {
      isExist: true,
      problemPage: new ProblemPage(
        source,
        convertLevelTier(Number(level)),
        problemNumber,
        problemTitle,
        `https://school.programmers.co.kr/learn/courses/30/lessons/${problemNumber}`,
        IconType.EMOJI,
        convertLevelEmoji(Number(level))
      ),
    };
  } catch {
    return {
      isExist: false,
      problemPage: null,
    };
  }
};

export default programmers;
