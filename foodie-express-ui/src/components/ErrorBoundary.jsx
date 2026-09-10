import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Something went wrong!</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            We're sorry for the inconvenience. Our kitchen is working to fix this issue.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
