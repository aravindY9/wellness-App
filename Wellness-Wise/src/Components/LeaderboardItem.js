import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

const LeaderboardItem = ({ item, index }) => {  
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.name}>{index + 1}</Text>
        <Text style={styles.name}>{item.firstName}</Text>
        <Text style={styles.points}>{item.score} pts</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff', // White color for item background
    borderColor: '#ffd700', // Gold color for border
    borderWidth: 2,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between', // To space out the name and score
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffa500', // Orange color for points
  },
})


export default LeaderboardItem;