import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useState, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MyStatusBar from "./myStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutUser } from "../store/slice/authSlice";

const CustomDrawer = (props) => {


  const dispatch = useDispatch();

  const backAction = () => {
    if (Platform.OS === "ios") {
      props.navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      props.navigation.addListener("gestureEnd", backAction);
      return () => {
        props.navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar />
      {header()}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: Colors.whiteColor,
          paddingTop: Sizes.fixPadding * 2.5,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          {drawerOptions()}
          {logoutOption()}
        </View>
      </DrawerContentScrollView>
      {logoutDialog()}
    </View>
  );

  function logoutDialog() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutDialog}
        onRequestClose={() => { setShowLogoutDialog(false) }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setShowLogoutDialog(false) }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
              style={styles.dialogStyle}
            >
              <View style={{ marginVertical: Sizes.fixPadding * 2.5 }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginHorizontal: Sizes.fixPadding + 5.0,
                    ...Fonts.blackColor20SemiBold,
                  }}
                >
                  Sure you want to logout?
                </Text>
                <View style={{ ...styles.cancelAndLogoutButtonWrapStyle }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowLogoutDialog(false);
                    }}
                    style={{
                      ...styles.logoutAndCancelButtonStyle,
                      ...styles.cancelButtonStyle,
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ ...Fonts.primaryColor18Bold }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowLogoutDialog(false);
                      props.navigation.closeDrawer();
                      dispatch(logoutUser());
                      // props.navigation.push("Signin");
                    }}
                    style={{
                      ...styles.logoutAndCancelButtonStyle,
                      backgroundColor: Colors.primaryColor,
                    }}
                  >
                    <Text style={{ ...Fonts.whiteColor18Bold }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function logoutOption() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setShowLogoutDialog(true);
        }}
        style={styles.logoutOptionWrapStyle}
      >
        <View style={{ width: 22.0 }}>
          <MaterialIcons name="logout" size={22} color={Colors.primaryColor} />
        </View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding,
            ...Fonts.primaryColor16SemiBold,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    );
  }

  function drawerOptions() {
    return (
      <View>
        {drawerOptionSort({
          icon: (
            <MaterialIcons
              name="av-timer"
              size={22}
              color={Colors.blackColor}
            />
          ),
          option: "Your Activity",
          onPress: () => {
            props.navigation.closeDrawer();
            props.navigation.push("UserActivity");
          },
        })}
        {drawerOptionSort({
          icon: (
            <MaterialIcons
              name="notifications-none"
              size={22}
              color={Colors.blackColor}
            />
          ),
          option: "Notifications",
          onPress: () => {
            props.navigation.closeDrawer();
            props.navigation.navigate("Notifications");
          },
        })}
        {drawerOptionSort({
          icon: (
            <MaterialIcons
              name="info-outline"
              size={22}
              color={Colors.blackColor}
            />
          ),
          option: "About",
          onPress: () => {
            props.navigation.closeDrawer();
            props.navigation.push("About");
          },
        })}
        {drawerOptionSort({
          icon: (
            <MaterialIcons
              name="help-outline"
              size={22}
              color={Colors.blackColor}
            />
          ),
          option: "Help",
          onPress: () => {
            props.navigation.closeDrawer();
            props.navigation.push("Help");
          },
        })}
      </View>
    );
  }

  function drawerOptionSort({ icon, option, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.drawerOptionWrapStyle}
      >
        <View style={{ width: 22 }}>{icon}</View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <View style={styles.headerStyle}>
        <Text style={{ ...Fonts.blackColor20SemiBold }}>Settings</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  drawerOptionWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.5,
  },
  headerStyle: {
    padding: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    marginBottom: Sizes.fixPadding - 8.0,
    shadowColor: Colors.secondaryColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
  },
  logoutOptionWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Sizes.fixPadding * 1.5,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  cancelAndLogoutButtonWrapStyle: {
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 2.0,
    flexDirection: "row",
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: 0.0,
    width: "85%",
    alignSelf: 'center'
  },
  logoutAndCancelButtonStyle: {
    marginHorizontal: Sizes.fixPadding,
    flex: 1,
    elevation: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    borderBottomWidth: 0.0,
    shadowColor: Colors.secondaryColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
  },
});

export default CustomDrawer;
