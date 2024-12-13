import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../constants/styles";
import { ImageURL } from "../utils/common";

const UserInfo = ({ firstName, lastName, username, img, detail }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Profile Photo */}
        <View style={styles.profilePhotoContainer}>
          {img ? (
            <Image
              source={{ uri: `${ImageURL}${img}` }}
              style={styles.profilePhoto}
            />
          ) : (
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.profilePhoto}
            />
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.fullName}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.username}>@{username}</Text>
          <Text numberOfLines={3} style={styles.bio}>
            {detail}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20, // Padding added to avoid overlap with the status bar
  },
  profilePhotoContainer: {
    marginTop: 20, // Increased margin to ensure space between the profile photo and status bar
    alignItems: "center",
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Colors.buttonColor,
  },
  userInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  username: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  bio: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
    textAlign: "center",
  },
});
