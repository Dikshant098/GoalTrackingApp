import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { LogBox } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabBarScreen from "../components/bottomTabBarScreen";
import { screenWidth } from "../constants/styles";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/home/HomeScreen";
import CustomDrawer from "../components/customDrawerScreen";
import EditProfileScreen from "../screens/editProfile/EditProfileScreen";
import AddUserDetailScreen from "../screens/user/AddUserDetailScreen";
import TrackYourGoalScreen from "../screens/trackGoals/TrackYourGoalScreen";
import ViewProgressScreen from "../screens/viewProgress/ViewProgressScreen";
import MyAchivementsScreen from "../screens/achivements/MyAchivementsScreen";
import GoalCheckScreen from "../screens/goals/GoalCheckScreen";
import AllGoalsScreen from "../screens/goals/AllGoalsScreen";
import HistoryScreen from "../screens/history/HistoryScreen";
ExpoSplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      useLegacyImplementation={false}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerStyle: { width: screenWidth - 90.0 },
        drawerType: "front",
        swipeEnabled: false,
        ...TransitionPresets.DefaultTransition,
      }}
    >
      <Drawer.Screen name="DrawerMain" component={BottomTabBarScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
        }}
        >
            <Stack.Screen name="BottomTabBar" component={DrawerNavigation} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="addUserDetail" component={AddUserDetailScreen} />
            <Stack.Screen name="trackYourGoal" component={TrackYourGoalScreen} />
            <Stack.Screen name="viewYourProgress" component={ViewProgressScreen} />
            <Stack.Screen name="goalHistory" component={HistoryScreen} />
            <Stack.Screen name="myAchivements" component={MyAchivementsScreen} />
            <Stack.Screen name="goalCheck" component={GoalCheckScreen} />
            <Stack.Screen name="AllGoals" component={AllGoalsScreen} />
        </Stack.Navigator>
      );
}

export default AppNavigator;