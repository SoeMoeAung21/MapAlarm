import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

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

export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      allReminders : TEMPNOTE
    }
  }

  componentDidMount(){
    Actions.refresh({onRight : () => this.addNewReminder()})
    this.getCurrentLocation()
  }

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
      //this.setState({position: {longitude: position.longitude, latitude: position.latitude}});
      console.log(position);
      }, (error) => {
        alert(JSON.stringify(error))
      }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
    });
  }

  addNewReminder(){
    var tempObj = {
      title: 'New',
      latitude: 16.867624,
      longitude: 96.193951,
      markerImage: newImage,
      isMarkerDraggable : true
    }

    TEMPNOTE.push(tempObj)
    this.setState({
      allReminders: TEMPNOTE
    })
  }

  render() {
    return (
      <MapView
         
         style={{flex: 1}}
         zoomEnabled={true}
         pitchEnabled={true}
         showsUserLocation={true}
         followsUserLocation={true}
         showsCompass={true}
         showsBuildings={true}
         showsIndoors={true}
         //latitudeDelta: currentLat * 0.01,
         //longitudeDelta: currentLong * 0.01,

      >
      {this.renderMarkers()}
      </MapView>
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

}

const styles = StyleSheet.create({

});
