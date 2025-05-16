import { Article, PropsOf } from "@flexive/core";
import { cn } from "design/util/cn";

type ModalProps = PropsOf<"article"> & {
  focusable?: boolean;
  focus?: boolean;
  disabled?: boolean;
  zIndex?: number;
};

export const Modal = ({ disabled, focusable, focus, className, zIndex, style, ...props }: ModalProps) => {
  return (
    <Article
      className={cn("floating", { disabled, focusable, disablable: focusable, focus }, className)}
      style={{ ...style, zIndex }}
      {...props}
    />
  );
};
