import { Article, PropsOf } from "@flexive/core";

type FullScreenProps = PropsOf<"article">;

export const FullScreen = ({ ...props }: FullScreenProps) => {
  return <Article sizeM={`100v${props.row ? "w" : "h"}`} sizeC={`100v${props.row ? "h" : "w"}`} {...props} />;
};
