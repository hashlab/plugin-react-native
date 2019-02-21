# CHANGELOG

### v3.0.1

The changes are backwards compatible with v1.0.1.
The version bump now tracks the Stone SDK version.

**New methods**
  - `sendTransaction()`
  - `getAllTransactionsOrderByIdDesc()`
  - `getPairedBluetoothDevices()`
  - `connectDevice()`
  - `getConnectedDevice()`
  - `findTransactionWithInitiatorTransactionKey()`
  - `findTransactionWithId()`
  - `findTransactionWithAuthorizationCode()`
  - `getLastTransactionId()`
  - `getLastTransaction()`
  - `activate`
  - `deactivate`

**Constants**
  - `Stone.environment`
  - `Stone.transactionMethod`
  - `Stone.transactionInstalment`

**Deprecated methods**
  - `transaction()` use `sendTransaction()`
  - `getTransactions()` use `getAllTransactionsOrderByIdDesc()`
  - `validation()` use `activate()`
  - `getDevices()` use `getPairedBluetoothDevices()`
  - `selectDevice()` use `connectDevice()`


#### Migration

Using `sendTransaction()` instead of `transaction()`:

```javascript
// Before (v1.0.1)
await Stone.transaction("10","CREDIT","ONE_INSTALMENT","Sucesso!", "HASHLAB")

// After (v3.0.1)
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

Use `activate()` instead of `validation()`

```javascript
// Before (v1.0.1)
await Stone.validation("stoneCode")

// After (v3.0.1)
await Stone.activate("stoneCode")
```

Use `getAllTransactionsOrderByIdDesc()` instead of `getTransactions()`.

 The transaction object changed:

  - Renamed: `mpos_id` -> `mposId`
  - Type changed: `mposId` now is a `String`
  - Renamed: `cardHolder` now is `cardHolderName`
  - Renamed: `authotizationCode` now is `authorizationCode`
  - Renamed: `rcptTrx` now is `recipientTransactionIdentification`
  - Renamed: `initiatorKey` now is `initiatorTransactionKey`

```javascript
// Before (v1.0.1)
const transactions = await Stone.getTransactions();
/*
* transactions is an ArrayOf({
*  mpos_id: int,
*  amount: string,
*  status: string,
*  initiatorKey: string,
*  rcptTrx: string
*  cardHolder: string,
*  cardNumber: string,
*  cardBrand: string,
*  authotizationCode: string
*  sak: string
* })
*/

// After (v3.0.1)
const transactions = await Stone.getAllTransactionsOrderByIdDesc();
/*
* transactions is an ArrayOf({
*  mposId: string,
*  amount: string,
*  status: string,
*  initiatorTransactionKey: string,
*  recipientTransactionIdentification: string
*  cardHolderName: string,
*  cardNumber: string,
*  cardBrand: string,
*  authorizationCode: string
*  sak: string
* })
*/
```

Use `getPairedBluetoothDevices()` instead of `getDevices()`

```javascript
// Before (v1.0.1)
// devices was an array of string
const devices = await Stone.getDevices()

// After (v3.0.1)
// devices is an array of Objects {name: string, address: string }
const devices = await Stone.getPairedBluetoothDevices()
```

Use `connectDevice` instead of `selectDevice()`

```javascript
// Before (v1.0.1)
await Stone.selectDevice(devices[0])

// After (v3.0.1)
await Stone.connectDevice(devices[0])
```
