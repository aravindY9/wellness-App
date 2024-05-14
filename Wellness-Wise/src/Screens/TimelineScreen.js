import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Make sure to install react-native-calendars
import { Ionicons } from '@expo/vector-icons';
import { queryUserDataByDateRange, getAllDatesData } from '../services/db';
import { dateToString } from '../services/CONSTANTS';
import RenderTaskTimeline from '../Components/RenderTaskTimeline'

const TimelineScreen = () => {
  // State to manage which screen to show, calendar or day view
  const [viewMode, setViewMode] = useState('calendar'); 
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyTasks, setDailyTasks] = useState([]);
  const [datesData, setDatesData] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      fillDateData();
      return () => {
        setViewMode('calendar');
      };
    }, [])
  );

  
  const fillDateData = async () => {
    const data = await getAllDatesData();
    const greenShades = ['#7be382', '#26cc00', '#22b600', '#009c1a'];
    let tempObj = {};
  
    data.forEach(item => {
      const date = item.date;
      const tasks = Object.values(item.data);
      let completedCount = tasks.filter(task => task.isCompleted === 1).length;
      
      let color = '#fff'; // Default color
      if (completedCount !== 0) {
        const completionRatio = completedCount / tasks.length;
        if (completionRatio < 0.25) {
          color = greenShades[0];
        } else if (completionRatio < 0.50) {
          color = greenShades[1];
        } else if (completionRatio < 0.75) {
          color = greenShades[2];
        } else {
          color = greenShades[3];
        }
      }
      
      let temp2Obj = {
        selected: true,
        selectedColor: "Orange",
        selectedTextColor: "black"
      }
      temp2Obj['selectedColor'] = color
      
      tempObj[date] = temp2Obj
    });

    setDatesData(data);
    setMarkedDates(tempObj);
  };

  

  const onDayPress =  async (day) => {
    setDatesData(await getAllDatesData());
    setViewMode('day');
    setSelectedDate(day.dateString);
    console.log(datesData)
    const tasksForDay1 = []
    setDailyTasks([]);
    datesData.forEach(item => {
      if (item['date'] === day.dateString) {
        for (let [key, value] of Object.entries(item.data)) {
          tasksForDay1.push(value)
          console.log(value)
        }
        setDailyTasks(tasksForDay1)
        console.log('testing: ', tasksForDay1)
        console.log(dailyTasks)
      }
    })
    // setDailyTasks(tasksForDay[day.dateString] || []);
  };

  if (viewMode === 'calendar') {
    return (
      <ImageBackground
        source={require('../Images/background.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={
                markedDates
            }
            onDayPress={onDayPress}
            theme={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Set calendar background color
              calendarBackground: 'rgba(255, 255, 255, 0.8)', // Ensures calendar's internal background matches
            }}
          />
        </View>
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground
        source={require('../Images/background.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity
                  onPress={() => setViewMode('calendar')}
                  style={{flexDirection: 'row'}}
              >
                  <Ionicons 
                      name="caret-back-circle" 
                      size={30} 
                      color="black" 
                  />
                  <Text>
                      Back to calendar
                  </Text>
              </TouchableOpacity>
              <Text style={styles.dateHeaderText}>{selectedDate}</Text>
              
          </View>
          {(dailyTasks.length != 0) ? <>
            <FlatList
            data={dailyTasks}
            renderItem={({ item }) => (
              <RenderTaskTimeline 
                item={item} 
              />
            )}
            keyExtractor={(item) => item.id}
          />
          </> : console.log("empty")}
        </View>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  dateHeader: {
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  dateHeaderText: {
    textAlign: 'center',
    fontSize: 18,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  taskTitle: {
    fontSize: 16,
  },
  taskCompleted: {
    color: 'green',
  },
  taskNotCompleted: {
    color: 'red',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    backgroundColor: 'transparent', // Set the background color for the calendar's container
    padding: 10,
  },
});

export default TimelineScreen;
