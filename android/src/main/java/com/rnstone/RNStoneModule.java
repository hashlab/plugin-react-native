package com.rnstone;

// import com.StoneSDK
// ...

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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import stone.application.StoneStart;
import stone.application.enums.Action;
import stone.application.enums.InstalmentTransactionEnum;
import stone.application.enums.TransactionStatusEnum;
import stone.application.enums.TypeOfTransactionEnum;
import stone.application.interfaces.StoneActionCallback;
import stone.application.interfaces.StoneCallbackInterface;
import stone.cache.ApplicationCache;
import stone.database.transaction.TransactionDAO;
import stone.database.transaction.TransactionObject;
import stone.environment.Environment;
import stone.providers.ActiveApplicationProvider;
import stone.providers.BluetoothConnectionProvider;
import stone.providers.CancellationProvider;
import stone.providers.DisplayMessageProvider;
import stone.providers.TransactionProvider;
import stone.user.UserModel;
import stone.utils.GlobalInformations;
import stone.utils.PinpadObject;
import stone.utils.Stone;
import stone.utils.StoneTransaction;

public class RNStoneModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNStoneModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNStone";
    }

    @ReactMethod
    public void getDevices(final Promise promise){
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();

        WritableArray array = new WritableNativeArray();

        // Lista todos os dispositivos pareados.
        if (pairedDevices.size() > 0) {
            for (BluetoothDevice device : pairedDevices) {
                WritableMap obj = new WritableNativeMap();
                String name = device.getName();
                String address = device.getAddress();
                obj.putString("name",name + "_" + address);
                array.pushMap(obj);
            }

        }
       promise.resolve(array);
    }

    @ReactMethod
    public void selectDevice(String device, final Promise promise) {

        String[] parts = device.split("_");

        String name = parts[0];
        String macAddress = parts[1];

        PinpadObject pinpad = new PinpadObject(name, macAddress, false);

        final BluetoothConnectionProvider bluetoothConnectionProvider = new BluetoothConnectionProvider(reactContext, pinpad);
        bluetoothConnectionProvider.setDialogMessage("Criando conexao com o pinpad selecionado"); // Mensagem exibida do dialog.
        bluetoothConnectionProvider.setConnectionCallback(new StoneCallbackInterface() {

            public void onSuccess() {
                promise.resolve("Pinpad conectado");
            }

            public void onError() {
                promise.reject("error","Erro durante a conexao."+bluetoothConnectionProvider.getListOfErrors().toString());
            }

        });
        bluetoothConnectionProvider.execute(); // Executa o provider de conexao bluetooth.
    }

    @ReactMethod
    public void deviceIsConnected(final Promise promise) {
        try {
            PinpadObject pinpadObject = Stone.getPinpadFromListAt(0);
            final BluetoothConnectionProvider bluetoothConnectionProvider = new BluetoothConnectionProvider(reactContext, pinpadObject);

            boolean connectionStatus = bluetoothConnectionProvider.getConnectionStatus();
            promise.resolve(connectionStatus);
        } catch (Exception e) {
            promise.reject("Error",e);
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
                    promise.reject("error","Erro durante a conexao."+displayMessageProvider.getListOfErrors().toString());
                }

            });
            displayMessageProvider.execute();
        } catch (Exception e) {
            promise.reject("Pinpad não instalado",e);
        }
    }

    @ReactMethod
    public void transaction(String amount, String method, String instalments, String successMessage, String shortName, final Promise promise) {

        try {
            PinpadObject pinpadObject = Stone.getPinpadFromListAt(0);

            StoneTransaction stoneTransaction = new StoneTransaction(pinpadObject);

            stoneTransaction.setAmount(amount);
            stoneTransaction.setEmailClient(null);
            stoneTransaction.setUserModel(Stone.getUserModel(0));

						if (!shortName.isEmpty()) {
							stoneTransaction.setShortName(shortName);							
						}

            if (method.equals("DEBIT")) {
                stoneTransaction.setInstalmentTransactionEnum(InstalmentTransactionEnum.getAt(0));
                stoneTransaction.setTypeOfTransaction(TypeOfTransactionEnum.DEBIT);
            } else if (method.equals("CREDIT")) {
                // Informa a quantidade de parcelas.
                stoneTransaction.setInstalmentTransactionEnum(InstalmentTransactionEnum.valueOf(instalments));
                stoneTransaction.setTypeOfTransaction(TypeOfTransactionEnum.CREDIT);
            } else {
                promise.reject("error","Invalid Payment Method");
            }

            final TransactionProvider provider = new TransactionProvider(reactContext, stoneTransaction, pinpadObject);
            provider.useDefaultUI(false);
            provider.setDialogMessage("Enviando..");
            provider.setDialogTitle("Aguarde");

            provider.setConnectionCallback(new StoneActionCallback() {
                @Override
                public void onStatusChanged(Action action) {
                    Log.d("TRANSACTION_STATUS", action.name());
                }

                public void onSuccess() {
                    if (provider.getTransactionStatus() == TransactionStatusEnum.APPROVED) {
                        promise.resolve("Transação enviada com sucesso e salva no banco. Para acessar, use o TransactionDAO.");
                    } else {
                        promise.reject("error","Erro na transação: \"" + provider.getMessageFromAuthorize() + "\"");
                    }
                }

                public void onError() {
                    promise.reject("error","Transação falhou");
                }
            });
            provider.execute();
        } catch (IndexOutOfBoundsException e) {
            promise.reject("Pinpad não instalado",e);
        } catch (Exception e) {
            promise.reject("error",e);
        }


    }

    @ReactMethod
    public void cancelTransaction(String transactionCode, final Promise promise) {
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
            promise.reject("Error",e);
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

        UserModel userModel = Stone.getUserModel(0);
        String sak = String.valueOf(userModel.getMerchantSak());

        try {
            WritableArray array = new WritableNativeArray();

            for(TransactionObject transactionObject : transactionObjects) {
                WritableMap obj = new WritableNativeMap();

                String initiatorKey = String.valueOf(transactionObject.getInitiatorTransactionKey());
                String rcptTrx = String.valueOf(transactionObject.getRecipientTransactionIdentification());
                String cardHolder = String.valueOf(transactionObject.getCardHolderName());
                String cardNumber = String.valueOf(transactionObject.getCardHolderNumber());
                String cardBrand = String.valueOf(transactionObject.getCardBrand());
                String authorizationCode = String.valueOf(transactionObject.getAuthorizationCode());

                obj.putInt("mpos_id",transactionObject.getIdFromBase());
                obj.putString("amount",transactionObject.getAmount());
                obj.putString("status",transactionObject.getTransactionStatus().toString());
                obj.putString("initiatorKey",initiatorKey);
                obj.putString("rcptTrx", rcptTrx);
                obj.putString("cardHolder", cardHolder);                
                obj.putString("cardNumber", cardNumber);                
                obj.putString("cardBrand", cardBrand);                
                obj.putString("authotizationCode", authorizationCode);                
                obj.putString("sak", sak);                
                
                array.pushMap(obj);
            }

            promise.resolve(array);
        } catch (Exception e) {
            promise.reject("", e);
        }

    }

    @ReactMethod
    public void validation(String stoneCode, final Promise promise) {

        List<UserModel> user = StoneStart.init(reactContext);


        final ActiveApplicationProvider activeApplicationProvider = new ActiveApplicationProvider(reactContext);
        activeApplicationProvider.setDialogMessage("Ativando o aplicativo...");
        activeApplicationProvider.setDialogTitle("Aguarde");
        activeApplicationProvider.useDefaultUI(false);
        activeApplicationProvider.setConnectionCallback(new StoneCallbackInterface() {
            public void onSuccess() {
                promise.resolve("Afiliação ativada com sucesso");
            }

            public void onError() {
                promise.reject("error",activeApplicationProvider.getListOfErrors().toString());
            }
        });
        activeApplicationProvider.activate(stoneCode);

    }

    @ReactMethod
    public void setEnvironment(String environment, final Promise promise) {
        Stone.setEnvironment(Environment.valueOf(environment));
        promise.resolve(Stone.getEnvironment().toString());
    }

}
