import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';




export default class App extends React.Component{
  render() {
    return (
      <View style={styles.viewStyle}>
        
      </View>
    );
  }

}

const styles = StyleSheet.create({
  viewStyle:{
    flex:1,
    backgroundColor:'#F8F6E1'
  }
});
