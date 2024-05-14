import { useState } from 'react'
import { Modal, View, Button, StyleSheet, Text, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveUserDataByDate } from '../services/db';
import { dateToString } from '../services/CONSTANTS';


const AddTime = ({ tasks, modalVisible, setModalVisible, setTasks, setAddToTasks }) => {
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTime, setNewGoalTime] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    
    const addTask = async () => {
        const newId = (tasks.length + 1).toString();
        const newTask = {
          id: newId,
          title: newGoalName,
          duration: newGoalTime.getHours() * 3600 + newGoalTime.getMinutes() * 60, 
          completedtime: 0,
          isCompleted: 0
        };
        setTasks([...tasks, newTask]);
        setAddToTasks(tasks.length);
        setNewGoalName("");
        setNewGoalTime(new Date());
        await saveUserDataByDate(dateToString(new Date()), {
          [newId]: newTask
        });
        setModalVisible(false);
      };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Add Goal</Text>
                <TextInput
                placeholder="Goal Name"
                style={styles.modalInput}
                onChangeText={setNewGoalName}
                value={newGoalName}
                />
                <Button title="Pick Time" onPress={() => setShowDate(true)}/>
                {
                showDate && (<DateTimePicker
                    value={newGoalTime}
                    mode="time"
                    is24Hour={true}
                    display="inline"
                    onChange={(event, selectedTime) => {
                    if (selectedTime) { 
                        setNewGoalTime(selectedTime);
                        setShowDate(false); 
                    }
                    }}
                    style={styles.timePicker}
                />)
                }
                <Text style={{color: 'red'}}>Carefull!!</Text>
                <Text style={{color: 'red'}}>Once added, tasks cannot be deleted</Text>
                <View style={styles.modalButtons}>
                <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                <Button title="ADD" onPress={addTask} />
                </View>
            </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      modalInput: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        width: 200,
        padding: 10,
      },
      timePicker: {
        width: 100,
        marginVertical: 15,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
});

export default AddTime;