/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { Stone } from 'react-native-stone';

console.log(Stone);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var device = null;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <Button title="Bluetooth List" onPress={() => {
          Stone.getDevices().then( response => {
            if (response && response[0]) {
              device = response[0]['name']
            }
            console.log(response)
          }).catch( error => {
            console.log(error)
          });
        }} />
        <Button title="Connect Device" onPress={() => {
          device && Stone.selectDevice(device).then( response => {
            console.log(response)
          }).catch( error => {
            console.log(error)
          });
        }} />
        <Button title="Display Message" onPress={() => {
          Stone.deviceDisplay("Mensagem!").then( response => {
            console.log(response)
          }).catch( error => {
            console.log(error)
          });
        }} />
        <Button title="Validate" onPress={() => {
          Stone.validation("123462486").then( response => {
            console.log(response)
          }).catch( error => {
            console.log(error)
          });
        }} />
        <Button title="Transaction List" onPress={() => {
          Stone.getTransactions().then( response => {
            console.log(response)
          }).catch( error => {
            console.log(error)
          });
        }} />
        <Button title="Transaction" onPress={() => {
          Stone.transaction("10","CREDIT","ONE_INSTALMENT","Sucesso!").then( response => {
            console.log(response)
          }).catch( error => {
            console.log(error)
          });
        }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
