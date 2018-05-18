import { NativeModules } from 'react-native';

const { RNStone } = NativeModules;

const Stone = {
    ...RNStone,
    testMethod: () => {
        return RNStone.testMethod();
    }
}

export { Stone };