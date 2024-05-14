import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { saveUserDataByDate } from '../services/db';
import { dateToString } from '../services/CONSTANTS';
import { getUserInfo, updateUserProfile } from '../services/db';

const TaskItem = ({ id, title, duration, isCompleted }) => {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [timerOn, setTimerOn] = useState(false);
  const [timeInSleep, setTimeInSleep] = useState(duration);
  const [completedTime, setCompletedTime] = useState(duration-remainingTime);
  const [isComplete, setIsComplete] =  useState((isCompleted == 1)?true:false);
  

  const storeData = async (value) => {
    setTimeInSleep(remainingTime);
    try{
      console.log("inside storeData", value);
      await AsyncStorage.setItem(id, value);
    }catch(e){
      console.log("Error while storing!!!: ",e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(id);
      if (value !== null) {
        return value
      }
    } catch (e) {
      console.log("getData ", e)
    }
  };
  
  useEffect(() => {
    if(isCompleted == 1){
      setIsComplete(true);
      setRemainingTime(0);
    }
    let interval;
    if (timerOn && remainingTime > 0) {
      setCalculatedTimeAfterBreak();
      interval = setInterval(() => {
        // if the elapsed time > 2
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }else if(duration-completedTime < 2){
      // send updated info to the firebase
      setIsComplete(true);
      console.log("COMPLETED!!!");
      const updatedData = {
        id: id,
        title: title,
        duration: duration,
        isCompleted: 1
      };
      saveUserDataByDate(dateToString(new Date()), {
        [id]: updatedData
      });
      updateScore(duration);
    }
    setCompletedTime(duration-remainingTime);
    console.log("Completed Time: ", completedTime);

    return () => clearInterval(interval);
  }, [timerOn, remainingTime, isCompleted]);

  useEffect(() => {
    if(timerOn)
      storeData(""+(Math.floor(Date.now() / 1000)));
    else
      storeData("-1");
  }, [timerOn]);

  const updateScore = async (score)=>{
    const userInfo = await getUserInfo();
    await updateUserProfile({
      score: userInfo.score+score
    });
  }
  const toggleTimer = () => {
    setTimerOn(!timerOn);
  };

  async function setCalculatedTimeAfterBreak(){
    const prevTime = await getData();
    if(prevTime != "-1"){
      const timeElapsed = Math.floor(Date.now() / 1000) - Number(prevTime);
      setRemainingTime(timeInSleep-timeElapsed);
      console.log('total time: ', timeElapsed);
    }
  }

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.taskContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🗂</Text> 
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.duration}>{formatTime(remainingTime)}</Text>
      </View>
      {(!isComplete)?
        <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
          { timerOn ? 
            <AntDesign name="play" size={30} color="#FF8D6E" /> :
            <FontAwesome6 name="pause" size={30} color="green" />
          }
        </TouchableOpacity>:
        <FontAwesome6 name="pause" size={30} color="red" style={styles.timerButton}/>
      }
    </View>
  );
};


const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
    padding: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 4,
    marginHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  duration: {
    fontSize: 20,
    color: '#000', 
  },
  timerButton: {
    marginLeft: 'auto', 
    padding: 5,
  },
});

export default TaskItem;
