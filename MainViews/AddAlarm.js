import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Picker, Dimensions } from 'react-native';
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
  }
]

export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      selectedSoundName: null,
      textInputTitleValue: null,
      textInputDecValue: null
    }
    this.selectedSound = null
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
        <TextInput style={styles.titleStyle} value={this.state.textInputValue} placeholder='  Title'/>
        <TextInput style={styles.descriptionStyle} value={this.state.textInputDecValue} placeholder='  Description'/>
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

}
