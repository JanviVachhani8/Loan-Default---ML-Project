import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-hard border-2 border-ink space-y-4">
            <div className="w-14 h-14 bg-risk-highBg text-risk-high rounded-2xl border-2 border-ink flex items-center justify-center mx-auto shadow-hard-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-ink">Something went wrong</h2>
            <p className="text-ink-muted text-sm font-medium">
              An unexpected application error occurred. You can reload the page to restart your session.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cobalt hover:bg-cobalt-hover text-white text-sm font-extrabold font-display rounded-2xl border-2 border-ink shadow-hard transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

