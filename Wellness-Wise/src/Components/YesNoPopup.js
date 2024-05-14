import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const YesNoPopup = ({ isVisible, message, onYes, onNo }) => {
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>{message}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity style={{ marginRight: 20 }} onPress={onYes}>
            <Text style={{ color: 'blue', fontSize: 16 }}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNo}>
            <Text style={{ color: 'red', fontSize: 16 }}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default YesNoPopup;
