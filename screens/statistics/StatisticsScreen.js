import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ProgressChart, BarChart, PieChart } from "react-native-chart-kit";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import { SafeAreaView } from "react-native";
import QuotesHeader from "../../components/QuotesHeader";
import { useDispatch, useSelector } from "react-redux";
import { deleteGoal, getAllGoals } from "../../store/slice/goalSlice";

// Use Dimensions API for responsiveness
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const { width } = Dimensions.get("window");

// Scale function to adjust font sizes based on screen width
const scaleFont = (size) => (screenWidth / 375) * size;
const scaleSize = (size) => (width / 375) * size; // You can adjust the base value (375) if needed

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { goals, loading } = useSelector((state) => state.goal);
  const goalsData = goals?.data || [];

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllGoals());
    }, [dispatch])
  );

  // console.log("Goals : ", goals);

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

  const renderContent = () => [
    { id: "1", component: progressChart() },
    { id: "2", component: goalsBreakdown() },
    { id: "3", component: achievements() },
    // Add other components as items here
  ];

  // Show loader only for content
  const contentLoader = loading ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={Colors.grayColor} />
    </View>
  ) : (
    <FlatList
      data={renderContent()}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <View>{item.component}</View>}
      contentContainerStyle={styles.contentContainer}
      onRefresh={refreshGoals} // Set the refresh function
      refreshing={refreshing} // Set the refreshing state
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.container}>
        <QuotesHeader title="Your Progress" />
        {contentLoader}
      </View>
    </SafeAreaView>
  );

  function progressChart() {
    // Process the goals data
    const completedGoals = goalsData.filter(
      (goal) => goal.status === "completed"
    ).length;
    // console.log("Number of completed goals:", completedGoals);

    const pendingGoals = goalsData.filter(
      (goal) => goal.status === "pending"
    ).length;
    // console.log("Number of pending goals:", pendingGoals);

    const inProgressGoals = goalsData.filter(
      (goal) => goal.status === "in_progress"
    ).length;
    // console.log("Number of in-progress goals:", inProgressGoals);

    const failedGoals = goalsData.filter(
      (goal) => goal.status === "failed"
    ).length;
    // console.log("Number of failed goals:", failedGoals);

    const totalGoals = goalsData.length;

    if (totalGoals === 0) {
      return (
        <View style={styles.progressOverview}>
          <Text style={styles.overviewText}>No goals available.</Text>
        </View>
      );
    }

    const pieData = [
      {
        name: "Pending Goal",
        population: pendingGoals,
        color: "purple",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "In Progress Goal",
        population: inProgressGoals,
        color: Colors.blueColor,
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "Completed Goal",
        population: completedGoals,
        color: Colors.greenColor,
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "Failed Goal",
        population: failedGoals,
        color: Colors.redColor,
        legendFontColor: "#333",
        legendFontSize: 14,
      },
    ];

    return (
      <View style={styles.progressOverview}>
        <PieChart
          data={pieData}
          width={screenWidth - 30} // Adjust the width as needed
          height={200} // Adjust the height as needed
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",

            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          absolute
        />
        <Text style={styles.overviewText}>
          {totalGoals} Goals Set, {completedGoals} Completed
        </Text>
      </View>
    );
  }

  function goalsBreakdown() {
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

    // Limit to 3 goals
    const limitedGoalsData = goalsData.slice(0, 3);

    return (
      <View style={styles.goalContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Goal Breakdown</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AllGoals")}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={limitedGoalsData}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.goalList}
          nestedScrollEnabled={true}
        />
      </View>
    );
  }

  // function trendsAndInsights() {
  //   return (
  //     <>
  //       <Text style={styles.sectionTitle}>Trends and Insights</Text>
  //       <BarChart
  //         data={data}
  //         width={screenWidth - 32}
  //         height={220}
  //         chartConfig={{
  //           backgroundColor: "#000",
  //           backgroundGradientFrom: "#6a5acd",
  //           backgroundGradientTo: "#483d8b",
  //           decimalPlaces: 1,
  //           color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  //         }}
  //         style={styles.chart}
  //       />
  //       <View style={styles.metrics}>
  //         <Text>Average completion rate: 60%</Text>
  //         <Text>Consistency streak: 4 weeks</Text>
  //       </View>
  //     </>
  //   );
  // }

  function achievements() {
    const completedGoals = goalsData.filter(
      (goal) => goal.status === "completed"
    ).length;
    return (
      <View style={styles.achievementContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievements}>
          <Text style={styles.achievementText}>
            🏆 {completedGoals} Goal completed!
          </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Share", "Share on social media feature coming soon!")
            }
          >
            <Text style={styles.shareButton}>Share on social media</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // function callToAction() {
  //   return (
  //     <>
  //       <TouchableOpacity
  //         style={styles.addButton}
  //         onPress={() => navigation.navigate("AddGoal")}
  //       >
  //         <Text style={styles.addButtonText}>+ Add New Goal</Text>
  //       </TouchableOpacity>
  //     </>
  //   );
  // }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    paddingHorizontal: scaleSize(12),
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
  progressOverview: {
    alignItems: "center",
    marginBottom: scaleSize(20),
  },
  overviewText: {
    marginTop: scaleSize(5),
    fontSize: scaleFont(17),
    fontWeight: "bold",
  },
  goalContainer: {
    padding: scaleSize(5),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSize(8),
  },
  sectionTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  goalList: {
    paddingBottom: scaleSize(10),
  },
  seeAllButton: {
    fontSize: 16,
    color: Colors.blueColor,
    textDecorationLine: "none",
    fontWeight: "bold",
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
  chart: {
    marginVertical: 10,
  },
  metrics: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  achievementContainer: {
    marginTop: scaleSize(10),
    paddingHorizontal: scaleSize(15),
  },
  achievements: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
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
  achievementText: {
    fontSize: scaleFont(18),
    fontWeight: "500",
  },
  shareButton: {
    marginTop: scaleSize(10),
    fontSize: scaleFont(16),
    color: Colors.blueColor,
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

export default StatisticsScreen;
