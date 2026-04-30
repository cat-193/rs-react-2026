import { Component, ReactNode } from 'react';
import { ErrorInfo } from 'react-dom/client';
import style from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className={style.errorTitle}>
          May the force be with you with test error! Refresh page 😊
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
