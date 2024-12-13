import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';

const MyAchievementsScreen = () => {
  const achievements = [
    { id: '1', title: 'Weight Loss Milestone', date: '2024-01-15'},
    { id: '2', title: '10k Steps in a Day', date: '2024-02-10'},
    { id: '3', title: '50 Push-ups Streak', date: '2024-03-05'},
  ];

  const renderAchievement = ({ item }) => (
    <View style={styles.achievementCard}>
      <Image source={item.icon} style={styles.achievementIcon} />
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievement}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share Achievements</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyAchievementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign:'center'
  },
  listContent: {
    paddingBottom: 80,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  shareButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
