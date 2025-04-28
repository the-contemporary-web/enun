import { Button as FlexiveButton, PropsOf } from "@flexive/core";
import { DesignProps, themeClassNames } from "design/style";
import { cn } from "design/util/cn";

type ClickableProps = PropsOf<"button"> & DesignProps;

export const Clickable = ({ look = "solid", theme, themes = [], className, ...props }: ClickableProps) => {
  return (
    <FlexiveButton
      className={cn(look, ...themeClassNames(theme, ...themes), "pointable", "disablable", "trans-soft", className)}
      px={props.p ?? 16}
      py={props.p ?? 8}
      rad={4}
      {...props}
    />
  );
};
