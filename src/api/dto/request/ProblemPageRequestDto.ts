import { ProblemPage } from "../../../common/class";

export default class ProblemPageRequestDto {
  notionApiKey: string;
  databaseId: string;
  problemPage: ProblemPage;

  constructor(notionApiKey: string, databaseId: string, problemPage: ProblemPage) {
    this.notionApiKey = notionApiKey;
    this.databaseId = databaseId;
    this.problemPage = problemPage;
  }
}
