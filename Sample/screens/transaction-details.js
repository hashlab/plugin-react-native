import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import { Stone } from 'react-native-stone';

class TransactionDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Histórico de transações',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;
    const transaction = navigation.getParam('transaction', null);
    if(!transaction) {
      return null
    }

    const {
      mposId,
      amount,
      status,
      initiatorKey,
      rcptTrx,
      cardHolder,
      cardNumber,
      cardBrand,
      authorizationCode,
      sak,
    } = transaction

    return (
      <View>
        <View style={{ padding: 8}}>
          <Text>mposId: {mposId}</Text>
          <Text>status: {status}</Text>
          <Text>amount: {amount}</Text>
          <Text>initiatorKey: {initiatorKey}</Text>
          <Text>rcptTrx: {rcptTrx}</Text>
          <Text>cardHolder: {cardHolder}</Text>
          <Text>cardNumber: {cardNumber}</Text>
          <Text>cardBrand: {cardBrand}</Text>
          <Text>authorizationCode: {authorizationCode}</Text>
          <Text>SAK: {sak}</Text>
        </View>

        <Button title="Cancelar" />
      </View>
    );
  }
}

export default TransactionDetailsScreen;
