import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableHighlight, Animated, AsyncStorage } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Sound from 'react-native-sound';
import RNAlarm from 'react-native-alarm';
import styles from './MainViewStyles/HomeStyle';

var testSound =['ringtone.mp3', 'ringtone1.mp3']
var testImage = require('../Images/flag-pink.png')
var newImage = require('../Images/new-flag.png')

var TEMPNOTE = []

export default class Home extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      allReminders : [],
      currentPosition: null,
      markerPosition: null,
      buttonHeight: 0,
      opacityValue: new Animated.Value(0),
      alreadyShowNewMarker: false
    }
  this.whoosh = null
  }

  componentDidMount(){
    Actions.refresh({onRight : () => this.addNewReminder()})
    Actions.refresh({onLeft: ()=>this.editOldReminder()})
    this.retrieveAllSavedAlarm()
    this.getCurrentLocation()


    Sound.setCategory('Playback')
      // See notes below about preloading sounds within initialization code below.
    this.whoosh = new Sound(testSound[1], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }


      // loaded successfully
      console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());
    });

  }

  retrieveAllSavedAlarm(){
    var tempArray =[];
    var service = this
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        console.log('***************');
        console.log(stores);
        console.log('***************');

        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          var key = store[i][0];
          var value = JSON.parse(store[i][1])
          value.markerImage = testImage
          tempArray.push(value)
        });

        console.log('******* tempArray ********');
        console.log(tempArray.length);
        console.log('***************');

        service.setState({
          allReminders : tempArray.slice()
        })
        TEMPNOTE = tempArray.slice();
      });
    });

  }

  refreshMapView(){
    this.setState({
      allReminders : [],
      buttonHeight: 0,
      opacityValue: new Animated.Value(0),
      alreadyShowNewMarker: false
    })

    this.retrieveAllSavedAlarm()
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

      var tempReminder = this.state.allReminders
      tempReminder.push(tempObj)

      this.setState({
        allReminders: tempReminder,
        buttonHeight: 40,
        alreadyShowNewMarker: true
      })
      Animated.timing(                  // Animate over time
        this.state.opacityValue,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 1000,              // Make it take a while
        }
      ).start();
      Actions.refresh({rightTitle: 'Cancel'})
    }else{

      console.log('******* no. of TEMPNOTE ******');
      console.log(TEMPNOTE.length);
      console.log('******* no. of remainders******');

      this.setState({
        allReminders: TEMPNOTE.slice(),
        buttonHeight: 0,
        alreadyShowNewMarker: false
      })
      Actions.refresh({rightTitle: '+'})

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
    console.log('******* no. of remainders******');
    console.log(this.state.allReminders.length);
    console.log('******* no. of remainders******');

    return this.state.allReminders.map((marker) => {

      return(
        <Marker
          coordinate={{latitude: marker.latitude,longitude: marker.longitude}}
          title={marker.title ? marker.title : 'Hello'}
          description={marker.description}
          centerOffset={{ x: 0, y: 0 }}
          anchor={{ x: 1, y: 1 }}
          onDragEnd={(e)=> this.changeNewMarkerLocation(e)}
          image={marker.markerImage}
          draggable={marker.isMarkerDraggable}
        />
      )
    }

  )
  }

  changeNewMarkerLocation(e){

    console.log('*********currentPosition*******');
    console.log(this.state.currentPosition);
    console.log('******************************');

    console.log('******** NativeEvent ********');
    console.log(e.nativeEvent);
    console.log('******** END **********');
    this.setState({
      markerPosition: e.nativeEvent
    })
  }

  comfirmingLocation(){
    Actions.addAlarm({location : this.state.markerPosition, refreshMapView : () => this.refreshMapView()})
  }

  editOldReminder(){
    Actions.addAlarm({title: 'Edit Alarm'})
  }


}
