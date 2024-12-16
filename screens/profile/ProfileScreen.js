import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import UserInfo from "../../components/UserInfo";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getUser } from "../../store/slice/userSlice";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUser());
    }, [dispatch])
  );

  const userDetail = user?.data?.user_detail; // Check if userDetail exists or is null

  // console.log("User Detail : ", userDetail);

  // Mock data for user profile
  const [userData, setUserData] = useState({
    phone: "....",
    // bio: "Engineer | Tech Enthusiast",
    bio: "....",
    // motivationalQuote: "Strive for progress, not perfection.",
    motivationalQuote: "....",
    // profilePic: "xyz",
  });

  // Define button text and navigation based on userDetail
  const profileButtonText = userDetail ? "Edit Profile" : "Set Profile";
  const profileButtonAction = () => {
    userDetail
      ? navigation.navigate("EditProfile")
      : navigation.navigate("addUserDetail");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <MaterialIcons name="menu" size={24} color={Colors.blackColor} />
      </TouchableOpacity>

      <ScrollView nestedScrollEnabled={true}>
        {/* User Info */}
        <UserInfo
          firstName={user?.data?.first_name}
          lastName={user?.data?.last_name}
          username={user?.data?.username}
          detail={userDetail?.short_detail}
          img={userDetail?.profile_image_url}
        />

        {/* Horizontal Line */}
        <View style={styles.horizontalLine} />

        {/* Profile Details */}
        <View style={styles.profileDetailContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoText}>{user?.data?.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoText}>{userDetail?.mobile_number}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.infoText}>{userDetail?.short_detail}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Motivational Quote</Text>
            <Text style={styles.infoText}>{userDetail?.long_detail}</Text>
          </View>
        </View>

        {/* Horizontal Line */}
        <View style={styles.horizontalLineThick} />
      </ScrollView>

      {/* Profile Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={profileButtonAction} // Conditional navigation
          style={styles.editProfileBtn}
        >
          {/* Wrap profileButtonText in a <Text> component */}
          <Text style={styles.editProfileBtnText}>{profileButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: 100,
    padding: 10,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: Colors.lightGrayColor,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  horizontalLineThick: {
    height: 2,
    backgroundColor: Colors.lightGrayColor,
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  profileDetailContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoItem: {
    marginBottom: 15,
    paddingBottom: 10,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: width * 0.045, // Dynamic font size based on screen width
    color: Colors.blackColor,
    marginBottom: 5,
  },
  infoText: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
    color: Colors.textColor,
    paddingVertical: 5,
    backgroundColor: Colors.whiteColor,
    borderRadius: 5,
    paddingLeft: 10,
    elevation: 2,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  editProfileBtn: {
     backgroundColor: Colors.buttonColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: width * 0.35, // Dynamic width based on screen width
    justifyContent: "center",
    alignItems: "center",
  },
  editProfileBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.040, 
  },
});
