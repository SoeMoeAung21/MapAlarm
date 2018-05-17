import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Picker, Dimensions, AsyncStorage, Alert, TabBarIOS } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Sound from 'react-native-sound';
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

export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      selectedSoundName: null,
      titleValue: null,
      descriptionValue: null
    }
    this.selectedSound = null
  }

componentDidMount(){
  Actions.refresh({onRight : () => this.saveAlarm()})
  Actions.refresh({onLeft : ()=>this.cancelAlarm()})
}

  playSelectedSound(soundName){
    Sound.setCategory('Playback')
      // See notes below about preloading sounds within initialization code below.
    this.selectedSound = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      this.soundAudio()
      // loaded successfully
      console.log('duration in seconds: ' + this.selectedSound.getDuration() + 'number of channels: ' + this.selectedSound.getNumberOfChannels());
    });
  }

  soundAudio(){

      // Play the sound with an onEnd callback
      this.selectedSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');

        } else {
          console.log('playback failed due to audio decoding errors');
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
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

  render() {
    return (
      <View style={styles.viewStyle}>
        <TextInput style={styles.titleStyle} value={this.state.titleValue} onChangeText={(text)=>this.setState({titleValue: text})} placeholder='Title'/>
        <TextInput style={styles.descriptionStyle} value={this.state.descriptionValue} onChangeText={(text)=>this.setState({descriptionValue: text})} placeholder='Description'/>
        <Picker
          selectedValue={this.state.selectedSoundName}
          style={{ height: 50, width: device.width - 80 }}
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
    alarmInfo.keyId = 'AlId' + dateId

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
