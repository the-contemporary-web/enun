import { Div, PropsOf } from "@flexive/core";
import { DesignProps, themeClassNames } from "design/style";
import { cn } from "design/util/cn";
import { MouseEventHandler } from "react";

type CheckableProps = PropsOf<"div"> &
  DesignProps & {
    checked?: boolean;
    onCheck?: (value: boolean) => void;
    disabled?: boolean;
  };

export const Checkable = ({
  look = "solid",
  theme,
  themes = [],
  checked,
  onCheck,
  disabled,
  onClick,
  className,
  ...props
}: CheckableProps) => {
  const pointable = !(!onCheck && !onClick);
  const handleClick: MouseEventHandler<HTMLDivElement> | undefined = disabled
    ? undefined
    : e => {
        onCheck?.(!checked);
        onClick?.(e);
      };

  return (
    <Div
      className={cn(
        look,
        ...themeClassNames(theme, ...themes),
        "checkable",
        "disablable",
        "trans-soft",
        { pointable, checked, disabled },
        className,
      )}
      onClick={handleClick}
      px={props.p ?? 16}
      py={props.p ?? 8}
      rad={4}
      {...props}
    />
  );
};
