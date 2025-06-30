import { ErrorBoundary } from 'react-error-boundary';

import './App.css';
import CourseBuilder from './components/modules/CourseBuilder';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-fallback">
      <h2>Something went wrong</h2>
      <pre style={{ color: '#c53030' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CourseBuilder />
      </ErrorBoundary>
    </div>
  );
}

export default App;
