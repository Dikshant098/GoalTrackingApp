import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox"; // Install with `expo install expo-checkbox`
import { Colors } from "../../constants/styles";
import moment from "moment";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { updateProgress } from "../../store/slice/progressSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GoalCheckScreen = ({ navigation, route }) => {
  const { goal } = route.params;
  // console.log("goal : ", goal);
  const dispatch = useDispatch();

  // Generate a list of dates between start_date and end_date
  const startDate = moment(goal.start_date);
  const endDate = moment(goal.end_date);
  const dateList = [];
  while (startDate.isSameOrBefore(endDate)) {
    dateList.push(startDate.format("DD-MM-YYYY"));
    startDate.add(1, "day");
  }

  const totalDays = dateList.length;

  // State to track selected dates
  const [selectedDates, setSelectedDates] = useState([]);

  const STORAGE_KEY = `selectedDates_${goal.id}`;

  // Load selected dates from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSelectedDates = async () => {
      try {
        const storedDates = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedDates) {
          setSelectedDates(JSON.parse(storedDates));
        }
      } catch (error) {
        // console.error("Failed to load selected dates", error);
      }
    };

    loadSelectedDates();
  }, []);

  const toggleCheckbox = (date) => {
    setSelectedDates((prev) => {
      const updatedSelection = prev.includes(date)
        ? prev.filter((d) => d !== date) // Remove if already selected
        : [...prev, date]; // Add if not selected

      // Calculate progress percentage
      // const progressPercentage =
      //   (updatedSelection.length / dateList.length) * 100;

      // Dispatch progress update
      // updateProgressHandler(progressPercentage);

      // Save updated state to AsyncStorage
      saveSelectedDates(updatedSelection);

      return updatedSelection;
    });
  };

  const saveSelectedDates = async (dates) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
    } catch (error) {
      // console.error("Failed to save selected dates", error);
    }
  };

  const determineStatus = (progressPercentage) => {
    if (progressPercentage === 0) return "pending";
    if (progressPercentage > 0 && progressPercentage < 100)
      return "in_progress";
    if (progressPercentage === 100) return "completed";
    return "failed"; // Add this only if you have criteria for failure.
  };

  const updateProgressHandler = (progress) => {
    const status = determineStatus(progress);
    // console.log("Status : ", status);
    dispatch(
      updateProgress({ goalId: goal.id, progress, progressStatus: status })
    );
    Alert.alert(
      "Progress Updated",
      "Your progress has been updated successfully!",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  // Calculate progress as a percentage
  // const progress = selectedDates.length / totalDays;

  // console.log("Progress :-  ", progress);

  // Function to format the time to HH:MM AM/PM
  const formatTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number); // Parse the time string
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format and handle midnight as 12
    const formattedMinutes = String(minutes).padStart(2, "0");
    // const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.container}>
        {goalDetail()}
        {goalTime()}
        {goalCheckBox()}
        {/* {goBackButton()} */}
        {completeAndSaveButtons()}
      </View>
    </SafeAreaView>
  );

  function goalDetail() {
    return (
      <View style={styles.goalDetail}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.goalDescription}>{goal.description}</Text>
      </View>
    );
  }

  function goalTime() {
    return (
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={24} color={Colors.blueColor} />
        <Text style={styles.timeText}>
          {formatTime(goal.start_time)} - {formatTime(goal.end_time)}
        </Text>
      </View>
    );
  }

  function goalCheckBox() {
    return (
      <View style={styles.listContainer}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerIndex}>#</Text>
          <Text style={styles.headerDate}>Date</Text>
          <Text style={styles.headerCheckbox}>Select</Text>
        </View>

        {/* Dates with Checkboxes */}
        <FlatList
          data={dateList}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.index}>{index + 1}.</Text>
              <Text style={styles.dateText}>{item}</Text>
              <Checkbox
                value={selectedDates.includes(item)}
                onValueChange={() => toggleCheckbox(item)}
                color={
                  selectedDates.includes(item) ? Colors.blueColor : undefined
                }
                style={styles.checkBox}
              />
            </View>
          )}
        />
      </View>
    );
  }

  // function goBackButton() {
  //   return (
  //     <View style={styles.goBackButtonContainer}>
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => navigation.goBack()}
  //         style={styles.goBackBtn}
  //       >
  //         <Ionicons name="arrow-back" size={22} color="#fff" />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  function completeAndSaveButtons() {
    return (
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => navigation.navigate('Goals')}
          onPress={() => navigation.goBack()}
          style={styles.goBackBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Complete Goal Button */}
        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log("Complete Goal");
          }}
          style={styles.completeGoalBtn}
        >
          <Text style={styles.completeGoalBtnText}>Complete Goal</Text>
        </TouchableOpacity> */}

        {/* Save Progress Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const progressPercentage =
              (selectedDates.length / dateList.length) * 100;
            // console.log("progressPercentage : ", progressPercentage);
            updateProgressHandler(progressPercentage);
          }}
          style={styles.saveProgressBtn}
        >
          <AntDesign name="check" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
};

export default GoalCheckScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  goalDetail: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: Colors.lightBlueColor,
    alignItems: "center",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 10,
    height: "11%",
    marginTop: 1,
  },
  goalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 19,
    color: "#F7EF8A",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: "row", // Align icon and text in a row
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 5,
    alignItems: "center", // Center align vertically
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Adds shadow for Android
  },
  timeText: {
    marginLeft: 10, // Space between icon and text
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.blueColor,
  },

  listContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 80,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerIndex: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  headerDate: {
    flex: 5,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  headerCheckbox: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  index: {
    flex: 1,
    right: 5,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  dateText: {
    flex: 5,
    right: 30,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  checkBox: {
    right: 25,
    borderWidth: 1,
    borderColor: "black",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row", // Arrange buttons in a row
    justifyContent: "space-between", // Space buttons evenly
    alignItems: "center",
  },
  completeGoalBtn: {
    backgroundColor: Colors.buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "45%", // Adjust width
    justifyContent: "center",
    alignItems: "center",
  },
  saveProgressBtn: {
    backgroundColor: Colors.buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  completeGoalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  goBackButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20, // Aligns the button to the left
  },
  goBackBtn: {
    backgroundColor: Colors.buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
