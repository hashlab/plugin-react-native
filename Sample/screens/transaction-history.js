import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';

import { Stone } from 'react-native-stone';
import TransactionList from '../components/transaction-list';

class TransactionHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Histórico de transações',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;

    return (
      <View>
        <TransactionList
          onTransactionSelected={ transaction => {
            navigation.navigate('TransactionDetails', { transaction })
          }
          }
         />
      </View>
    );
  }
}

export default TransactionHistoryScreen;
