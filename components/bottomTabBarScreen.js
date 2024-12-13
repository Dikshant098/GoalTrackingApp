import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Text,
  Image,
  Platform,
} from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import { useFocusEffect } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, Octicons,SimpleLineIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/home/HomeScreen";
import MyStatusBar from "./myStatusBar";
import GoalsScreen from "../screens/goals/GoalsScreen";
import StatisticsScreen from "../screens/statistics/StatisticsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabBarScreen = ({ navigation }) => {
  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setbackClickCount(1);
    setTimeout(() => {
      setbackClickCount(0)
    }, 1000);
  }

  const [backClickCount, setbackClickCount] = useState(0)

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.blackColor,
          tabBarInactiveTintColor: Colors.lightGrayColor,
          tabBarActiveBackgroundColor:Colors.whiteColor,
          tabBarInactiveBackgroundColor:Colors.whiteColor,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: true,
          tabBarItemStyle: {
            height: 60.0,
            padding:10,
            alignSelf: "flex-start",
          },
          tabBarStyle: styles.bottomTabBarStyle,
        }}
        initialRouteName="Home"
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              // <Image
              //   source={require("../assets/images/icons/home.png")}
              //   style={{
              //     ...styles.iconStyle,
              //     tintColor: color,
              //   }}
              // />

              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Goals"
          component={GoalsScreen}
          options={{
            tabBarLabel:"Goals",
            tabBarIcon: ({ color, size }) => (
              <SimpleLineIcons name="badge" size={size} color={color} />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Post"
          component={PostScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? null : (
                // <View style={styles.uploadIconWrapStyle}>
                  <LinearGradient
                    colors={[Colors.primaryColor, Colors.secondaryColor]} // Example gradient colors
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.uploadIconWrapStyle}
                  >
                    <MaterialIcons
                      name="add"
                      size={30}
                      color={Colors.whiteColor}
                    />
                  </LinearGradient>
                // </View>
              ),
            tabBarStyle: { display: "none" },
          }}
        /> */}
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Octicons name="graph" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </View>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14SemiBold }}>
          Press Back Once Again to Exit
        </Text>
      </View>
    ) : null;
  }
};

export default BottomTabBarScreen;

const styles = StyleSheet.create({
  bottomTabBarStyle: {
    backgroundColor: Colors.whiteColor,
    height: 60.0,
    shadowColor: Colors.blackColor,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderTopColor: Colors.whiteColor,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
  },
  iconStyle: {
    width: 24.0,
    height: 24.0,
    resizeMode: "contain",
  },
  exitInfoWrapStyle: {
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  uploadIconWrapStyle: {
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    borderColor: Colors.whiteColor,
    borderWidth: 4.0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3.0,
    bottom: 25.0,
    backgroundColor: Colors.primaryColor,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
