import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Slider, Switch, TextInput, Button, Dimensions } from 'react-native';
var device = Dimensions.get('window');

const styles = StyleSheet.create({
container: {
  flex: 1,
  width: device.width,
  height: device.height,
  backgroundColor: 'red',
},
buttonViewStyle:{
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#07575b',
  width: device.width - 80,
  alignSelf: 'center',
  //borderWidth: 1,
  borderRadius: 10,
  shadowOffset:{  width: 10,  height: 5},
  shadowColor: '#555555',
  shadowOpacity: 0.5,
  marginTop: device.height - 160,
  position: 'absolute'
},
buttonTextStyle:{
  fontSize: 16,
  fontWeight: 'bold',
  color: '#c4dfe6',
}

});

export default styles;
