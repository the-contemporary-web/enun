import { PropsOf } from "@flexive/core";
import { Modal } from "design/component/surface";

type ContainerProps = PropsOf<"article">;

export const Container = ({ ...props }: ContainerProps) => {
  return <Modal {...props} />;
};
