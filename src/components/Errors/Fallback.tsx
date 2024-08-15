import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: React.ReactNode;
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div>
      <h1>Something went wrong.</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const ErrorBoundaryWrapper: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const handleError = (error: Error) => {
    if (error.message.includes('Expired')) {
      // Handle session expiration: redirect to login
      navigate('/login');
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
