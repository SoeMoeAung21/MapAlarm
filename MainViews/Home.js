import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableHighlight, Animated, AsyncStorage } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
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
    Actions.refresh({onLeft: ()=>this.removeReminder()})
    this.retrieveAllSavedAlarm()
    this.getCurrentLocation()
    this.userLocationChange()



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
        console.log('******* Stores ********');
        console.log(stores);
        console.log('***************');

        stores.map((result, i, store) => {

          var key = store[i][0];
          var value = JSON.parse(store[i][1])
          value.markerImage = testImage
          tempArray.push(value)
        });



        service.setState({
          allReminders : tempArray.slice()

        })
        console.log('******* allReminders ********');
        console.log(this.state.allReminders);
        console.log('***************');
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
      console.log('-----------Position------------');
      console.log(position);
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
        console.log('===============PPPPPPPPP===============');
        console.log(position);
        this.checkingPosition()
      },
      (error)=>this.setState({
          error: error.message
      })
    )

  }

  checkingPosition(){

    this.state.allReminders.map((item)=>{

      if(item.latitude-0.0005 < this.state.changingLatitude < item.latitude+0.0005 && item.longitude-0.0005 < this.state.changingLongitude < item.longitude+0.0005){
        alert('Welldone!')
        navigator.geolocation.clearWatch(this.watchId);
      }else{
        navigator.geolocation.clearWatch(this.watchId);
      }

      console.log('|||||||||||||||item|||||||||||||||');
      console.log(item);

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

      console.log('******* no. of TEMPNOTE ******');
      console.log(TEMPNOTE.length);
      console.log('******* no. of remainders******');

      this.setState({
        allReminders: TEMPNOTE.slice(),
        buttonHeight: 0,
        alreadyShowNewMarker: false
      })
      Actions.refresh({rightTitle: '+'})
      Actions.refresh({leftTitle: 'Remove'})

    }
  }



  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.mapRegion}
          onRegionChange={(region)=>this.setState({mapRegion: region})}
          style={{flex: 1}}
          zoomEnabled={true}
          pitchEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
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
          onLongPress={()=>this.editMarker(marker)}
          coordinate={{latitude: marker.latitude,longitude: marker.longitude}}
          title={marker.title ? marker.title : 'Hello'}
          description={marker.description}
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

  editMarker(marker){
    Actions.editMarker({item: marker})
  }

  comfirmingLocation(){
    Actions.addAlarm({location : this.state.markerPosition, refreshMapView : () => this.refreshMapView()})
  }

  removeReminder(){
    alert('aaa')
  }


}
