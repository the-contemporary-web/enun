import { RichTextContent } from "@entity/RichTextContent";
import { createHook } from "@enun/react";
import { create } from "@enun/store";

import { RichTextContentHelper } from "./helper";

interface RichTextContentStore {
  content: RichTextContent;
  contentLength: number;
  writeContent: (content: RichTextContent) => void;
}

const RichTextContentStore = create<RichTextContentStore, { content?: RichTextContent }>().define(
  ({ set, injected }) => {
    const writeContent = (content: RichTextContent) => {
      set({
        content,
        contentLength: content.length,
      });
    };

    return {
      content: injected.content ?? RichTextContentHelper.getInitialContent(),
      contentLength: injected.content?.length ?? 0,
      writeContent,
    };
  },
);

const useRichTextContentStore = createHook(RichTextContentStore);

export { RichTextContentStore, useRichTextContentStore };
