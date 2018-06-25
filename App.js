import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, PushNotificationIOS } from 'react-native';
import {Router, Scene, Actions, Modal, Lightbox} from 'react-native-router-flux';

import Home from './MainViews/Home';
import AddAlarm from './MainViews/AddAlarm';
import EditMarker from './MainViews/EditMarker';


export default class App extends React.Component{
  render() {
    return (
      <Router>
      <Lightbox>
      <Modal>
      <Scene key='root' hideNavBar={true}>
        <Scene key='home' hideNavBar={false} initial={true}   component={Home} titleStyle={styles.homeTitleStyle} title='Map Alarm' onRight={()=>{}} rightTitleStyle={styles.rightTitleStyle} rightTitle='+'
         />
      </Scene>
      <Scene key='addAlarm' component={AddAlarm} title='Add Alarm' navigationBarStyle={styles.navBarStyle} titleStyle={styles.addAlarmTitleStyle} onRight={()=>{}} rightTitleStyle={styles.rightTitleStyle} rightTitle='Save'
        onLeft={()=>{}} leftTitleStyle={styles.rightTitleStyle} leftTitle='Cancel'/>
      </Modal>
      <Scene key='editMarker' component={EditMarker}/>
      </Lightbox>
      </Router>
    );
  }



}//end of class

const styles = StyleSheet.create({
  navBarStyle:{
    backgroundColor: '#003b46',

  },
  homeTitleStyle:{
    fontFamily: 'Georgia',
    color: '#003b46',
    fontWeight: 'bold',
    textShadowOffset: {width: 5, height: 5},
    textShadowColor: 'black',
    textShadowRadius: 10
  },
  addAlarmTitleStyle:{
      fontFamily: 'Georgia',
      color: 'white',
      textShadowOffset: {width: 5, height: 5},
      textShadowColor: 'white',
      textShadowRadius: 10
  },
  rightTitleStyle:{

  }
});
