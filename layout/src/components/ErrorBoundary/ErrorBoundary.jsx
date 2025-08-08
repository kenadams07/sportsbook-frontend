import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { NotFoundError } from "../Error/errors";
import NotFound from "../Error/NotFound";
import InternalServerError from "../Error/InternalServerError";

function ErrorFallback({ error, resetErrorBoundary, retryApi }) {
  const handleRetry = () => {
    resetErrorBoundary();
    if (retryApi) {
      retryApi();
    }
  };
  if (error instanceof NotFoundError) {
    return <NotFound />;
  } else {
    return <InternalServerError reset={handleRetry} />;
  }
}

const MyErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};

export default MyErrorBoundary;
