import { SiteType } from "../../common/enum";
import { createProblemUrl } from "../../common/utils";

const getBOJTitle = async (number: string) => {
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

const parse = async () => {
  try {
    const metaTag = document.querySelector('meta[name="problem-id"]');
    const problemNumber = metaTag.getAttribute("content");
    const title = await getBOJTitle(problemNumber);
    console.log("final result:", title);
    const problemInfo = {
      site: SiteType.BOJ,
      number: problemNumber,
      // title: document.getElementById("problem_title").textContent,
      title: title,
      url: createProblemUrl(SiteType.BOJ, problemNumber),
    };
    return problemInfo;
  } catch (error) {
    return;
  }
};

export default parse;
