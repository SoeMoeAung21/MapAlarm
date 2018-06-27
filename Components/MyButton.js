import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableHighlight, Alert, AsyncStorage } from 'react-native';
import {Router, Scene, Actions, Modal, Lightbox} from 'react-native-router-flux';
var device = Dimensions.get('window');


export default class Label extends React.Component{

  constructor(props){
    super(props);
    this.state ={

      buttonText : this.props.text,
      customBtnStyle: this.props.customBtnStyle,

    }

  }


  render() {
    return (
      <TouchableHighlight onPress={()=>this.props.pressButton()} underlayColor='transparent'>
        <View style={this.state.customBtnStyle}>
          <Text style={[styles.buttonStyle,{color: 'red'}]}>{this.state.buttonText}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}//end of class

const styles = StyleSheet.create({

  buttonStyle:{
    width: 120,

  },
});
