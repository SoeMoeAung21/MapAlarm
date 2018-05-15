import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableHighlight, Animated} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Sound from 'react-native-sound';
import RNAlarm from 'react-native-alarm';
import styles from './MainViewStyles/HomeStyle';

var testSound =['ringtone.mp3', 'ringtone1.mp3']
var testImage = require('../Images/flag-pink.png')
var newImage = require('../Images/new-flag.png')

TEMPNOTE = [
  {
    title: 'To buy food',
    latitude: 16.866624,
    longitude: 96.193951,
    markerImage: testImage,
    isMarkerDraggable : false
  },
  {
    title: 'To buy drink',
    latitude: 16.868024,
    longitude: 96.193951,
    markerImage: testImage,
    isMarkerDraggable : false
  }
]

export default class Home extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      allReminders : TEMPNOTE,
      currentPosition: null,
      mapRegion: {
                    latitude: 16.868024,
                    longitude: 96.19395,
                    latitudeDelta: 1,
                    longitudeDelta: 1
                  },
      buttonHeight: 0,
      opacityValue: new Animated.Value(0),
      alreadyShowNewMarker: false
    }
  this.whoosh = null
  }

  componentDidMount(){
    Actions.refresh({onRight : () => this.addNewReminder()})
    Actions.refresh({onLeft: ()=>this.editOldReminder()})
    this.getCurrentLocation()

    Sound.setCategory('Playback')
      // See notes below about preloading sounds within initialization code below.
    this.whoosh = new Sound(testSound[1], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      this.soundAudio()
      // loaded successfully
      console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());
    });


    //test area
    // let  d=new Date().getTime();
    // d = d + 5 * 1000;   /* will alarm 5min later */
    // RNAlarm.setAlarm(d + '',
    //   'TEST ALARM',
    //   '',
    //   '',
    //   () => {
    //     console.log('Success');
    //   },
    //   () => {
    //     console.log('Fail');
    //   });
  }

  soundAudio(){

      // Play the sound with an onEnd callback
      this.whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          this.soundAudio()
        } else {
          console.log('playback failed due to audio decoding errors');
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          this.whoosh.reset();
        }
      });

  }

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        currentPosition: position,
        mapRegion : {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1
        }
      });
      console.log(position);
      }, (error) => {
        alert(JSON.stringify(error))
      }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000
    });
  }

  addNewReminder(){
    this.whoosh.stop()
    if(!this.state.alreadyShowNewMarker){
      var tempObj = {
        title: 'New',
        latitude: this.state.currentPosition.coords.latitude,
        longitude: this.state.currentPosition.coords.longitude,
        markerImage: newImage,
        isMarkerDraggable : true
      }

      TEMPNOTE.push(tempObj)
      this.setState({
        allReminders: TEMPNOTE,
        buttonHeight: 40,
        alreadyShowNewMarker: true
      })

      console.log(TEMPNOTE);

      Animated.timing(                  // Animate over time
        this.state.opacityValue,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 1000,              // Make it take a while
        }
      ).start();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{flex: 1}}
          zoomEnabled={true}
          pitchEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          scrollEnable={true}
          showsCompass={true}
          showsIndoorLevelPicker={true}
          showsIndoors={true}
        >
        {this.renderMarkers()}

        </MapView>
        <TouchableHighlight style={[styles.buttonViewStyle,{height: this.state.buttonHeight}]} onPress={()=>this.comfirmingLocation()} underlayColor="transparent">
          <Animated.View >
            <Text style={styles.buttonTextStyle}>Add</Text>
          </Animated.View>
        </TouchableHighlight>
      </View>
    );
  }

  renderMarkers() {
    return this.state.allReminders.map((marker) => {
      return(
        <Marker
          coordinate={{latitude: marker.latitude,longitude: marker.longitude}}
          title={marker.title}
          description={"hello "}
          centerOffset={{ x: 0, y: 0 }}
          anchor={{ x: 1, y: 1 }}
          image={marker.markerImage}
          draggable={marker.isMarkerDraggable}
        />
      )
    }

  )
  }

  comfirmingLocation(){
    Actions.addAlarm()
  }

  editOldReminder(){
    Actions.addAlarm({title: 'Edit Alarm'})
  }


}
