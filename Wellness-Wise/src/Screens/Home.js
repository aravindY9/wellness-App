import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/drawer-navigator/
import { View, Text, TouchableOpacity, Button, StyleSheet, Icon } from 'react-native'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { 
    createDrawerNavigator,
    DrawerItemList,
    DrawerItem,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import LogoutScreen from './LogoutScreen';
import LeaderboardScreen from './LearedboardScreen';
import TimelineScreen from './TimelineScreen';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigationState, useNavigation, useRoute } from '@react-navigation/native';


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    // const currentRouteName = props.state.routeNames[props.state.index];
    // console.log("Current screen route:", currentRouteName);
    
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

export default function Home( { navigation }) {

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
            // User is signed in.
            setUser(user);
            // fillUserInfo();
            } else {    
            // User is signed out.
            setUser(null);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            }
        });
        console.log("I am inside USEEFFECT!!! HomeScreen");

        // Clean-up function
        return () => unsubscribe();
        }, [user]);
    const [user, setUser] = useState(null);
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ route }) => ({
                headerRight: () => {
                if (route.name === 'Home') {
                    // If the current route is 'Home', show the FontAwesome icon
                    return (
                    <FontAwesome
                        name="user"
                        size={30}
                        color="#FF8D6E"
                        onPress={() => navigation.navigate("Profile")}
                        style={{ marginRight: 20 }}
                    />
                    );
                } else {
                    // If the current route is not 'Home', just show text
                    return (
                        <FontAwesome 
                            name="home" 
                            size={30}   
                            color="#FF8D6E"
                            style={{ marginRight: 20 }}
                            onPress={() => navigation.navigate("Home")}
                        />
                    );
                }
                },
            })}
            drawerStyle={{backgroundColor: 'transparent'}}
            >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name='Leaderboard' component={LeaderboardScreen} />
            <Drawer.Screen name='Timeline' component={TimelineScreen} />
            <Drawer.Screen name='Logout' component={LogoutScreen} />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({

})