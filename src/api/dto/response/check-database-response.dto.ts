import { IconType } from "../../../common/enums/icon.enum";
import { RESP_STATUS } from "../../../common/enums/response-status.enum";

export interface ICheckDatabaseResponse {
  validCheck: RESP_STATUS;
  databaseId?: string;
  databaseIconType?: IconType | null;
  databaseIconSrc?: string | null;
  databaseTitle?: string;
}

export default class CheckDatabaseResponseDto implements ICheckDatabaseResponse {
  constructor(
    public validCheck: RESP_STATUS,
    public databaseId?: string,
    public databaseIconType?: IconType | null,
    public databaseIconSrc?: string | null,
    public databaseTitle?: string
  ) {}
}
