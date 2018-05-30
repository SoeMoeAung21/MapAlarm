import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Slider, Switch, TextInput, Button, Dimensions } from 'react-native';
var device = Dimensions.get('window');

const styles = StyleSheet.create({
  viewStyle:{
    top: 50,
    height: device.height -50,
    width: device.width,
    //flex:1,
    backgroundColor:'#F8F6E1',
    alignItems: 'center',

  },
  titleStyle:{
    height: 30,
    width: device.width - 100,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10
  },
  descriptionStyle:{
    height: 100,
    width: device.width -100,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10
  },
  leaderView:{
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  outerView: {
    borderWidth: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerView:{
    borderRadius: 5,
    width: 10,
    height: 10,
    borderWidth: 1
  }
});

export default styles;
