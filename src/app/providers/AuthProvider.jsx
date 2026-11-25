import { GoogleOAuthProvider } from '@react-oauth/google';

export default function AuthProvider({ children }) {
  // Use configured Google Client ID, or a safe placeholder so hooks like useGoogleLogin
  // don't throw rendering errors when Google OAuth is not configured in local/dev.
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '000000000000-placeholder.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
