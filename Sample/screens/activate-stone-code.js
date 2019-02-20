import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';

import { Stone } from 'react-native-stone';

class ActivateStoneCodeScreen extends Component {
  static navigationOptions = {
    title: 'Ativar stonecode',
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorMessage: null,
      stoneCode: '',
    };
  }

  async activateStoneCode() {
    const { navigation } = this.props;
    const { stoneCode } = this.state;

    this.setState({ loading: true });
    try {
      await Stone.activate(stoneCode);
      this.setState({ loading: false, errorMessage: null });

      navigation.navigate('Transaction', { stoneCode });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false, errorMessage: err.message || err.name });
    }
  }

  render() {
    const { loading, errorMessage } = this.state;
    return (
      <View style={{ padding: 8 }}>
        <TextInput
          placeholder="Digite o stonecode"
          onChangeText={stoneCode => this.setState({ stoneCode })}
          defaultValue="123462486"
        />
        <Button
          title={loading ? 'Ativando...' : 'Ativar'}
          onPress={() => this.activateStoneCode()}
          loading
        />
        {errorMessage && <Text>ERRO: {errorMessage}</Text>}
      </View>
    );
  }
}

export default ActivateStoneCodeScreen;
