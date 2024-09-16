import { IProblemPage } from "../../../common/models/problem-page.model";

export interface IProblemPageRequest {
  notionApiKey: string;
  databaseId: string;
  problemPage: IProblemPage;
}

export default class ProblemPageRequestDto implements IProblemPageRequest {
  constructor(
    public notionApiKey: string,
    public databaseId: string,
    public problemPage: IProblemPage
  ) {}
}
