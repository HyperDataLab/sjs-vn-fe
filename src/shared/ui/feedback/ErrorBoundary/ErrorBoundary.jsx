import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorState from '../ErrorState';

/**
 * Enterprise React Error Boundary
 * Catches unhandled JavaScript rendering exceptions in children, logs them,
 * and displays an accessible fallback UI instead of crashing the app into a blank screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error('[ErrorBoundary] Unhandled UI error caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error,
            resetError: this.handleReset,
          });
        }
        return this.props.fallback;
      }

      const isDev = Boolean(import.meta.env?.DEV);

      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <ErrorState
                title="Đã xảy ra sự cố không mong muốn"
                message="Ứng dụng gặp lỗi trong quá trình hiển thị giao diện. Bạn có thể thử tải lại trang hoặc quay về trang chủ."
                retryLabel="Tải lại trang"
                onRetry={this.handleReload}
                className="shadow-sm"
              />

              <div className="d-flex justify-content-center gap-3 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/';
                    }
                  }}
                >
                  Về trang chủ
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                  onClick={this.handleReset}
                >
                  Thử khôi phục
                </button>
              </div>

              {isDev && this.state.error && (
                <div className="mt-4 p-3 rounded bg-light border text-start font-monospace text-xs overflow-auto" style={{ maxHeight: '250px' }}>
                  <p className="fw-bold text-danger mb-1">{this.state.error.toString()}</p>
                  <pre className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                    {this.state.errorInfo?.componentStack || this.state.error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  onReset: PropTypes.func,
};

export default ErrorBoundary;
