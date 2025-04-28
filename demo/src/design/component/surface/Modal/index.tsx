import { Article, PropsOf } from "@flexive/core";
import { cn } from "design/util/cn";

type ModalProps = PropsOf<"article"> & {
  focusable?: boolean;
  focus?: boolean;
  disabled?: boolean;
  zIndex?: number;
};

export const Modal = ({ disabled, focusable, focus, className, zIndex, ...props }: ModalProps) => {
  return (
    <Article
      className={cn("floating", { disabled, focusable, disablable: focusable, focus }, "trans-soft", className)}
      style={{ zIndex }}
      {...props}
    />
  );
};
