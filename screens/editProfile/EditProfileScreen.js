import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { ImageURL } from "../../utils/common";
import { updateUser } from "../../store/slice/userSlice";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState(user?.data?.first_name || "");
  const [lastName, setLastName] = useState(user?.data?.last_name || "");
  const [username, setUsername] = useState(user?.data?.username || "");
  const [gender, setGender] = useState(user?.data?.gender || "");
  const [email, setEmail] = useState(user?.data?.email || "");
  const [bio, setBio] = useState(user?.data?.user_detail?.short_detail || "");
  const [motivationalQuote, setMotivationalQuote] = useState(
    user?.data?.user_detail?.long_detail || ""
  );
  const [phone, setPhone] = useState(
    user?.data?.user_detail?.mobile_number || ""
  );
  const [profilePic, setProfilePic] = useState(
    user?.data?.user_detail?.profile_image_url
      ? `${ImageURL}${user.data.user_detail.profile_image_url}`
      : "https://via.placeholder.com/100"
  );

  // State to track keyboard visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Request permission for image picker
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permissions to make this work!");
      }
    })();
  }, []);

  // Handle input changes for user data
  const handleInputChange = (key, value) => {
    switch (key) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "bio":
        setBio(value);
        break;
      case "motivationalQuote":
        setMotivationalQuote(value);
        break;
      case "phone":
        setPhone(value);
        break;
      default:
        break;
    }
  };

  // Handle remove profile picture
  const handleRemoveProfilePic = () => {
    setProfilePic("https://via.placeholder.com/100");
  };

  // Handle profile picture change
  const handleProfilePicChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  // Save changes and show confirmation
  const handleSaveChanges = async () => {
    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("username", username);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("short_detail", bio);
    formData.append("long_detail", motivationalQuote);
    formData.append("mobile_number", phone);

    if (profilePic) {
      formData.append("profile_pic", {
        uri: profilePic,
        type: "image/jpeg",
        name: "profilePic.jpg",
      });
    }

    try {
      // console.log("Form Data Start : ");
      await dispatch(updateUser(formData)); // Ensure the request resolves before navigating back
      // console.log("Form Data End : ");
      Alert.alert("Profile Updated", "Your profile details have been saved.");
      navigation.goBack();
    } catch (error) {
      // console.log("Error : ", error.message);
      Alert.alert(
        "Error",
        "An error occurred while updating your profile.",
        error
      );
    }

    // Alert.alert("Profile Updated", "Your profile details have been saved.");
    // navigation.goBack();
  };

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialIcons name="arrow-back" size={24} color={Colors.blackColor} />
      </TouchableOpacity>

      {/* ScrollView to ensure content stays above the button */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Picture */}
        <View style={styles.profilePicContainer}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          <View style={styles.photoButtonContainer}>
            <TouchableOpacity
              onPress={handleProfilePicChange}
              style={styles.changePicButton}
            >
              <Text style={styles.changePicText}>Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRemoveProfilePic}
              style={styles.changePicButton}
            >
              <Text style={styles.changePicText}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Edit Profile Form */}
        <View style={styles.editFormContainer}>
          {/* Name Fields */}
          <View style={styles.nameContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
                onFocus={() => setKeyboardVisible(true)}
                onBlur={() => setKeyboardVisible(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
                onFocus={() => setKeyboardVisible(true)}
                onBlur={() => setKeyboardVisible(false)}
              />
            </View>
          </View>

          {/* Username and Gender Fields */}
          <View style={styles.nameContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={(text) => handleInputChange("username", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) =>
                    handleInputChange("gender", itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => handleInputChange("email", text)}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={styles.textInput}
              value={bio}
              multiline={true}
              onChangeText={(text) => handleInputChange("bio", text)}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>

          {/* Motivational Quote */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Motivational Quote</Text>
            <TextInput
              style={styles.textInput}
              value={motivationalQuote}
              multiline={true}
              onChangeText={(text) =>
                handleInputChange("motivationalQuote", text)
              }
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={(text) => handleInputChange("phone", text)}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>
        </View>

        {/* Save Changes Button inside ScrollView */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={!loading ? handleSaveChanges : null} // Prevent multiple presses while loading
            style={styles.saveBtn}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.whiteColor} />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: 100,
    padding: 10,
  },
  scrollContainer: {
    paddingTop: 20, // Space for back button
    paddingHorizontal: 20,
    paddingRight: 10,
    paddingBottom: 80, // Space for save button
  },
  profilePicContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePic: {
    width: 125,
    height: 125,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Colors.buttonColor,
  },
  photoButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  changePicButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  changePicText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  editFormContainer: {
    marginTop: 5,
  },
  nameContainer: {
    flexDirection: "row", // Align items side by side
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroup: {
    flex: 1, // Make input fields flexible to fill space
    marginRight: 10, // Add space between fields
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.blackColor,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
    elevation: 1, // Shadow for better visibility
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
    elevation: 1, // Shadow for better visibility
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: Colors.buttonColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20, // Fixed height
  },
  saveBtnText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
