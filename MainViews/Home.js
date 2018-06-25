import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableHighlight, Animated, AsyncStorage, PushNotificationIOS } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import PushNotification from 'react-native-push-notification';

import App from '../App.js'

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
      changingLatitude: null,
      changingLongitude: null,
      error: null,
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



    this.retrieveAllSavedAlarm()
    this.getCurrentLocation()
    this.notification()

    Sound.setCategory('Playback')

    this.whoosh = new Sound(testSound[1], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());
    });

  }


  retrieveAllSavedAlarm(){
    var tempArray =[];
    var service = this
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {

        stores.map((result, i, store) => {

          var key = store[i][0];
          var value = JSON.parse(store[i][1])
          value.markerImage = testImage
          tempArray.push(value)
        });

        service.setState({
          allReminders : tempArray.slice()

        })
        this.userLocationChange()
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

      this.whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          this.soundAudio()
        } else {
          console.log('playback failed due to audio decoding errors');

          this.whoosh.reset();
        }
      });

  }

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        currentPosition: position,
        mapRegion : {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0099,
          longitudeDelta: 0.0055,
        }
      });

      }, (error) => {
        alert(JSON.stringify(error))
      }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000
    });
  }

  userLocationChange(){
    this.watchID = navigator.geolocation.watchPosition(
      (position)=>{

        this.setState({
          changingLatitude: position.coords.latitude,
          changingLongitude: position.coords.longitude,
          error: null,
        })

        this.localNotification()
        this.checkingPosition()
      },
      (error)=>this.setState({
          error: error.message
      })
    )

  }

  localNotification(){
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 3, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //  date: new Date(Date.now() + (3 * 1000)) // in 60 secs
    });
  }

  notification(){
    PushNotification.configure({


    onRegister: function(token) {
        console.log( 'TOKEN:', token );
    },


    onNotification: function(notification) {

        alert(notification.message)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    senderID: "YOUR GCM SENDER ID",


    permissions: {
        alert: true,
        badge: true,
        sound: true
    },


    popInitialNotification: true,


    requestPermissions: true,
  });

  }


  checkingPosition(){

    this.state.allReminders.map((item)=>{

      if((item.latitude-0.0007 < this.state.changingLatitude && this.state.changingLatitude < item.latitude+0.0007)  && (item.longitude-0.0007 < this.state.changingLongitude && this.state.changingLongitude < item.longitude+0.0007)){
        alert('Welldone!')
        navigator.geolocation.clearWatch(this.watchId);
      }else{
        navigator.geolocation.clearWatch(this.watchId);
      }
    })
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
      Animated.timing(
        this.state.opacityValue,
        {
          toValue: 1,
          duration: 1000,
        }
      ).start();
      Actions.refresh({rightTitle: 'Cancel'})
      Actions.refresh({leftTitle: null})
    }else{

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
          region={this.state.mapRegion}
          style={{flex: 1}}
          zoomEnabled={true}
          pitchEnabled={true}
          showsUserLocation={true}
          scrollEnable={true}
          showsCompass={true}
          showsIndoorLevelPicker={true}
          showsIndoors={true}
          showsMyLocationButton={true}
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
          onCalloutPress={()=>this.editMarker(marker)}
          coordinate={{latitude: marker.latitude,longitude: marker.longitude}}
          title={marker.title ? marker.title : 'Hello'}
          centerOffset={{ x: 0, y: 0 }}
          anchor={{ x: 1, y: 1 }}
          onDragEnd={(e)=> this.changeNewMarkerLocation(e)}
          draggable={marker.isMarkerDraggable}
        />
      )
    }

  )
  }

  changeNewMarkerLocation(e){

    this.setState({
      markerPosition: e.nativeEvent
    })
  }

  editMarker(marker){
    Actions.editMarker({item: marker})
    console.log(marker);
  }

  comfirmingLocation(){
    var passPosition =  this.state.markerPosition ? this.state.markerPosition : { coordinate: { latitude: this.state.currentPosition.coords.latitude, longitude: this.state.currentPosition.coords.longitude }}


    Actions.addAlarm({location : passPosition, refreshMapView : () => this.refreshMapView()})
  }


}
