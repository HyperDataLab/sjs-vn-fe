/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: App.jsx
 */
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/router';
import { AppToast, ErrorBoundary } from './shared/ui';
import { initializeSsoSession } from './features/auth/services/ssoSession';
import BookmarkSessionSync from './features/bookmark/components/BookmarkSessionSync';

function App() {
  useEffect(() => {
    initializeSsoSession().catch((error) => {
      console.error('Unable to initialize the authentication session', error);
    });
  }, []);

  return (
    <ErrorBoundary>
      <AppToast />
      <BookmarkSessionSync />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
