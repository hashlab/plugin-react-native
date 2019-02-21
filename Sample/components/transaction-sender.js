import React, { Component } from 'react';
import { Text, TextInput, View, Button, Picker } from 'react-native';

import { Stone } from 'react-native-stone';

class TransactionSender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: {
        amountInCents: '10',
        method: Stone.transactionMethod.CREDIT,
        instalments: Stone.transactionInstalment.ONE_INSTALMENT,
        successMessage: 'Transação enviada',
        shortName: 'Hash',
      },
      sendingTransaction: false,
      errorMessage: null,
    };

    this.sendTransaction = this.sendTransaction.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
  }

  async sendTransaction() {
    const { transaction } = this.state;
    const { amountInCents, method, instalments, successMessage, shortName } = transaction;

    console.log('Sending transaction', transaction);
    this.setState({ sendingTransaction: true });
    try {
      await Stone.sendTransaction(
        {
          amountInCents,
          method,
          instalments,
          successMessage,
          shortName,
        },
        {
          onStatusChange: ({ status }) => this.setState({ status }),
        }
      );
      this.setState({ sendingTransaction: false });
    } catch (err) {
      this.setState({ sendingTransaction: false, errorMessage: err.message || err.name });
    }

    const lastTransaction = await Stone.getLastTransaction();
    console.log('lastTransaction', lastTransaction);

    const lastTransactionId = await Stone.getLastTransactionId();
    console.log('lastTransactionId', lastTransactionId);
  }

  updateTransaction(updatedFields) {
    this.setState(prevState => ({
      transaction: {
        ...prevState.transaction,
        ...updatedFields,
      },
    }));
  }

  render() {
    const { sendingTransaction, errorMessage, transaction, status } = this.state;
    return (
      <View>
        <TextInput
          onChangeText={a => this.updateTransaction({ amountInCents: a })}
          value={transaction.amountInCents}
        />
        <Picker
          selectedValue={transaction.method}
          onValueChange={itemValue => this.updateTransaction({ method: itemValue })}
        >
          <Picker.Item label="Crédito" value={Stone.transactionMethod.CREDIT} />
          <Picker.Item label="Débito" value={Stone.transactionMethod.DEBIT} />
        </Picker>

        <Button
          loading={sendingTransaction}
          onPress={this.sendTransaction}
          title={sendingTransaction ? 'Enviando...' : 'Enviar'}
        />

        <Text>Status: {status}</Text>
        {errorMessage && <Text>Erro: {errorMessage}</Text>}
      </View>
    );
  }
}

export default TransactionSender;
