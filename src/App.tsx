import AuthScreen from './screens/AuthScreen';
import ConnectionCheckScreen from './screens/ConnectionCheckScreen';

// Temporary: shows sign-in and the connection check until the app shell (feature/design-system) is merged.
export default function App() {
  return (
    <>
      <AuthScreen />
      <ConnectionCheckScreen />
    </>
  );
}