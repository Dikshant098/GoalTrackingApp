import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { LogBox } from "react-native";
// Redux 
import { Provider } from "react-redux";
import store from "./store/store"; // Ensure you import the store correctly
import NavigationStack from "./Route/NavigationStack";
// End Redux

ExpoSplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

const App = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_Regular: require("./assets/fonts/OpenSans-Regular.ttf"),
    OpenSans_Medium: require("./assets/fonts/OpenSans-Medium.ttf"),
    OpenSans_SemiBold: require("./assets/fonts/OpenSans-SemiBold.ttf"),
    OpenSans_Bold: require("./assets/fonts/OpenSans-Bold.ttf"),
    OpenSans_ExtraBold: require("./assets/fonts/OpenSans-ExtraBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationStack />
    </Provider>
  );
};

export default App;
