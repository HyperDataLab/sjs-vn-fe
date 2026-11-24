import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from '../../src/shared/ui/feedback/ErrorBoundary/ErrorBoundary';

describe('React ErrorBoundary State & Lifecycle Suite', () => {
  it('instantiates with hasError: false and null error', () => {
    const boundary = new ErrorBoundary({});
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
    expect(boundary.state.errorInfo).toBeNull();
  });

  it('getDerivedStateFromError transitions state to hasError: true', () => {
    const sampleError = new Error('Simulated UI render crash');
    const newState = ErrorBoundary.getDerivedStateFromError(sampleError);
    expect(newState.hasError).toBe(true);
    expect(newState.error).toBe(sampleError);
  });

  it('handleReset resets error state and calls onReset prop if provided', () => {
    const onResetMock = vi.fn();
    const boundary = new ErrorBoundary({ onReset: onResetMock });
    boundary.state = {
      hasError: true,
      error: new Error('Crash'),
      errorInfo: { componentStack: 'at Component' },
    };
    boundary.setState = vi.fn((updater) => {
      boundary.state = { ...boundary.state, ...updater };
    });

    boundary.handleReset();

    expect(boundary.setState).toHaveBeenCalledWith({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
    expect(boundary.state.errorInfo).toBeNull();
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });

  it('componentDidCatch updates errorInfo and notifies onError callback', () => {
    const onErrorMock = vi.fn();
    const boundary = new ErrorBoundary({ onError: onErrorMock });
    const sampleError = new Error('Test error');
    const sampleInfo = { componentStack: 'at App' };
    boundary.setState = vi.fn((updater) => {
      boundary.state = { ...boundary.state, ...updater };
    });

    boundary.componentDidCatch(sampleError, sampleInfo);

    expect(boundary.setState).toHaveBeenCalledWith({ errorInfo: sampleInfo });
    expect(boundary.state.errorInfo).toEqual(sampleInfo);
    expect(onErrorMock).toHaveBeenCalledWith(sampleError, sampleInfo);
  });
});
