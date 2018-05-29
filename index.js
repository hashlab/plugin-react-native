import { NativeModules } from 'react-native';

const { RNStone } = NativeModules;

const Stone = {
    getDevices: () => {
        return RNStone.getDevices();
    },
    selectDevice: (device) => {
        return RNStone.selectDevice(device);
    },
    deviceIsConnected: () => {
        return RNStone.deviceIsConnected();
    },
    deviceDisplay: (message) => {
        return RNStone.deviceDisplay(message);
    },
    transaction: (amount,method,instalments,sucessMessage = "") => {
        return RNStone.transaction(amount,method,instalments,sucessMessage);
    },
    cancelTransaction: (transactionCode) => {
        return RNStone.cancelTransaction(transactionCode);
    },
    getTransactions: () => {
        return RNStone.getTransactions();
    },
    validation: (stoneCode) => {
        return RNStone.validation(stoneCode);
    },
    setEnvironment: (environment) => {
        /*
        PRODUCTION,
        INTERNAL_HOMOLOG,
        SANDBOX,
        STAGING,
        INTERNAL_CERTIFICATION;
         */
        return RNStone.validation(environment);
    },
}
// Stone = RNStone

export { Stone };