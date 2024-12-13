import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { deleteGoal, getAllGoals } from "../../store/slice/goalSlice";
import { ActivityIndicator } from "react-native";

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
    padding: 10,
  },
  header: {
    width: "100%", // Full width header
    paddingVertical: 20,
    backgroundColor: Colors.lightBlueColor,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  motivationalQuote: {
    fontSize: 16,
    color: "#e0e0e0",
    marginTop: 8,
  },
  contentContainer: {
    paddingHorizontal: 16, // Padding of 16 for the content below the header
  },
  progressOverview: {
    alignItems: "center",
    marginBottom: 20,
  },
  overviewText: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  goalContainer: {
    padding: 5,
  },
  headerContainer: {
    marginBottom: 10,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  goalList: {
    marginBottom: 20,
  },
  seeAllButton: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
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
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressPercentageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  goalDeadline: {
    fontSize: 14,
    color: "#666",
  },
  goalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  chart: {
    marginVertical: 10,
  },
  metrics: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  achievements: {
    paddingVertical: 20,
    alignItems: "center",
  },
  achievementText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    fontSize: 16,
    color: "#007bff",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
});
