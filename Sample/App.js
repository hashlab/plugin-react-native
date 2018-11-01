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
  Button,
  ActivityIndicator
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

export default class App extends Component {

  getDevices = () => {
    Stone.getDevices().then( response => {
      if (response && response[0]) {
        device = response[0]['name']
      }
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  selectDevice = () => {
    device && Stone.selectDevice(device).then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  deviceIsConnected = () => {
    Stone.deviceIsConnected().then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  deviceDisplay = () => {
    Stone.deviceDisplay("Mensagem!").then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  transaction = () => {
    Stone.transaction("10","CREDIT","ONE_INSTALMENT","Sucesso!", "HASHLAB").then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  cancelTransaction = () => {
    Stone.cancelTransaction("12_12").then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  getTransactions = () => {
    Stone.getTransactions().then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  validate = () => {
    Stone.validation("123462486").then( response => {
      console.log(response)
    }).catch( error => {
      console.log(error)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Get Devices" onPress={this.getDevices.bind(this)} />
        <Button title="Connect Device" onPress={this.selectDevice.bind(this)} />
        <Button title="Device is Connected" onPress={this.deviceIsConnected.bind(this)} />
        <Button title="Display Message" onPress={this.deviceDisplay.bind(this)} />
        <Button title="New Transaction" onPress={this.transaction.bind(this)} />
        <Button title="Cancel Transaction" onPress={this.cancelTransaction.bind(this)} />
        <Button title="Transaction List" onPress={this.getTransactions.bind(this)} />
        <Button title="Validate" onPress={this.validate.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
