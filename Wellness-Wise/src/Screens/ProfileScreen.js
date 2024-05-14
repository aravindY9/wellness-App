import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { getUserInfo, updateUserProfile } from '../services/db';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dateToString } from '../services/CONSTANTS';
import { useFocusEffect } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getApp } from "firebase/app";
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { Buffer } from "buffer";
import { decode as atob } from 'base-64';
import { deleteCurrentUser, signOutUser } from '../services/auth';
import { deleteUserData } from '../services/db';
import YesNoPopup from '../Components/YesNoPopup';


function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const ProfileScreen = () => {
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [image, setImage] = useState("");

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const deleteUserPermanently = async () => {
    setIsPopupVisible(false);
    const user_uid = getAuth().currentUser.uid;
    await deleteUserData(user_uid);
    await deleteCurrentUser();
    await signOutUser();
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result.assets[0]);

    if (!result.canceled) {
      // upload to the cloud storage and get the link
      const firebaseApp = getApp();
      const firebaseAuth = getAuth();
      const storage = getStorage(firebaseApp);
      const response = await fetch(result.assets[0].uri)
      const blob = await response.blob();
      const storageRef = ref(storage, firebaseAuth.currentUser.uid+".jpeg");

      // 'file' comes from the Blob or File API
      const uploadTask = uploadBytesResumable(storageRef, blob);
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setImage(downloadURL);
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fillUserInfo();
      return () => {
      
      };
    }, [])
  );
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(userInfo.BirthDate);
    setShow(false);
    setUserInfo(prevState => ({
      ...prevState,
      BirthDate: dateToString(currentDate),
    }));
  };

  const fillUserInfo = async () =>{
    const userData = await getUserInfo();
    console.log(userData);
    setUserInfo({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      BirthDate: userData.date,
    });
    setImage(userData.img);
    setUserScore(userData.score);
  }



  const handleEdit = () => setEditMode(!editMode);

  const handleSave = async () => {
    // Save the user info to your backend or AsyncStorage here
    await updateUserProfile({
      ...userInfo,
      img: image
    });
    setEditMode(false);
  };

  return (
    <ImageBackground source={require('../Images/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.profileCard}>
        <View style={styles.avatarSection}>
          {(!editMode) ? (
            image ? (
              <ImageBackground
                source={{uri: image}}
                style={styles.avatar}
              />
            ) : (
              <ImageBackground 
                source={require('../Images/background.jpg')}
                style={styles.avatar}
              />
            )
             ) :
          <TouchableOpacity onPress={() => {pickImage()}}>
            <ImageBackground
              source={{uri: image}}
              style={styles.avatar}
            />
          </TouchableOpacity>
          }
          {(userInfo) && <>
            <Text style={styles.nameText}>{userInfo.lastName}, {userInfo.firstName}</Text>
            <Text>Score: {userScore}</Text>
          </>}
        </View>

        <View style={styles.infoSection}>
          {(userInfo == null)?<Text>{"Loading"}</Text>:
          Object.entries(userInfo).map(([key, value]) => (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              {
                editMode ? (
                  key === "BirthDate" ? (
                    show === false ?
                      <TouchableOpacity onPress={() => setShow(true)}>
                        <Text>{userInfo.BirthDate || "Select Birth Date"}</Text>
                      </TouchableOpacity> :
                      (
                        <DateTimePicker
                          // testID="dateTimePicker"
                          value={new Date(userInfo.BirthDate)}
                          mode={mode}
                          is24Hour={true}
                          display="default"
                          onChange={onChange}
                        />
                      )
                  ) : (
                    <TextInput
                      style={styles.infoInput}
                      value={value.toString()}
                      onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, [key]: text }))}
                    />
                  )
                ) : (
                  <Text style={styles.infoValue}>{value.toString()}</Text>
                )
              }
            </View>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={editMode ? handleSave : handleEdit}>
            <Text style={styles.buttonText}>{editMode ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
          {editMode ? (
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => {setEditMode(false)}}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setIsPopupVisible(true)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
        <YesNoPopup
          isVisible={isPopupVisible}
          message="Do you want to proceed?"
          onYes={deleteUserPermanently}
          onNo={()=>{
            setIsPopupVisible(false);
            console.log('User selected No!');
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'red'
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 16,
    marginLeft: 10,
  },
  infoInput: {
    borderBottomWidth: 1,
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    paddingVertical: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#FF8D6E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#FF4040',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
