import { collection, getFirestore, getDocs, doc, updateDoc, arrayUnion, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const db = getFirestore();

async function writeUserInfo(userData){
    try {
        const user = getAuth().currentUser;
        userData = {
            ... userData,
            score: 0
        };
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, userData);
        console.log("Document written with ID: ", userDocRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

async function readUsersInfo(){
    try{
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map((doc)=>{
            return {
                "uid": doc.id,
                ...doc.data()
            };
        })
    }catch(e) {
        console.error("Error reading document: ", e);
    }
}

const getCurrentDate = () => {
    const currentDate = new Date();
  
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

const getUserInfo = async () => {
    try {
        const user = getAuth().currentUser;
        const docRef = doc(db, "users", user.uid); // Reference to the document

        // Fetch the document snapshot
        const docSnapshot = await getDoc(docRef);
    
        if (docSnapshot.exists()) {
          // Extract the document data
          const documentData = docSnapshot.data();
          console.log('Document data:', documentData);
          return documentData;
        } else {
          console.log('Document not found!');
          return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateUserProfile = async (updatedData) =>{
    try {
        const user = getAuth().currentUser;

        // Update document with new data using dot notation for nested fields
        const docRef = doc(db, "users", user.uid); // Reference to the document

        await updateDoc(docRef, {
            ...updatedData
        });

        console.log('User info updated!');
    } catch (error) {
        console.error('Error updating map field: ', error);
    }
}


// Add dataByDate
// Save User Data
const saveUserDataByDate = async (date, eventData) => {
    try {
        const user = getAuth().currentUser;
        const userRef = doc(db, 'users', user.uid);
        const dateDocRef = doc(userRef, 'dataByDate', date);
        console.log(eventData);

        // Set document data within the dataByDate subcollection
        await setDoc(dateDocRef, eventData, { merge: true });

        console.log(`User data saved for date ${date}`);
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

// Check if document exists and get data
const getUserDateDoc = async (date) => {
    try {
        const user = getAuth().currentUser;
        const userRef = doc(db, 'users', user.uid);
        const docRef = doc(userRef, "dataByDate", date); // Reference to the document

        // Fetch the document snapshot
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const documentData = docSnapshot.data();
            console.log('Document exists!');
            return documentData;
        } else {
            console.log('Document does not exist.');
            return null;
        }
    } catch (error) {
        console.error('Error checking document existence:', error);
        return null;
    }
};

// Function to query user data for a specific date range
const queryUserDataByDateRange = async (startDate, endDate) => {
    try {
        const user = getAuth().currentUser;
        const userRef = doc(db, 'users', user.uid);
        const dataQuery = query(
        collection(userRef, 'dataByDate'),
            where('date', '>=', startDate),
            where('date', '<=', endDate),
            orderBy('date', 'asc')
        );

        const querySnapshot = await getDocs(dataQuery);
        const userData = [];

        querySnapshot.forEach((doc) => {
        userData.push({
            date: doc.id,
            ...doc.data()
        });
        });

        console.log('User data for date range:', userData);
        return userData;
    } catch (error) {
        console.error('Error querying user data:', error);
        return [];
    }
};

// Function to query user data for a specific date range
const getAllDatesData = async () => {
    try {
        const user = getAuth().currentUser;
        const userRef = doc(db, 'users', user.uid);
        const querySnapshot = await getDocs(collection(userRef, "dataByDate"));
        return querySnapshot.docs.map((doc)=>{
            return {
                "date": doc.id,
                "data": doc.data(),
            };
        })
    } catch (error) {
        console.error('Error querying user data:', error);
        return [];
    }
};

const deleteUserData = async (user_uid) => {
    try {
        const userRef = doc(db, 'users', user_uid);
        await deleteDoc(userRef);
    } catch (error) {
        console.error('Error querying user data:', error);
        return [];
    }
}

export{
    writeUserInfo,
    readUsersInfo,
    getUserInfo,
    updateUserProfile,
    saveUserDataByDate,
    getUserDateDoc,
    queryUserDataByDateRange,
    getAllDatesData,
    deleteUserData
}