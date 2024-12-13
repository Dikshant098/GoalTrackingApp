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
import { clearError, loginUser } from "../../store/slice/authSlice";
import { StatusBar } from "react-native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, success } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const handleLogin = () => {
    if (!emailOrUsername || !password) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
    const userData = { login: emailOrUsername, password }; // Use email or username
    dispatch(loginUser(userData));
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Login Error", error);
      dispatch(clearError());
    }
    if (success) {
      // Otherwise, navigate to Home screen
      // Alert.alert("Login Successful", "Welcome back!");
      // navigation.navigate("Home Screen");
    }
  }, [error, success, dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Image
          source={require("../../assets/icon.png")}
          style={styles.logoImg}
          resizeMode="contain"
        /> */}
        <View style={styles.inputContainer}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subHeading}>Login to your account</Text>
          <TextInput
            placeholder="Enter Email or Username"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
            style={styles.input}
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
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </Pressable>
          {/* <Pressable
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate("Forgot Password")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable> */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Register User")}
            >
              <Text style={styles.registerLink}>Register</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

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
    backgroundColor: "#007bff",
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
  forgotPasswordButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#666",
  },
  registerLink: {
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
