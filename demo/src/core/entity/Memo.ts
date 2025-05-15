import { ID } from "../constant/ID";
import { Timestamp } from "./_utility";
import { RichTextContent } from "./RichTextContent";

type Memo = {
  readonly id: ID["MEMO"];
  readonly createdAt: Timestamp;
  content: RichTextContent;
  modifiedAt?: Timestamp;
};

export type { Memo };
