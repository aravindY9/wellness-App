import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { registerUser } from '../services/auth';
import { writeUserInfo } from '../services/db';
import { dateToString } from '../services/CONSTANTS';
import DateTimePicker from '@react-native-community/datetimepicker';

const fromDateToString = (currentDate) => {
  // Extract date components
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = currentDate.getDate();
  // Format month and day with leading zeros if needed
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  // Construct the current date string in YYYY-MM-DD format
  const currentDateStr = `${year}-${formattedMonth}-${formattedDay}`;

  return currentDateStr;
};

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [date, setDate] = useState(new Date());
  const [phone, setPhone] = useState();
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onSignup = async () => {
    // Check that every field is filled or follows the correct pattern before this!!!
    // Check that every field is filled
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      // alert('Please fill in all fields');
      setErrorLogin('Please fill in all required fields')
      return;
    }
    
    if (!phone) {
      setPhone("");
    }

    if (password !== confirmPassword) {
      // alert('Passwords do not match');
      setErrorLogin('Passwords do not match')
      return;
    }

    
 
    const user = await registerUser(email, password);
    if(user != null) {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        date: dateToString(date)
      };
      await writeUserInfo(userData);
        navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      setErrorLogin('Email already in use')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wellness Wise</Text>
      <Text style={styles.label}>Sign-up:</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
      <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>Select Birth Date</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <Text style={styles.selectedDateText}>
        Birth Date: {date.toLocaleDateString()}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        onChangeText={setPhone}
        value={phone}
        keyboardType="phone-pad" 
        maxLength={10}
        returnKeyType="done"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        autoCapitalize='none'
      />
      <Text style={{color: 'red', textAlign: 'center',}}>
        {errorLogin}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerButton: {
    backgroundColor: '#4169e1', // or any other color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  datePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f8ff', // You can change the color to match your theme
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  button: {
    backgroundColor: '#4169e1', // You can change the color to match your theme
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
