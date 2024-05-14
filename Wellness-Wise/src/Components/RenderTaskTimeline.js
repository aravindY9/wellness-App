import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { formatTime } from '../services/CONSTANTS'

const RenderTaskTimeline = ({ item }) => {
  return (
    <View style={styles.taskItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.duration}>{formatTime(item.duration)}</Text>
      </View>
      {item.isCompleted === 1 ? (
        <Text style={styles.taskIcon}>✅</Text>
      ) : (
        <Text style={styles.taskIcon}>❌</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
    padding: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 4,
    marginHorizontal: 10,
  },
  duration: {
    fontSize: 20,
    color: '#000', 
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  iconContainer: {
    marginRight: 10,
  },
  taskIcon: {
    marginLeft: 'auto', 
  },
})

export default RenderTaskTimeline;