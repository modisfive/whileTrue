import { RESP_STATUS } from "../enums/response-status.enum";

export interface IUserStatus {
  isNotionLinked: boolean;
  respStatus: RESP_STATUS;
}

export class UserStatus implements IUserStatus {
  constructor(public isNotionLinked: boolean, public respStatus: RESP_STATUS) {}
}
