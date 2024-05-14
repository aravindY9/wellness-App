import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { loginUser } from '../services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const LoginScreen = ({ navigation }) => {
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);


  const handleLogin = async () => {
    const user = await loginUser(email, password);
    if(user == null){
      setLoginError(true);
      console.log("login error: " + loginError);
    }else{
      setLoginError(false);
      console.log("login error: " + loginError);
    }
  };

  // new gpt code:
  useEffect(() => {
    const auth = getAuth();
    // runs when user changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeD' }],
        });
      }
    });
    console.log("I am inside USEEFFECT!!! Login Screen");

    // Clean-up function
    return () => unsubscribe();

  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wellness Wise</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize='none'
        secureTextEntry
      />
      {loginError ? <Text style={{color: 'red', textAlign: 'center',}}>Incorrect User Id or Password</Text> : <></>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupText}>New User? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupText: {
    color: 'blue',
    marginTop: 20,
  },
});

export default LoginScreen;