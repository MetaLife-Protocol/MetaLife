package com.metalife;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.tbruyelle.rxpermissions3.RxPermissions;

import io.reactivex.annotations.NonNull;
import io.reactivex.functions.Consumer;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MetaLife";
    }

    @Override
    protected void onStart() {
        super.onStart();
        requestPermissions();
    }


    private static final int REQUEST_PERMISSION_CODE = 1;

    private void requestPermissions() {
//        int permission_write = ContextCompat.checkSelfPermission(MainActivity.this,
//                Manifest.permission.WRITE_EXTERNAL_STORAGE);
//        int permission_read = ContextCompat.checkSelfPermission(MainActivity.this,
//                Manifest.permission.READ_EXTERNAL_STORAGE);
//        if (permission_read != PackageManager.PERMISSION_GRANTED ||
//                permission_write != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(MainActivity.this, new String[]{
//                    Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_PERMISSION_CODE);
//        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            final RxPermissions rxPermissions = new RxPermissions(this);
            rxPermissions
                    .request(
//                            Manifest.permission.CAMERA,
//                            Manifest.permission.READ_PHONE_STATE,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE,
                            Manifest.permission.READ_EXTERNAL_STORAGE
//                            Manifest.permission.RECORD_AUDIO,
//                            Manifest.permission.READ_CONTACTS
                    ).subscribe();
        }
    }

//    @Override
//    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
//        if (requestCode == REQUEST_PERMISSION_CODE) {
//
//        }
//        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
//    }
}
