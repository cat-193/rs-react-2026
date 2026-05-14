import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import ErrorBoundary from '../../../components/errorBoundary/errorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const NoError = () => <div>No error occurred</div>;

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error occurred')).toBeInTheDocument();
  });

  it('should catch errors and display error message', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(/May the force be with you with test error! Refresh page/i)
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should render error UI with correct styling', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorElement = screen.getByRole('heading', { level: 1 });
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(/May the force be with you with test error/i);

    consoleErrorSpy.mockRestore();
  });

  it('should handle multiple children without errors', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should catch error from nested components', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const NestedComponent = () => (
      <div>
        <div>
          <ThrowError />
        </div>
      </div>
    );

    render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(/May the force be with you with test error! Refresh page/i)
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
