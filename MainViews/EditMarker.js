import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableHighlight } from 'react-native';
import {Router, Scene, Actions, Modal, Lightbox} from 'react-native-router-flux';
var device = Dimensions.get('window');


export default class App extends React.Component{
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.embeddedContainer}>
        <TouchableHighlight style={styles.closeButtonStyle} onPress={()=>this.lightboxCloseButton()} underlayColor='transparent'>
          <View>
            <Text>Close</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.removeMarkerStyle} onPress={()=>this.removeMarker()} underlayColor='transparent'>
          <View>
            <Text>Remove</Text>
          </View>
        </TouchableHighlight>
        </View>
        <View>
          <Text>{this.props.title}</Text>
        </View>
      </View>
    );
  }

  lightboxCloseButton(){
    Actions.pop()
  }

  removeMarker(){
    alert('aa')
  }

}//end of class

const styles = StyleSheet.create({
  container:{
    height: device.height * 0.5,
    backgroundColor: '#F8F6E1',
  },
  embeddedContainer:{
    flexDirection: 'row'
  },
  removeMarkerStyle:{
    alignItems: 'flex-start'
  },
  closeButtonStyle:{
    alignItems: 'flex-end',
    justifyContent:'center'
  },


});
