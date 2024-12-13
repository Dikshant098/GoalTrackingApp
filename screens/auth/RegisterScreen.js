import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  clearSuccess,
  registerUser,
} from "../../store/slice/authSlice";
import { StatusBar } from "react-native";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    loading: registerLoading,
    error,
    success,
  } = useSelector((state) => state.auth);

  const handleRegister = () => {
    setLoading(true);
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
    };
    dispatch(registerUser(userData));
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Registration Error", error);
      dispatch(clearError());
      setLoading(false);
    }
    if (success) {
      Alert.alert("Registration Successful", "You can now log in.");
      dispatch(clearSuccess());
      navigation.navigate("Login User");
      setLoading(false);
    }
  }, [error, success, dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Image
          source={require("../../assets/logo.png")}
          style={styles.logoImg}
          resizeMode="contain"
        /> */}
        <View style={styles.inputContainer}>
          <Text style={styles.heading}>Create Your Account</Text>
          <Text style={styles.subHeading}>Where Goals Meet Growth</Text>
          <TextInput
            placeholder="Enter First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Pressable
            style={styles.button}
            onPress={handleRegister}
            disabled={registerLoading || loading}
          >
            {registerLoading || loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Register</Text>
            )}
          </Pressable>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Login User")}
            >
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoImg: {
    height: 100,
    width: 100,
    alignSelf: "center",
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#666",
  },
  loginLink: {
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
