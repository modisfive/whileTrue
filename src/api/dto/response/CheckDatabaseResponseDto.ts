import { IconType } from "../../../common/enums/icon.enum";
import { RESP_STATUS } from "../../../common/enums/response-status.enum";

class CheckDatabaseResponseDto {
  validCheck;
  databaseId;
  databaseIconType;
  databaseIconSrc;
  databaseTitle;

  constructor(
    validCheck: RESP_STATUS,
    databaseId?: string,
    databaseIconType?: IconType | null,
    databaseIconSrc?: string | null,
    databaseTitle?: string
  ) {
    this.validCheck = validCheck;
    this.databaseId = databaseId;
    this.databaseIconType = databaseIconType;
    this.databaseIconSrc = databaseIconSrc;
    this.databaseTitle = databaseTitle;
  }
}

export default CheckDatabaseResponseDto;
