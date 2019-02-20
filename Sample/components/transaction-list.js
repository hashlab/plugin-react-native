import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, FlatList, View, TouchableOpacity } from 'react-native';
import { Stone } from 'react-native-stone';

const keyExtractor = (item, index) => `${item.name}${index}`;

const renderSeparator = () => (
  <View
    style={{
      height: 1,
      width: '86%',
      backgroundColor: '#CED0CE',
      marginLeft: '14%',
    }}
  />
);

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
    };
    this.renderItem = this.renderItem.bind(this);
    this.updateTransactions = this.updateTransactions.bind(this);
  }

  componentDidMount() {
    this.updateTransactions();
  }

  async updateTransactions() {
    const transactions = await Stone.getTransactions();
    this.setState({ transactions });
  }

  renderItem({ item }) {
    const { onTransactionSelected } = this.props;
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
    } = item;

    return (
      <TouchableOpacity onPress={() => onTransactionSelected(item)}>
        <View>
          <Text>
            {mposId} - {status} - R$ {amount} - {initiatorKey} - {rcptTrx} - {cardHolder}{' '}
            {cardBrand}-{cardNumber} - - {authorizationCode} - {sak}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { transactions } = this.state;

    return (
      <FlatList
        ItemSeparatorComponent={renderSeparator}
        data={transactions}
        keyExtractor={keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }
}

TransactionList.propTypes = {
  onTransactionSelected: PropTypes.func,
};

export default TransactionList;
