package com.metalife.photon;

import android.app.Application;
import android.content.Context;

import com.metalife.photon.vo.RaidenStatusVo;

import java.io.File;

import mobile.API;
import mobile.Subscription;


public class PhotonApplication extends Application {
    public static Context mContext;
    public static API api;
    public static Subscription mRaidenSubscribe;

    //光子网络状态  可能正在启动 或者启动成功
    public static boolean photonStatus = false;
    public static boolean photonStatusStatus = false;
    public static RaidenStatusVo mRaidenStatusVo;


    @Override
    public void onCreate() {
        super.onCreate();
        mContext = this;
        SDCardCtrl.initPath(this);
    }

    /**
     * Create a folder
     *
     * @param dirName
     */
    public void createDir(String dirName) {
        File destDir = new File(dirName);
        if (!destDir.exists()) {
            destDir.mkdirs();
        }
    }
}
