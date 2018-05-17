import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {Router, Scene, Actions, Modal} from 'react-native-router-flux';

import Home from './MainViews/Home';
import AddAlarm from './MainViews/AddAlarm';


export default class App extends React.Component{
  render() {
    return (
      <Router>
      <Modal>
      <Scene key='root' hideNavBar={true}>
        <Scene key='home' hideNavBar={false} initial={true} component={Home} titleStyle={styles.homeTitleStyle} title='Home' onRight={()=>{}} rightTitleStyle={styles.rightTitleStyle} rightTitle='+'
          onLeft={()=>{}} leftTitleStyle={styles.rightTitleStyle} leftTitle='Edit'/>
      </Scene>
      <Scene key='addAlarm' component={AddAlarm} title='Add Alarm' titleStyle={styles.homeTitleStyle} onRight={()=>{}} rightTitleStyle={styles.rightTitleStyle} rightTitle='Save'
        onLeft={()=>{}} leftTitleStyle={styles.rightTitleStyle} leftTitle='Cancel'/>
      </Modal>
      </Router>
    );
  }

  editFunction(){
    alert('aa')
  }

}//end of class

const styles = StyleSheet.create({
  homeTitleStyle:{

  },
  rightTitleStyle:{
    color: '#2D2D2D',
    fontSize: 18
  }
});
