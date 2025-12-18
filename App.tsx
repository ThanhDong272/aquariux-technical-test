import React, { useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigator from "@navigations/index";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "@store/index";
import { asyncStoragePersister } from "@services/local";
import MainStack from "@navigations/MainStack";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      /**
       *The gc time must equal or higher than the persist query client maxAge
       @default 24 hours
       if you want to set lower pls set also in persist client maxAge
       */
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});

function App(): React.JSX.Element {
  const routeNameRef = useRef<string>(null);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: ({ meta }) => meta?.persist === true,
        },
      }}
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer
              ref={Navigator.getRef()}
              onStateChange={async () => {
                const currentRouteName =
                  Navigator.getRef()?.current?.getCurrentRoute()?.name ?? null;
                // Save the current route name for later comparison
                routeNameRef.current = currentRouteName;
              }}
            >
              <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
              />
              <MainStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </PersistQueryClientProvider>
  );
}

export default App;
