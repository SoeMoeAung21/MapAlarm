import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
        <Scene key='home' hideNavBar={false} initial={true} component={Home} titleStyle={styles.homeTitleStyle} title='Home' onRight={()=>{}} rightTitleStyle={styles.rightTitleStyle} rightTitle='+'
          onLeft={()=>{}} leftTitleStyle={styles.rightTitleStyle} leftTitle='Remove'/>
      </Scene>
      <Scene key='addAlarm' component={AddAlarm} title='Add Alarm' titleStyle={styles.homeTitleStyle} onRight={()=>{}} rightTitleStyle={styles.rightTitleStyle} rightTitle='Save'
        onLeft={()=>{}} leftTitleStyle={styles.rightTitleStyle} leftTitle='Cancel'/>
      </Modal>
        <Scene key='editMarker' component={EditMarker}/>
      </Lightbox>
      </Router>
    );
  }

  testFunction(){
    alret('hi')
  }


}//end of class

const styles = StyleSheet.create({
  homeTitleStyle:{

  },
  rightTitleStyle:{
    color: '#2D2D2D',
  }
});
