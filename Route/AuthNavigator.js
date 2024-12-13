import React from "react";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import SplashScreen from "../screens/splash/SplashScreen";
import { StatusBar } from "react-native";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Login User"
          component={LoginScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name="Register User" component={RegisterScreen} />
        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
