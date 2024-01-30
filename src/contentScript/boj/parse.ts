import { SiteType } from "../../common/enum";
import { createProblemUrl } from "../../common/utils";

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

const parse = async () => {
  try {
    const metaTag = document.querySelector('meta[name="problem-id"]');
    const problemNumber = metaTag.getAttribute("content");
    const title: string = await getBOJTitle(problemNumber);
    return {
      site: SiteType.BOJ,
      number: problemNumber,
      title,
      url: createProblemUrl(SiteType.BOJ, problemNumber),
    };
  } catch (error) {
    return;
  }
};

export default parse;
