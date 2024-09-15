import { RESP_STATUS } from "../../../common/enums/response-status.enum";
import { IProblemPage } from "../../../common/models/problem-page.model";

export interface IProblemListResponse {
  validCheck: RESP_STATUS;
  problemPageList?: Array<IProblemPage>;
}

export default class ProblemListResponseDto implements IProblemListResponse {
  constructor(public validCheck: RESP_STATUS, public problemPageList?: Array<IProblemPage>) {}
}
