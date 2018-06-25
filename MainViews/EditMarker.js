import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableHighlight, Alert } from 'react-native';
import {Router, Scene, Actions, Modal, Lightbox} from 'react-native-router-flux';
var device = Dimensions.get('window');


export default class App extends React.Component{
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.closeButtonStyle} onPress={()=>this.lightboxCloseButton()} underlayColor='transparent'>
          <View>
            <Text style={{color: 'blue'}}>Close</Text>
          </View>
        </TouchableHighlight>

        <View style={{padding: 10, flexDirection : 'row'}}>
          <Text style={styles.labelStyle}>Title : </Text> <Text>{this.props.item.title}</Text>
        </View>
        <View style={{padding: 10, flexDirection : 'row'}}>
          <Text style={styles.labelStyle}>Description : </Text> <Text >{this.props.item.description}</Text>
        </View>
        <View style={{padding: 10, flexDirection : 'row'}}>
          <Text style={styles.labelStyle}>Street : </Text> <Text>{this.props.item.address[0].streetName}</Text>
        </View>
        <View style={{padding: 10, flexDirection : 'row'}}>
          <Text style={styles.labelStyle}>Area : </Text> <Text>{this.props.item.address[0].adminArea}</Text>
        </View>
        <View style={{padding: 10, flexDirection : 'row'}}>
          <Text style={styles.labelStyle}>Country : </Text> <Text>{this.props.item.address[0].country}</Text>
        </View>
        <TouchableHighlight style={styles.removeMarkerStyle} onPress={()=>this.removeMarker(item)} underlayColor='transparent'>
          <View>
            <Text style={{color: 'red'}}>Remove Marker</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  lightboxCloseButton(){
    Actions.pop()
  }

  removeMarker(item){

    Alert.alert(
      'Notice',
      'Are u sure to remove marker?',
      [
        {text: 'Okay', onPress: () => {this.removeItem(item); Actions.pop();}},
      ],
      { cancelable: true, text: 'Cancel', onpress: ()=>{} }
    )
  }

  removeItem(item){

  }

}//end of class

const styles = StyleSheet.create({
  container:{
    height: device.height * 0.5,
    backgroundColor: '#e2e8e4',
  },
  labelStyle:{
    width: 100,
  },
  removeMarkerStyle:{
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonStyle:{
    alignItems: 'flex-end',
    justifyContent:'center',
    marginRight: 5,
    marginTop: 5
  },


});
