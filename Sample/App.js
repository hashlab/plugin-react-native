import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import ActivateStoneCodeScreen from './screens/activate-stone-code';
import TransactionScreen from './screens/transaction';
import TransactionHistoryScreen from './screens/transaction-history';
import TransactionDetailsScreen from './screens/transaction-details';

const AppNavigator = createStackNavigator(
  {
    ActivateStoneCode: ActivateStoneCodeScreen,
    Transaction: TransactionScreen,
    TransactionHistory: TransactionHistoryScreen,
    TransactionDetails: TransactionDetailsScreen,
  },
  {
    initialRouteName: 'ActivateStoneCode',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return <AppContainer />;
}
