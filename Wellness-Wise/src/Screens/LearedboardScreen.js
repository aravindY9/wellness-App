import React from 'react';
import { StyleSheet, View, FlatList, ImageBackground } from 'react-native';
import LeaderboardItem from '../Components/LeaderboardItem';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { readUsersInfo } from '../services/db.js';


const LeaderboardScreen = () => {
  const [usersData, setUsersData] = useState(null);
    useFocusEffect(
      React.useCallback(() => {
        fillUsersInfo();
        return () => {
        };
      }, [])
    );
    
    const fillUsersInfo = async () =>{
      const data = await readUsersInfo();
      data.sort((a, b) => {
        return b.score - a.score;
      });
      setUsersData(data);
    }

  
  return (
    <ImageBackground
        source={require('../Images/background.jpg')} // Update with the correct path
        style={styles.backgroundImage}
    > 
    {usersData && 
        <View style={styles.container}>
            <FlatList
                data={usersData}
                renderItem={LeaderboardItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    }
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
});

export default LeaderboardScreen;
