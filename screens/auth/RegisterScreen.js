import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  Image,
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
  const [errors, setErrors] = useState({});

  const {
    loading: registerLoading,
    error,
    success,
  } = useSelector((state) => state.auth);

  const validateInputs = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required.";
    if (!username.trim()) newErrors.username = "Username is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (!password.trim() || password.length < 6)
      newErrors.password =
        "Password is required and must be at least 6 characters long.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleRegister = () => {
    if (!validateInputs()) {
      return;
    }

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
      setErrors({ global: error });
      dispatch(clearError());
    }
    if (success) {
      navigation.navigate("Login User");
      dispatch(clearSuccess());
    }
  }, [error, success, dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.heading}>Create Your Account</Text>
          <Text style={styles.subHeading}>Where Goals Meet Growth</Text>
          <TextInput
            placeholder="Enter First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          <TextInput
            placeholder="Enter Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          <TextInput
            placeholder="Enter Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <Pressable
            style={styles.button}
            onPress={handleRegister}
            disabled={registerLoading}
          >
            {registerLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Register</Text>
            )}
          </Pressable>
          {errors.global && <Text style={styles.errorText}>{errors.global}</Text>}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Login User")}>
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
    marginBottom: 5,
    borderRadius: 8,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
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
