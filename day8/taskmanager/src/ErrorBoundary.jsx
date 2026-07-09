import React from 'react';
import { Result, Button } from 'antd';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went completely wrong."
          subTitle="An unexpected application render error occurred."
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}