import { SiteType } from "../../common/enum";
import { createProblemUrl } from "../../common/utils";

const parse = () => {
  try {
    const metaTag = document.querySelector('meta[name="problem-id"]');
    const problemNumber = metaTag.getAttribute("content");
    const problemInfo = {
      site: SiteType.BOJ,
      number: problemNumber,
      title: document.getElementById("problem_title").textContent,
      url: createProblemUrl(SiteType.BOJ, problemNumber),
    };
    return problemInfo;
  } catch (error) {
    return;
  }
};

export default parse;
