import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import { Stone } from 'react-native-stone';

class TransactionDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Histórico de transações',
  };

  constructor(props) {
    super(props);
    this.cancelTransaction = this.cancelTransaction.bind(this);
  }

  async cancelTransaction() {
    const { navigation } = this.props;
    const transaction = navigation.getParam('transaction', null);
    await Stone.cancelTransaction(`${transaction.mposId}`);
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
      initiatorTransactionKey,
      recipientTransactionIdentification,
      cardHolderName,
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
          <Text>initiatorKey: {initiatorTransactionKey}</Text>
          <Text>rcptTrx: {recipientTransactionIdentification}</Text>
          <Text>cardHolder: {cardHolderName}</Text>
          <Text>cardNumber: {cardNumber}</Text>
          <Text>cardBrand: {cardBrand}</Text>
          <Text>authorizationCode: {authorizationCode}</Text>
          <Text>SAK: {sak}</Text>
        </View>

        <Button title="Cancelar"
          onPress={this.cancelTransaction}
         />
      </View>
    );
  }
}

export default TransactionDetailsScreen;
