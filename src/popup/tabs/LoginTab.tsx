import React, { FC } from "react";
import { NOTION_AUTH_URL } from "../../common/env";

const LoginTab: FC<{}> = () => {
  return (
    <div>
      <h1>로그인하기</h1>
      <button>
        <a href={NOTION_AUTH_URL}>Notion 로그인</a>
      </button>
    </div>
  );
};

export default LoginTab;
