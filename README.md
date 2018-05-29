# React Native Stone

React native module for Stone SDK

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

### Posible issues

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

## Methods
```
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
```