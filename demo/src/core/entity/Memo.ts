import { ID } from "core/constant/ID";

import { Timestamp } from "./_utility";

type Memo = {
  id: ID["MEMO"];
  content: string;
  createdAt: Timestamp;
  modifiedAt?: Timestamp;
};

export type { Memo };
