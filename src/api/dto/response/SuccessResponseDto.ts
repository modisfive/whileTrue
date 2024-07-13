import { RESP_STATUS } from "../../../common/constants";

class SuccessResponseDto {
  isSucceed;

  constructor(isSucceed: RESP_STATUS) {
    this.isSucceed = isSucceed;
  }
}

export default SuccessResponseDto;
