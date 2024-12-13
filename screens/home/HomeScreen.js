import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
  SafeAreaView,
} from "react-native";
import { FontAwesome5, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import GoalsCard from "../../components/GoalsCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/slice/userSlice";
import { getAllGoals } from "../../store/slice/goalSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { user } = useSelector((state) => state.user);
  const { loading, error, goals } = useSelector((state) => state.goal);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUser());
      dispatch(getAllGoals());
    }, [dispatch])
  );

  // console.log("Goals Data : ", goals?.data);

  return (
    <SafeAreaView style={{ flex: 1, padding: 6 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {header()}
        {Boxes()}
        {goalsCard()}
      </ScrollView>
    </SafeAreaView>
  );

  function header() {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.data?.first_name}
        </Text>
      </View>
    );
  }

  function Boxes() {
    return (
      <>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("trackYourGoal")}
          >
            <FontAwesome5 name="running" size={36} color="black" />
            <Text style={styles.boxTitle}>Track</Text>
            <Text style={styles.boxDescription}>Track your goals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("viewYourProgress")}
          >
            <MaterialIcons name="insights" size={36} color="black" />
            <Text style={styles.boxTitle}>View</Text>
            <Text style={styles.boxDescription}>View your progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {/* <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("myAchivements")}
          >
            <MaterialIcons name="military-tech" size={36} color="black" />
            <Text style={styles.boxTitle}>Achieve</Text>
            <Text style={styles.boxDescription}>Achieve Milestones</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("goalHistory")}
          >
            <FontAwesome5 name="history" size={35} color="black" />
            <Text style={styles.boxTitle}>History</Text>
            <Text style={styles.boxDescription}>Your Goal History</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // to get Upcomming Goals
  function getUpcomingGoalsData() {
    if (!goals?.data) return [];

    const currentDateTime = new Date(); // Get current date and time
    return goals.data.filter((goal) => {
      const goalStartDateTime = new Date(
        `${goal.start_date}T${goal.start_time}`
      );
      return goalStartDateTime > currentDateTime && goal.status === "pending";
    });
  }

  function goalsCard() {
    const upcomingGoals = getUpcomingGoalsData();

    // Log upcoming goals to the console
    // console.log("Upcoming Goals: ", upcomingGoals);

    return (
      <View style={styles.card}>
        <Text style={styles.goalTitle}>Upcoming Goals</Text>
        {upcomingGoals.length > 0 ? (
          <GoalsCard goals={upcomingGoals} />
        ) : (
          <Text style={styles.noUpcomingGoal}>No Upcoming Goals</Text>
        )}
      </View>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  welcomeContainer: {
    adding: 5,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    flex: 1,
    height: 130,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 30,
    // borderWidth: 0.4,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
  },
  boxDescription: {
    fontSize: 16,
    color: "black",
    marginTop: 5,
    textAlign: "center",
  },
  goalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop:10,
  },
  card: {
    marginBottom: 10,
  },
  noUpcomingGoal: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    textAlign: "center", // Ensure the text is centered
    fontSize: 18, // You can also adjust font size if needed
    color: "gray", // Optional: style the text color
  },
});
