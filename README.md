# React Native Stone

React native module for [Stone SDK v3.0.1](https://sdkandroid.stone.com.br/docs)

## Steps

1. `yarn add git+https://github.com/hashlab/plugin-react-native.git --save`
2. `react-native link`

### Manual Link

In /android/settings.gradle, add the following code:

```
include ':react-native-stone'
project(':react-native-stone').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-stone/android')
```

In /android/app/build.gradle, add the following code inside dependencies:
```
compile project(':react-native-stone')
```

In android/app/src/main/java/[...]/MainActivity.java
```
import com.rnstone.RNStonePackage;
```

```
@Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            ...
            new RNStonePackage()
      );
    }

```

### Possible issues

You may need to add on `AndroidManifest.xml`
```
 <application
    ...
        tools:replace="android:allowBackup"
```

And add to `build.gradle` on `\android`
```
allprojects {
    repositories {
        ...
        maven { url "https://packagecloud.io/stone/sdk-android/maven2" }
        maven { url "https://packagecloud.io/stone/sdk-android-snapshot/maven2" }
        maven { url "https://oss.sonatype.org/content/repositories/snapshots/" }
    }
}
```

### Usage

Sending a transaction

```javascript
import { Stone } from 'react-native-stone';

// The stoneCode must be active
await Stone.setEnvironment(Stone.environment.PRODUCTION)
await Stone.activate("<your-stonecode-here>")

// The pinpad must be connected
const devices = await Stone.getPairedBluetoothDevices()
await Stone.connectDevice(devices[0])

await Stone.sendTransaction(
  {
    amountInCents: '10',
    method: Stone.transactionMethod.CREDIT,
    instalments: Stone.transactionInstalment.ONE_INSTALMENT,
    successMessage: 'Transação bem sucedida',
    shortName: 'Hash',
  },
  {
    onStatusChange: function({ status }) {
    /* status may be:
     *
     *     TRANSACTION_WAITING_CARD,
     *     TRANSACTION_WAITING_SWIPE_CARD,
     *     TRANSACTION_WAITING_PASSWORD,
     *     TRANSACTION_SENDING,
     *     TRANSACTION_REMOVE_CARD,
     *     REVERSING_TRANSACTION_WITH_ERROR,
     *     TRANSACTION_CARD_REMOVED,
     *     TRANSACTION_TYPE_SELECTION;
     */
    }
    console.log(status)
  }
);
```

Cancel transaction

```javascript
const transactionId = await Stone.getLastTransactionId();
await Stone.cancelTransaction(transactionId);
```

List transactions

```javascript
const transactions = await Stone.getAllTransactionsOrderByIdDesc();
```
