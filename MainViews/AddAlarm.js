import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Picker, Dimensions, AsyncStorage, Alert, TabBarIOS, TouchableHighlight, PushNotificationIOS, KeyboardAvoidingView } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import App from '../App.js'
import Sound from 'react-native-sound';
import Geocoder from 'react-native-geocoder';

var device = Dimensions.get('window');

import styles from './MainViewStyles/AddAlarmStyle';
var testSound =[
  {
    name: 'Good Name',
    fileName: 'ringtone.mp3',
  },
  {
    name: 'Another name',
    fileName: 'ringtone1.mp3'
  },
  {
    name: 'IPhone X ringtone',
    fileName: 'iphone_x.mp3'
  },
  {
    name: 'Samsung Guitar',
    fileName: 'samsung_guitar.mp3'
  }
]

var labelData=[
  {
    key: 1,
    outerBackgroundColor: 'white',
    innerBackgroundColor: '#4E7BCE',
    type: 'Urgent',
    typeColor: 'black'
  },
  {
    key: 2,
    outerBackgroundColor: 'white',
    innerBackgroundColor: 'orange',
    type: 'Important',
    typeColor: 'black'
  },
  {
    key: 3,
    outerBackgroundColor: 'white',
    innerBackgroundColor: 'green',
    type: 'Normal',
    typeColor: 'black'
  }

]


export default class AddAlarm extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      selectedSoundName: null,
      titleValue: null,
      descriptionValue: null,
      selectedLableIndex: 0,
      address: null
    }
    this.selectedSound = null

    this.labelFunction = this.labelFunction.bind(this)
  }

componentDidMount(){
  Actions.refresh({onRight : () => this.saveAlarm()})
  Actions.refresh({onLeft : ()=>this.cancelAlarm()})
  console.log('*************');
  console.log(this.props.location);
  console.log('*************');
  Geocoder.fallbackToGoogle('AIzaSyD7KdCYnDcFxu0Mfu0dxgKP4V6coDFgv4k');
  this.getAddress()



}

  async getAddress() {

    var latTemp = this.props.location.coordinate.latitude
    var longTemp = this.props.location.coordinate.longitude

    var result = await Geocoder.geocodePosition({lat: latTemp, lng: longTemp})
    this.setState({
      address: result
    })
    console.log("++++++++++++++++++++++++++");
    console.log(result);
    console.log("++++++++++++++++++++++++++");
  }

  playSelectedSound(soundName){
    Sound.setCategory('Playback')

    this.selectedSound = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      this.soundAudio()

      console.log('duration in seconds: ' + this.selectedSound.getDuration() + 'number of channels: ' + this.selectedSound.getNumberOfChannels());
    });
  }

  soundAudio(){


      this.selectedSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');

        } else {
          console.log('playback failed due to audio decoding errors');


          this.selectedSound.reset();
        }
      });
    }

    selectingSound(value, index){
      if(this.selectedSound != null){
          this.selectedSound.stop()
      }
      this.setState({selectedSoundName: value})
      this.playSelectedSound(value)
    }

    labelFunction(){
      return labelData.map((item)=>{
        return(
          <View style={styles.leaderView}>
            <TouchableHighlight onPress={()=>this.pickingLabel(item)} underlayColor='transparent'>
            <View style={this.getOuterCircleStyle(item.key)}>
              <View style={[styles.innerView,{backgroundColor: item.innerBackgroundColor}]}>
              </View>
            </View>
            </TouchableHighlight>
            <Text style={this.getTextStyle(item.key)}>{item.type}</Text>
          </View>
        )
      }
      )
    }

    getTextStyle(key){
      var tempTypeColor = 'black'

      if(this.state.selectedLableIndex === key){
        tempTypeColor = 'lightblue'
      }
      return(
        {
          color: tempTypeColor,
          fontSize: 18
        }
      )

    }

    getOuterCircleStyle(key){
      var tempBGC = '#ffffff'
      var tempW = 20
      var tempH = 20

      if(this.state.selectedLableIndex === key){
        tempBGC = '#505050',
        tempW = 25
        tempH = 25

      }
      return(
        {
          borderWidth: 1,
          width: tempW,
          height: tempH,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tempBGC,
        }
      )
    }

    pickingLabel(item){
      this.setState({
        selectedLableIndex: item.key
      })
    }

  render() {
    return (
      <View style={styles.viewStyle}>
      <KeyboardAvoidingView behavior='position'>
        <TextInput style={styles.titleStyle} value={this.state.titleValue} onChangeText={(text)=>this.setState({titleValue: text})} placeholder='Title'/>
        <TextInput multiline={true} style={styles.descriptionStyle} value={this.state.descriptionValue} onChangeText={(text)=>this.setState({descriptionValue: text})} placeholder='Description'/>
        </KeyboardAvoidingView>
        <View style={{alignItems: 'center', flexDirection: 'row', padding: 10}}>
          <Text style={{color: 'white', fontSize: 20,fontFamily: 'Georgia', fontWeight: 'bold', marginRight: 20}}>Label : </Text>
          {this.labelFunction()}
        </View>
        <Picker
          selectedValue={this.state.selectedSoundName}
          style={{ width: device.width - 80}}
          onValueChange={(itemValue, itemIndex) => this.selectingSound(itemValue, itemIndex)}>
        {this.renderPickerItem()}
        </Picker>
      </View>
    );
  }

  renderPickerItem(){
    return testSound.map((item) => {
      return(
        <Picker.Item label={item.name} value={item.fileName} />
      )
    })
  }

  cancelAlarm(){
    Actions.pop()
    if (this.selectedSound === null){

    }else{
    this.selectedSound.stop()
    }
  }

  saveAlarm(){

    var dateId = new Date().valueOf();
    var alarmInfo = {}
    alarmInfo.title = this.state.titleValue
    alarmInfo.description = this.state.descriptionValue
    alarmInfo.latitude = this.props.location.coordinate.latitude
    alarmInfo.longitude = this.props.location.coordinate.longitude
    alarmInfo.isMarkerDraggable = false
    alarmInfo.address = this.state.address
    alarmInfo.keyId = 'AlId' + dateId
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(alarmInfo);
    if (this.selectedSound === null){

    }else{
      this.selectedSound.stop()
    }


    AsyncStorage.setItem('AlId' + dateId, JSON.stringify(alarmInfo), () => {

      Alert.alert(
        'Saved',
        'Your alarm is successfully saved.',
        [
          {text: 'Okay', onPress: () => {this.props.refreshMapView(); Actions.pop() }},
        ],
        { cancelable: false }
      )

    });
    console.log("*************");
    console.log(this.props.location);

  }

}//end of class
