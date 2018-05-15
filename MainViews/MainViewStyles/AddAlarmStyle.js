import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Slider, Switch, TextInput, Button, Dimensions } from 'react-native';
var device = Dimensions.get('window');

const styles = StyleSheet.create({
  viewStyle:{
    flex:1,
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
  }
});

export default styles;
