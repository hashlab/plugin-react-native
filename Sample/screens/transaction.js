import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';

import { Stone } from 'react-native-stone';
import DevicePicker from '../components/device-picker';
import TransactionSender from '../components/transaction-sender';

class TransactionScreen extends Component {
  static navigationOptions = {
    title: 'Enviar transação',
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      selectedDevice: null,
      connectingToDevice: false,
      connectedDevice: null,
    };
    this.onDeviceSelected = this.onDeviceSelected.bind(this);
    this.connectToDevice = this.connectToDevice.bind(this);
    this.fetchAndSetConnectedDevice = this.fetchAndSetConnectedDevice.bind(this);
  }

  componentDidMount() {
    this.fetchAndSetConnectedDevice();
  }

  onDeviceSelected(device) {
    this.setState({ selectedDevice: device });
  }

  async fetchAndSetConnectedDevice() {
    await Stone.setEnvironment(Stone.environment.PRODUCTION);
    const connectedDevice = await Stone.getConnectedDevice();
    this.setState({ connectedDevice });
  }

  async connectToDevice() {
    const { selectedDevice } = this.state;
    this.setState({ connectingToDevice: true });

    try {
      await Stone.connectDevice(selectedDevice);
      this.setState({ connectingToDevice: false });
      await this.fetchAndSetConnectedDevice();
    } catch (err) {
      this.setState({
        connectingToDevice: false,
        errorMessage: err.message,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const { selectedDevice, connectingToDevice, connectedDevice, errorMessage } = this.state;

    let connectButtonTitle = 'Conectar';
    if (connectingToDevice) {
      connectButtonTitle = 'Conectando...';
    } else if (connectedDevice) {
      connectButtonTitle = 'Conectado';
    }

    return (
      <View style={{ padding: 8 }}>
        <Text>1. Conecte ao pinpad</Text>
        <DevicePicker
          onDeviceSelected={this.onDeviceSelected} />
        <Button
          loading={connectingToDevice}
          onPress={this.connectToDevice}
          title={connectButtonTitle}
          color={connectedDevice && '#00FF00'}
        />

        <Text>2. Digite o valor em centavos</Text>
        <TransactionSender />

        <Button onPress={() => navigation.navigate('TransactionHistory')} title="Ver histórico" />

        <Text>{errorMessage}</Text>
      </View>
    );
  }
}

export default TransactionScreen;
