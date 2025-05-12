import { Div } from "@flexive/core";
import { PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type CatchProps = PropsWithChildren;

export const Catch = ({ children }: CatchProps) => {
  return (
    <ErrorBoundary fallback={<Div>오류</Div>}>
      <Suspense>{children}</Suspense>
    </ErrorBoundary>
  );
};
