import { RESP_STATUS } from "../../../common/enums/response-status.enum";

export interface ISuccessResponse {
  isSucceed: RESP_STATUS;
}

export default class SuccessResponseDto implements ISuccessResponse {
  constructor(public isSucceed: RESP_STATUS) {}
}
