package com.rnstone;

// import com.StoneSDK
// ...

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

import stone.application.StoneStart;
import stone.user.UserModel;

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
    public void testMethod(final Promise promise) {

        List<UserModel> user = StoneStart.init(reactContext);


        promise.resolve(true);
    }

}