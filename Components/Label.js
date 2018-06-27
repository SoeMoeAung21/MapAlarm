import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableHighlight, Alert, AsyncStorage } from 'react-native';
import {Router, Scene, Actions, Modal, Lightbox} from 'react-native-router-flux';
var device = Dimensions.get('window');


export default class Label extends React.Component{

  constructor(props){
    super(props);
    this.state ={

      labelTitle : this.props.title,
      labelText : this.props.text,
      color : this.props.color,

    }

  }


  render() {
    return (
      <TouchableHighlight onPress={()=> this.props.pressLabel()}>
        <View style={{padding: 10, flexDirection : 'row'}}>
          <Text style={[styles.labelStyle, this.state.color ? {backgroundColor: this.state.color} : null]}>{this.state.labelTitle} : </Text> <Text>{this.state.labelText}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}//end of class

const styles = StyleSheet.create({

  labelStyle:{
    width: 120,
    
  },
});
