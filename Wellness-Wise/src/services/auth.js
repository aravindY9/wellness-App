import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, initializeAuth, getReactNativePersistence, deleteUser } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
  

async function registerUser(email, password){
    var user = null;
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
    }catch(error){
        console.log(error.message);
    }
    return user;
}

async function loginUser(email, password){
    var user = null;
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
    }catch(error){
        console.log(error.message);
    }
    return user;
}

async function signOutUser(){
    await signOut(auth);
}

async function deleteCurrentUser(){
    try{
        const user = auth.currentUser;
        await deleteUser(user);
    }catch(error){
        console.log(error.message);
    }
}

export{
    auth, 
    registerUser,
    loginUser,
    signOutUser,
    deleteCurrentUser
};