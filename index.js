import { NativeModules } from 'react-native';

const { RNStone } = NativeModules;

// const Stone = {
//     ...RNStone,
//     testMethod: () => {
//         return RNStone.testMethod();
//     },
//     testMethod2: () => {
//         return RNStone.testMethod();
//     }
// }
Stone = RNStone

export { Stone };