import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableHighlight, Alert, AsyncStorage } from 'react-native';
import {Router, Scene, Actions, Modal, Lightbox} from 'react-native-router-flux';
import Label from '../Components/Label'
import MyButton from '../Components/MyButton'
var device = Dimensions.get('window');


export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state ={

      item : this.props.item

    }

  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.closeButtonStyle} onPress={()=>this.lightboxCloseButton()} underlayColor='transparent'>
          <View>
            <Text style={{color: 'blue'}}>Close</Text>
          </View>
        </TouchableHighlight>

        <Label title={'Title'} text={this.state.item.title} pressLabel={()=> this.examplePressFunction()}/>
        <Label title = {'Description'} text={this.state.item.description} />
        <Label title = {'Street'} text={this.state.item.address[0].streetName ? this.state.item.address[0].streetName : '- - -'}/>
        <Label title = {'Area'} text={this.state.item.address[0].adminArea}/>
        <Label title = {'Country'} text = {this.state.item.address[0].country}/>

        <MyButton customBtnStyle={{alignSelf: 'center'}} text={'Remove Marker'} pressButton={()=> this.removeMarker()}/>

      </View>
    );
  }

  // <View style={{padding: 10, flexDirection : 'row'}}>
  //   <Text style={styles.labelStyle}>Street : </Text> <Text>{this.state.item.address[0].streetName}</Text>
  // </View>
  // <View style={{padding: 10, flexDirection : 'row'}}>
  //   <Text style={styles.labelStyle}>Area : </Text> <Text>{this.state.item.address[0].adminArea}</Text>
  // </View>
  // <View style={{padding: 10, flexDirection : 'row'}}>
  //   <Text style={styles.labelStyle}>Country : </Text> <Text>{this.state.item.address[0].country}</Text>
  // </View>

  lightboxCloseButton(){
    Actions.pop()
  }

  examplePressFunction (){
    alert('Hello')
  }

  removeMarker(){

    Alert.alert(
      'Notice',
      'Are u sure to remove marker?',
      [
      {text: 'Okay', onPress: () => {this.removeItem(this.state.item);}},
      { cancelable: true, text: 'Cancel', onpress: ()=>{} }
      ],
    )
  }

  removeItem(item){

    AsyncStorage.removeItem(item.keyId, () => {
      this.props.refreshMapView()
      Actions.pop()
    });

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
    marginTop: 40,
  },
  closeButtonStyle:{
    alignItems: 'flex-end',
    justifyContent:'center',
    marginRight: 5,
    marginTop: 5
  },


});
