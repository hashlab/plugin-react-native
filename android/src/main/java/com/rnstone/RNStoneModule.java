package com.rnstone;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import stone.application.StoneStart;
import stone.application.enums.Action;
import stone.application.enums.InstalmentTransactionEnum;
import stone.application.enums.TransactionStatusEnum;
import stone.application.enums.TypeOfTransactionEnum;
import stone.application.interfaces.StoneActionCallback;
import stone.application.interfaces.StoneCallbackInterface;
import stone.database.transaction.TransactionDAO;
import stone.database.transaction.TransactionObject;
import stone.environment.Environment;
import stone.providers.ActiveApplicationProvider;
import stone.providers.BluetoothConnectionProvider;
import stone.providers.CancellationProvider;
import stone.providers.DisplayMessageProvider;
import stone.providers.TransactionProvider;
import stone.utils.PinpadObject;
import stone.utils.Stone;

public class RNStoneModule extends ReactContextBaseJavaModule {
  private static final String TAG = "RNStoneModule";
  private static final String EVT_TRANSACTION_STATUS_CHANGED = "EVT_TRANSACTION_STATUS_CHANGED";
  private final ReactApplicationContext reactContext;

  public RNStoneModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    StoneStart.init(reactContext);
    Stone.setAppName("RNStone Sample");
  }

  @Override
  public String getName() {
    return "RNStone";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(EVT_TRANSACTION_STATUS_CHANGED, EVT_TRANSACTION_STATUS_CHANGED);
    return constants;
  }

  @Deprecated
  @ReactMethod
  public void getDevices(final Promise promise) {
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();

    WritableArray array = new WritableNativeArray();

    // Lista todos os dispositivos pareados.
    if (pairedDevices.size() > 0) {
      for (BluetoothDevice device : pairedDevices) {
        WritableMap obj = new WritableNativeMap();
        String name = device.getName();
        String address = device.getAddress();
        obj.putString("name", name + "_" + address);
        array.pushMap(obj);
      }

    }
    promise.resolve(array);
  }

  @ReactMethod
  public void getPairedBluetoothDevices(final Promise promise) {
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();

    WritableArray array = new WritableNativeArray();

    if (pairedDevices.size() > 0) {
      for (BluetoothDevice device : pairedDevices) {
        WritableMap obj = new WritableNativeMap();
        obj.putString("name", device.getName());
        obj.putString("address", device.getAddress());
        array.pushMap(obj);
      }

    }
    promise.resolve(array);
  }

  @Deprecated
  @ReactMethod
  public void selectDevice(String device, final Promise promise) {
    Log.d(TAG, "selectedDevice: device=[" + device + "]");
    String[] parts = device.split("_");

    String name = parts[0];
    String macAddress = parts[1];

    connectDevice(name, macAddress, promise);
  }

  @ReactMethod
  public void connectDevice(String deviceName, String deviceAddress, final Promise promise) {
    Log.d(TAG, "connectDevice: deviceName=[" + deviceName + "] deviceAddress=[" + deviceAddress + "]");
    PinpadObject pinpad = new PinpadObject(deviceName, deviceAddress, false);

    final BluetoothConnectionProvider bluetoothConnectionProvider = new BluetoothConnectionProvider(reactContext, pinpad);
    bluetoothConnectionProvider.setDialogMessage("Criando conexao com o pinpad selecionado"); // Mensagem exibida do dialog.
    bluetoothConnectionProvider.setConnectionCallback(new StoneCallbackInterface() {

      public void onSuccess() {
        promise.resolve("Pinpad conectado");
      }

      public void onError() {
        promise.reject("error", "Erro durante a conexao." + bluetoothConnectionProvider.getListOfErrors().toString());
      }

    });
    bluetoothConnectionProvider.execute();
  }

  @ReactMethod
  public void deviceIsConnected(final Promise promise) {
    try {
      boolean connectionStatus = Stone.isConnectedToPinpad();
      promise.resolve(connectionStatus);
    } catch (Exception e) {
      promise.reject("Error", e);
    }

  }

  @ReactMethod
  public void deviceDisplay(String message, final Promise promise) {
    try {
      PinpadObject pinpadObject = Stone.getPinpadFromListAt(0);
      final DisplayMessageProvider displayMessageProvider = new DisplayMessageProvider(reactContext, message, pinpadObject);
      /* displayMessageProvider.setDialogMessage("Criando conexao com o pinpad selecionado"); // Mensagem exibida do dialog. */
      displayMessageProvider.setWorkInBackground(false); // Informa que haverá um feedback para o usuário.
      displayMessageProvider.setConnectionCallback(new StoneCallbackInterface() {

        public void onSuccess() {
          promise.resolve("Ok");
        }

        public void onError() {
          promise.reject("error", "Erro durante a conexao." + displayMessageProvider.getListOfErrors().toString());
        }

      });
      displayMessageProvider.execute();
    } catch (Exception e) {
      promise.reject("Pinpad não instalado", e);
    }
  }

  @ReactMethod
  public void transaction(String amount, String method, String instalments, String successMessage, String shortName, final Promise promise) {
    try {
      PinpadObject pinpadObject = Stone.getPinpadFromListAt(0);

      final TransactionObject stoneTransaction = new TransactionObject();

      stoneTransaction.setAmount(amount);
      stoneTransaction.setUserModel(Stone.getUserModel(0));
      //stoneTransaction.setSignature(BitmapFactory.decodeResource(getResources(), R.drawable.signature));
      stoneTransaction.setCapture(true);

      if (!shortName.isEmpty()) {
        stoneTransaction.setShortName(shortName);
      }

      if (method.equals("DEBIT")) {
        stoneTransaction.setInstalmentTransaction(InstalmentTransactionEnum.getAt(0));
        stoneTransaction.setTypeOfTransaction(TypeOfTransactionEnum.DEBIT);
      } else if (method.equals("CREDIT")) {
        // Informa a quantidade de parcelas.
        stoneTransaction.setInstalmentTransaction(InstalmentTransactionEnum.valueOf(instalments));
        stoneTransaction.setTypeOfTransaction(TypeOfTransactionEnum.CREDIT);
      } else {
        promise.reject("error", "Invalid Payment Method");
      }


      final TransactionProvider provider = new TransactionProvider(
        reactContext,
        stoneTransaction,
        Stone.getUserModel(0),
        pinpadObject
      );
      provider.useDefaultUI(false);
      provider.setDialogMessage("Enviando..");
      provider.setDialogTitle("Aguarde");

      provider.setConnectionCallback(new StoneActionCallback() {
        @Override
        public void onStatusChanged(Action action) {
          Log.d("TRANSACTION_STATUS", action.name());

          WritableMap payload = new WritableNativeMap();
          payload.putString("initiatorTransactionKey", stoneTransaction.getInitiatorTransactionKey());
          payload.putString("status", action.name());

          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(EVT_TRANSACTION_STATUS_CHANGED, payload);
        }

        public void onSuccess() {
          if (provider.getTransactionStatus() == TransactionStatusEnum.APPROVED) {
            promise.resolve("Transação enviada com sucesso e salva no banco. Para acessar, use o TransactionDAO.");
          } else {
            promise.reject("error", "Erro na transação: \"" + provider.getMessageFromAuthorize() + "\"");
          }
        }

        public void onError() {
          promise.reject("error", "Transação falhou");
        }
      });
      provider.execute();
    } catch (IndexOutOfBoundsException e) {
      promise.reject("Pinpad não instalado", e);
    } catch (Exception e) {
      promise.reject("error", e);
    }


  }

  @ReactMethod
  public void sendTransaction(String amount, String method, String instalments, String successMessage, String shortName, final Promise promise) {
    Log.d(TAG, "sendTransaction: amount=[" + amount + "] method=[" + method + "] instalments=[" + instalments + "] successMessage=[" + successMessage + "] shortName=[" + shortName + "]");
    transaction(amount, method, instalments, successMessage, shortName, promise);
  }

  @ReactMethod
  public void cancelTransaction(String transactionCode, final Promise promise) {
    Log.d(TAG, "cancelTransaction: transactionCode=[" + transactionCode + "]");
    try {
      String[] parts = transactionCode.split("_");

      String idOptSelected = parts[0];
      final int transacionId = Integer.parseInt(idOptSelected);

      final CancellationProvider cancellationProvider = new CancellationProvider(reactContext, transacionId, Stone.getUserModel(0));
      cancellationProvider.setConnectionCallback(new StoneCallbackInterface() { // chamada de retorno.
        public void onSuccess() {
          promise.resolve("Cancelado com sucesso");
        }

        public void onError() {
          promise.resolve(cancellationProvider.getListOfErrors().toString() + " Erro ocorreu durante o cancelamento da transacao de id: " + transacionId);
        }
      });
      cancellationProvider.execute();
    } catch (Exception e) {
      promise.reject("Error", e);
    }

  }

  @ReactMethod
  public void getTransactions(final Promise promise) {

    TransactionDAO transactionDAO = new TransactionDAO(reactContext);

    List<TransactionObject> transactionObjects = transactionDAO.getAllTransactionsOrderByIdDesc();

    String[] rowOfList = new String[transactionObjects.size()];
    for (int i = 0; i < transactionObjects.size(); i++) {
      rowOfList[i] = String.format("%s=%s\n%s", transactionObjects.get(i).getIdFromBase(), transactionObjects.get(i).getAmount(), transactionObjects.get(i).getTransactionStatus());
    }

    try {
      WritableArray array = new WritableNativeArray();

      for (TransactionObject transactionObject : transactionObjects) {
        WritableMap obj = new WritableNativeMap();

        String initiatorKey = String.valueOf(transactionObject.getInitiatorTransactionKey());
        String rcptTrx = String.valueOf(transactionObject.getRecipientTransactionIdentification());
        String cardHolder = String.valueOf(transactionObject.getCardHolderName());
        String cardNumber = String.valueOf(transactionObject.getCardHolderNumber());
        String cardBrand = String.valueOf(transactionObject.getCardBrand());
        String authorizationCode = String.valueOf(transactionObject.getAuthorizationCode());

        obj.putInt("mposId", transactionObject.getIdFromBase());
        obj.putString("amount", transactionObject.getAmount());
        obj.putString("status", transactionObject.getTransactionStatus().toString());
        obj.putString("initiatorKey", initiatorKey);
        obj.putString("rcptTrx", rcptTrx);
        obj.putString("cardHolder", cardHolder);
        obj.putString("cardNumber", cardNumber);
        obj.putString("cardBrand", cardBrand);
        obj.putString("authorizationCode", authorizationCode);
        obj.putString("sak", transactionObject.getSaleAffiliationKey());

        array.pushMap(obj);
      }

      promise.resolve(array);
    } catch (Exception e) {
      promise.reject("", e);
    }

  }

  @Deprecated
  @ReactMethod
  public void validation(String stoneCode, final Promise promise) {
    activate(stoneCode, promise);
  }

  @ReactMethod
  public void activate(String stoneCode, final Promise promise) {
    final ActiveApplicationProvider activeApplicationProvider = new ActiveApplicationProvider(reactContext);
    activeApplicationProvider.setDialogMessage("Ativando o aplicativo...");
    activeApplicationProvider.setDialogTitle("Aguarde");
    activeApplicationProvider.useDefaultUI(false);
    activeApplicationProvider.setConnectionCallback(new StoneCallbackInterface() {
      public void onSuccess() {
        promise.resolve("Afiliação ativada com sucesso");
      }

      public void onError() {
        promise.reject("error", activeApplicationProvider.getListOfErrors().toString());
      }
    });
    activeApplicationProvider.activate(stoneCode);
  }

  @ReactMethod
  public void deactivate(String stoneCode, final Promise promise) {
    final ActiveApplicationProvider activeApplicationProvider = new ActiveApplicationProvider(reactContext);
    activeApplicationProvider.setDialogMessage("Desativando stoneCode...");
    activeApplicationProvider.setDialogTitle("Aguarde");
    activeApplicationProvider.useDefaultUI(false);
    activeApplicationProvider.setConnectionCallback(new StoneCallbackInterface() {
      public void onSuccess() {
        promise.resolve("Stonecode desativado");
      }

      public void onError() {
        promise.reject("error", activeApplicationProvider.getListOfErrors().toString());
      }
    });
    activeApplicationProvider.deactivate(stoneCode);
  }

  @ReactMethod
  public void setEnvironment(String environment, final Promise promise) {
    Stone.setEnvironment(Environment.valueOf(environment));
    promise.resolve(Stone.getEnvironment().toString());
  }

  @ReactMethod
  public void getConnectedDevice(final Promise promise) {
    if (Stone.isConnectedToPinpad()) {
      PinpadObject p = Stone.getPinpadFromListAt(0);
      WritableMap device = new WritableNativeMap();
      device.putString("name", p.getName());
      device.putString("address", p.getMacAddress());
      promise.resolve(device);
    } else {
      promise.resolve(null);
    }
  }

}
