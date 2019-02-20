import { NativeModules, DeviceEventEmitter } from 'react-native';

const { RNStone } = NativeModules;

const Stone = {
    getDevices: () => {
        return RNStone.getDevices();
    },
    /**
     * @deprecated Use connectDevice
     */
    selectDevice: (device) => {
        return RNStone.selectDevice(device);
    },
    deviceIsConnected: () => {
        return RNStone.deviceIsConnected();
    },
    deviceDisplay: (message) => {
        return RNStone.deviceDisplay(message);
    },
    transaction: (amount,method,instalments,sucessMessage = "", shortName = "") => {
      return RNStone.transaction(amount,method,instalments,sucessMessage, shortName);
    },
    cancelTransaction: (transactionCode) => {
        return RNStone.cancelTransaction(transactionCode);
    },
    getTransactions: () => {
        return RNStone.getTransactions();
    },
    /**
     * @deprecated Use activate
     */
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
        return RNStone.setEnvironment(environment);
    },

    activate(stoneCode) {
      return RNStone.activate(stoneCode)
    },

    deactivate(stoneCode) {
      return RNStone.deactivate(stoneCode)
    },

    /**
     * @returns Promise(ArrayOf({ name: String, address: String }))
     */
    getPairedBluetoothDevices() {
      return RNStone.getPairedBluetoothDevices()
    },

    /**
     * Device: { name: String, address: String }
     */
    connectDevice(device) {
      return RNStone.connectDevice(device.name, device.address)
    },

    getConnectedDevice() {
      return RNStone.getConnectedDevice()
    },

    /**
     *
     * Status:
     *     TRANSACTION_WAITING_CARD,
     *     TRANSACTION_WAITING_SWIPE_CARD,
     *     TRANSACTION_WAITING_PASSWORD,
     *     TRANSACTION_SENDING,
     *     TRANSACTION_REMOVE_CARD,
     *     REVERSING_TRANSACTION_WITH_ERROR,
     *     TRANSACTION_CARD_REMOVED,
     *     TRANSACTION_TYPE_SELECTION;
     */
    async sendTransaction(transaction, opts) {
      opts = opts || {}
      const { amount, method, instalments, sucessMessage = "", shortName = "" } = transaction

      let subscription
      if(opts.onStatusChange) {
        subscription = DeviceEventEmitter.addListener(
          RNStone.EVT_TRANSACTION_STATUS_CHANGED,
          opts.onStatusChange
        )
      }
      const result = await RNStone.sendTransaction(amount, method, instalments, sucessMessage, shortName);

      if(subscription) {
        subscription.remove();
      }
      return result
    },

    environment: {
      PRODUCTION: "PRODUCTION",
      INTERNAL_HOMOLOG: "INTERNAL_HOMOLOG",
      SANDBOX: "SANDBOX",
      STAGING: "STAGING",
      INTERNAL_CERTIFICATION: "INTERNAL_CERTIFICATION"
    },

    transactionMethod: {
      DEBIT: 'DEBIT',
      CREDIT: 'CREDIT'
    },

    transactionInstalment: {
      ONE_INSTALMENT: 'ONE_INSTALMENT',
      TWO_INSTALMENT_NO_INTEREST: 'TWO_INSTALMENT_NO_INTEREST',
      THREE_INSTALMENT_NO_INTEREST: 'THREE_INSTALMENT_NO_INTEREST',
      FOUR_INSTALMENT_NO_INTEREST: 'FOUR_INSTALMENT_NO_INTEREST',
      FIVE_INSTALMENT_NO_INTEREST: 'FIVE_INSTALMENT_NO_INTEREST',
      SIX_INSTALMENT_NO_INTEREST: 'SIX_INSTALMENT_NO_INTEREST',
      SEVEN_INSTALMENT_NO_INTEREST: 'SEVEN_INSTALMENT_NO_INTEREST',
      EIGHT_INSTALMENT_NO_INTEREST: 'EIGHT_INSTALMENT_NO_INTEREST',
      NINE_INSTALMENT_NO_INTEREST: 'NINE_INSTALMENT_NO_INTEREST',
      TEN_INSTALMENT_NO_INTEREST: 'TEN_INSTALMENT_NO_INTEREST',
      ELEVEN_INSTALMENT_NO_INTEREST: 'ELEVEN_INSTALMENT_NO_INTEREST',
      TWELVE_INSTALMENT_NO_INTEREST: 'TWELVE_INSTALMENT_NO_INTEREST',
      TWO_INSTALMENT_WITH_INTEREST: 'TWO_INSTALMENT_WITH_INTEREST',
      THREE_INSTALMENT_WITH_INTEREST: 'THREE_INSTALMENT_WITH_INTEREST',
      FOUR_INSTALMENT_WITH_INTEREST: 'FOUR_INSTALMENT_WITH_INTEREST',
      FIVE_INSTALMENT_WITH_INTEREST: 'FIVE_INSTALMENT_WITH_INTEREST',
      SIX_INSTALMENT_WITH_INTEREST: 'SIX_INSTALMENT_WITH_INTEREST',
      SEVEN_INSTALMENT_WITH_INTEREST: 'SEVEN_INSTALMENT_WITH_INTEREST',
      EIGHT_INSTALMENT_WITH_INTEREST: 'EIGHT_INSTALMENT_WITH_INTEREST',
      NINE_INSTALMENT_WITH_INTEREST: 'NINE_INSTALMENT_WITH_INTEREST',
      TEN_INSTALMENT_WITH_INTEREST: 'TEN_INSTALMENT_WITH_INTEREST',
      ELEVEN_INSTALMENT_WITH_INTEREST: 'ELEVEN_INSTALMENT_WITH_INTEREST',
      TWELVE_INSTALMENT_WITH_INTEREST: 'TWELVE_INSTALMENT_WITH_INTEREST'
    }
}

export { Stone };
