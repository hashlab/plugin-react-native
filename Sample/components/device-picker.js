import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'react-native';
import { Stone } from 'react-native-stone';

class DevicePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: null,
    };
    this.updateDevices = this.updateDevices.bind(this);
  }

  componentDidMount() {
    this.updateDevices();
  }

  async updateDevices() {
    const { selectedDevice } = this.state;
    const devices = await Stone.getPairedBluetoothDevices();

    if (!selectedDevice && devices.length > 0) {
      this.setState({ devices, selectedDevice: devices[0] });
      const { onDeviceSelected } = this.props;
      onDeviceSelected(devices[0]);
    } else {
      this.setState({ devices });
    }
  }

  render() {
    const { devices, selectedDevice } = this.state;

    return (
      <Picker
        selectedValue={selectedDevice}
        onValueChange={d => this.setState({ selectedDevice: d })}
      >
        {devices.map(device => (
          <Picker.Item key={device.name} label={device.name} value={device} />
        ))}
      </Picker>
    );
  }
}

DevicePicker.propTypes = {
  onDeviceSelected: PropTypes.func.isRequired,
};

export default DevicePicker;
