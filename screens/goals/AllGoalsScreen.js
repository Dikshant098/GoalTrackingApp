import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { deleteGoal, getAllGoals } from "../../store/slice/goalSlice";
import { ActivityIndicator } from "react-native";

// Scale font and size for responsiveness
const { width } = Dimensions.get("window");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scaleSize = (size) => (width / 375) * size; // scale based on 375 width as a baseline (iPhone 6)
const scaleFont = (size) => (screenWidth / 375) * size;

const AllGoalsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { goals, loading } = useSelector((state) => state.goal);
  const goalsData = goals?.data || [];

  const [refreshing, setRefreshing] = useState(false);

  // Function to format the date to DD/MM/YYYY
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Ensure date is a Date object
    }
    if (isNaN(date)) {
      // console.error("Invalid date:", date);
      return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const deleteGoalHandler = async (goalId) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await dispatch(deleteGoal(goalId));
            refreshGoals(); // Refresh goals after deletion
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const refreshGoals = async () => {
    setRefreshing(true);
    await dispatch(getAllGoals()); // Fetch updated list of goals
    setRefreshing(false);
  };

  const renderGoalItem = ({ item }) => {
    const progressPercentage = parseFloat(
      item?.progress?.progress_percentage || 0
    );
    // console.log("progressPercentage : ", progressPercentage);

    const progress = parseFloat(item?.progress?.progress_percentage || 0);

    return (
      <TouchableOpacity
        style={styles.goalItem}
        onPress={() => navigation.navigate("goalCheck", { goal: item })}
      >
        <Text style={styles.goalTitle}>{item.title}</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>

        {/* Progress Percentage */}
        <Text style={styles.progressPercentageText}>
          {progressPercentage.toFixed(1)}% Completed
        </Text>

        {/* Deadline */}
        <Text style={styles.goalDeadline}>
          Deadline: {formatDate(item.end_date)}
        </Text>

        <View style={styles.goalActions}>
          {/* <TouchableOpacity
            onPress={() =>
              Alert.alert("Edit", "Edit goal feature coming soon!")
            }
          >
            <Ionicons name="create-outline" size={24} color="blue" />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => deleteGoalHandler(item.id)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>All Goals</Text>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.grayColor} />
        </View>
      ) : (
        <FlatList
          data={goalsData}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.goalList}
          showsVerticalScrollIndicator={false}
          onRefresh={refreshGoals} // Set the refresh function
          refreshing={refreshing} // Set the refreshing state
        />
      )}
    </View>
  );
};

export default AllGoalsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: scaleSize(10),
  },
  headerContainer: {
    marginBottom: scaleSize(10),
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: scaleSize(22),
    fontWeight: "bold",
    marginVertical: scaleSize(10),
    color: "#333",
  },
  goalList: {
    marginBottom: scaleSize(10),
  },
  goalItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 15,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBarContainer: {
    height: scaleSize(10),
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: scaleSize(5),
    overflow: "hidden",
    marginTop: scaleSize(5),
  },
  progressPercentageText: {
    fontSize: scaleFont(14),
    fontWeight: "500",
    marginTop: scaleSize(5),
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.blueColor,
  },
  goalDeadline: {
    fontSize: scaleFont(14),
    color: Colors.grayColor,
    marginTop: scaleSize(5),
  },
  goalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
