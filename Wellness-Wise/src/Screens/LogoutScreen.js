import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { signOutUser } from '../services/auth';

export default function LogoutScreen() {
    useEffect(() => {
        signOutUser();
    }, [])

    return (
        <View>
        <Text>LogoutScreen</Text>
        </View>
    )
}