import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loading, error, success } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    let hasError = false;

    // Validate input fields
    if (!emailOrUsername) {
      setEmailError("Email or username is required.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) return;

    const userData = { login: emailOrUsername, password };

    try {
      await dispatch(loginUser(userData)).unwrap();
    } catch (err) {
      // Handle server-side errors
      if (err.errors) {
        if (err.errors.login) setEmailError(err.errors.login[0]);
        if (err.errors.password) setPasswordError(err.errors.password[0]);
      } else if (err.message) {
        setEmailError(err.message);
      }
    }
  };

  useEffect(() => {
    // Handle global errors from the Redux state
    if (error) {
      if (error.includes("email") || error.includes("username")) {
        setEmailError(error);
      } else if (error.includes("password")) {
        setPasswordError(error);
      }
      dispatch(clearError());
    }

    if (success) {
      navigation.navigate("HHomeScreen");
    }
  }, [error, success, dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subHeading}>Login to your account</Text>

          {/* Email/Username Field */}
          <TextInput
            placeholder="Enter Email or Username"
            value={emailOrUsername}
            onChangeText={(value) => {
              setEmailOrUsername(value);
              setEmailError(""); // Clear error on input change
            }}
            style={[styles.input, emailError ? styles.inputError : null]}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          {/* Password Field */}
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setPasswordError(""); // Clear error on input change
            }}
            secureTextEntry
            style={[styles.input, passwordError ? styles.inputError : null]}
          />
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          {/* Login Button */}
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

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Register User")}>
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
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
