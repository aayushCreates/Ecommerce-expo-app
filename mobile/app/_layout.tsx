import { ClerkProvider, useAuth } from "@clerk/expo";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://208c518d028881e9b7c91d2135ed7496@o4511041039040512.ingest.de.sentry.io/4511041044480080',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

/// Global error handler
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any, query: any)=> {
      Sentry.captureException(err, {
        tags: {
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "unknown"
        },
        extra: {
          errorMessage: err.message,
          statusCode: err.response?.status,
          queryKey: query.queryKey
        }
      })
  }}),
  mutationCache: new MutationCache({
    onError: (err: any, query: any)=> {
      Sentry.captureException(err, {
        tags: {
          type: "react-query-error"
        },
        extra: {
          errorMessage: err.message,
          statusCode: err.response?.status,
        }
      })
  }})
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </ClerkProvider>
  );
});
