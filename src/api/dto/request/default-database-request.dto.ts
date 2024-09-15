export interface IDefaultDatabaseRequest {
  notionApiKey: string;
  databaseId: string;
}

export default class DefaultDatabaseRequestDto implements IDefaultDatabaseRequest {
  constructor(public notionApiKey: string, public databaseId: string) {}
}
