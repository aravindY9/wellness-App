import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground
} from 'react-native';
import TaskItem from '../Components/TaskCard';
import AddTime from '../Components/AddTime';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { signOutUser } from '../services/auth';
import { readUsersInfo, getUserDateDoc, saveUserDataByDate } from '../services/db';
import { dateToString } from '../services/CONSTANTS';


const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Work Out', duration: 3600, isCompleted: 0},
  ]);
  const [addToTasks, setAddToTasks] = useState(0)
  // insted of isCompleted whats is wrong with completedTime, if we have this then we can know how much did the user completed in a single task right? just asking

  useEffect(() => {
    console.log("this is home screen useEffect for data update!!!!!")
    updateTasksIfNeeded();
  }, [])

  const updateTasksIfNeeded = async () =>{
    const data = await getUserDateDoc(dateToString(new Date()));
    if(data != null){
      console.log(data);
      setTasks(Object.values(data));
    }else{
      // imp to check
      // if data is null then we should copy all the tasks form the previous day and then set isCompleted to zero? instead of taking data from tasks
      const mapTasks = tasks.reduce((result, item) => {
        result[item.id] = {
          id: item.id,
          title: item.title,
          duration: item.duration,
          isCompleted: 0
        };
        return result;
      }, {});
      await saveUserDataByDate(dateToString(new Date()), mapTasks);
    }
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTime, setNewGoalTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <ImageBackground
      source={require('../Images/background.jpg')} // Update with the correct path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <AddTime 
          tasks={tasks}
          setTasks={setTasks}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setAddToTasks={setAddToTasks}
        />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem 
              id={item.id}
              title={item.title} 
              duration={item.duration} 
              isCompleted={item.isCompleted}
            />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.icon}>➕</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
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
    // Update your header styles here
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  taskItem: {
    // Update your task item styles here
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
    // padding: 10,
    margin: 'auto',
  },
  addButton: {
    // Update your add button styles here
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8D6E', // Change color to match the design
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default HomeScreen;
