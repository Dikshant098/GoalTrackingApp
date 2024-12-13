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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slice/userSlice";

const AddUserDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState(user?.data?.first_name || "");
  const [lastName, setLastName] = useState(user?.data?.last_name || "");
  const [username, setUsername] = useState(user?.data?.username || "");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState(user?.data?.email || "");
  const [bio, setBio] = useState("");
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/100"
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

  // Save changes and dispatch setUser action with FormData
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

    // If there's a new profile picture, append it to the formData
    // if (profilePic && !profilePic.includes("placeholder")) {
    //   const fileUri = profilePic;
    //   const fileName = fileUri.split("/").pop();
    //   const fileType = fileName.split(".").pop();

    //   formData.append("profile_image_url", {
    //     uri: fileUri,
    //     name: fileName,
    //     type: `image/${fileType}`,
    //   });
    // }
    // console.log("Form Data : ", formData);

    // Dispatch the setUser action with formData
    try {
      // console.log("Form Data Start : ");
      await dispatch(setUser(formData)); // Ensure the request resolves before navigating back
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
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialIcons name="arrow-back" size={24} color={Colors.blackColor} />
      </TouchableOpacity>

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
              onPress={() => setProfilePic("https://via.placeholder.com/100")}
              style={styles.changePicButton}
            >
              <Text style={styles.changePicText}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.editFormContainer}>
          <View style={styles.nameContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                placeholder="Enter your first name"
                onChangeText={setFirstName}
                onFocus={() => setKeyboardVisible(true)}
                onBlur={() => setKeyboardVisible(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                placeholder="Enter your last name"
                onChangeText={setLastName}
                onFocus={() => setKeyboardVisible(true)}
                onBlur={() => setKeyboardVisible(false)}
              />
            </View>
          </View>

          <View style={styles.nameContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                placeholder="Enter your username"
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={setGender}
                  style={styles.picker}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={setEmail}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={styles.textInput}
              value={bio}
              placeholder="Tell us about yourself"
              multiline={true}
              onChangeText={setBio}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Motivational Quote</Text>
            <TextInput
              style={styles.textInput}
              value={motivationalQuote}
              placeholder="Share your favorite quote"
              multiline={true}
              onChangeText={setMotivationalQuote}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
          </View>
        </View>

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSaveChanges}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddUserDetailScreen;

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
  saveBtnText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
