package com.metalife.photon;


import static com.metalife.MainApplication.mContext;

import android.content.Context;
import android.net.wifi.WifiManager;
import android.text.TextUtils;
import android.text.format.Formatter;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by H on 2018/5/11.
 * Description:
 */

public class PhotonNetUtil {

    private static volatile PhotonNetUtil S_INST;
    
    public static PhotonNetUtil getInstance() {
        if (S_INST == null) {
            synchronized (PhotonNetUtil.class) {
                if (S_INST == null) {
                    S_INST = new PhotonNetUtil();
                }
            }
        }
        return S_INST;

    }

    /**
     * 停止运行光子网络
     * */
    public void stopPhoton() {
//        if (NextApplication.api == null && NextApplication.photonStatus){
//            return;
//        }
//        try {
//            PhotonThreadPoolUtils.getInstance().getPhotonThreadPool().execute(() -> {
//                if (NextApplication.api != null) {
//                    if(NextApplication.mRaidenSubscribe !=null){
//                        NextApplication.mRaidenSubscribe.unsubscribe();
//                    }
//                    NextApplication.api.stop();
//                    NextApplication.api = null;
//                }
//                NextApplication.photonStatusStatus = false;
//                NextApplication.photonStatus = false;
//            });
//        }catch (Exception e){
//            e.printStackTrace();
//        }
    }

    /**
     * 获取当前wifi ip
     * */
    public String getCurWifiIp(){
        try {
            WifiManager wm = (WifiManager) mContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            String clientIP = null;
            if (wm != null) {
                clientIP = Formatter.formatIpAddress(wm.getConnectionInfo().getIpAddress());
            }
            return clientIP;
        }catch (Exception e){
            return null;
        }
    }
//
//    /**
//     * 转账切换无网有网
//     * */
//    public void photonNetSwitch(final boolean isOffline,boolean isCheckChanged) {
//        MeshWifiUtils.getMeshBoxWifi(isMeshWifi -> {
//            if (isMeshWifi){
//                photonOnMeshBox(isOffline,isCheckChanged);
//            }else{
//                photonOnNormal(isOffline,isCheckChanged);
//            }
//        });
//    }
//
//    public String getWifiJson(){
//        try {
//            ConcurrentHashMap<String, MeshUserInfo> map = MeshDiscover.getInatance().mServiceMap;
//            JSONArray ary = new JSONArray();
//            if (map != null && map.size() > 0) {
//                for (Map.Entry<String, MeshUserInfo> entry : map.entrySet()) {
//                    MeshUserInfo info = entry.getValue();
//                    if (!TextUtils.isEmpty(info.getWalletAddress()) && !TextUtils.isEmpty(info.getIp()) && !TextUtils.isEmpty(String.valueOf(info.getPort()))) {
//                        JSONObject obj = new JSONObject();
//                        obj.put("address", info.getWalletAddress());
//                        obj.put("ip_port", info.getIp() + ":" + PhotonUrl.PHOTON_TRANSFER_PORT);
//                        ary.put(obj);
//                    }
//                }
//                String selectAddress =  WalletInfoUtils.getInstance().getSelectAddress();
//                WifiManager wm = (WifiManager) mContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
//                String clientIP = null;
//                if (wm != null) {
//                    clientIP = Formatter.formatIpAddress(wm.getConnectionInfo().getIpAddress());
//                }
//                JSONObject obj = new JSONObject();
//                obj.put("address", selectAddress);
//                obj.put("ip_port", clientIP + ":" + PhotonUrl.PHOTON_TRANSFER_PORT);
//                ary.put(obj);
//            }
//            return ary.toString();
//        }catch (Exception e){
//            e.printStackTrace();
//            return new JSONArray().toString();
//        }
//    }
//
//    private void photonOnNormal(final boolean isNet,boolean isCheckChanged){
//        try {
//            PhotonThreadPoolUtils.getInstance().getPhotonThreadPool().execute(() -> {
//                if (NextApplication.api != null) {
//                    if (isCheckChanged){
//                        NextApplication.api.switchNetwork(isNet);
//                    }
//                    NextApplication.api.updateMeshNetworkNodes(isNet ? getWifiJson() : new JSONArray().toString());
//                }
//            });
//        }catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void photonOnMeshBox(final boolean isOffline,boolean isCheckChanged){
//        try {
//            PhotonThreadPoolUtils.getInstance().getPhotonThreadPool().execute(() -> {
//                if (NextApplication.api != null) {
//                    if (isCheckChanged){
//                        NextApplication.api.switchNetwork(isOffline);
//                    }
//                    getMacAddress(isOffline);
//                }
//            });
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void getMacAddress(boolean isOffline){
//        String selectAddress = WalletInfoUtils.getInstance().getSelectAddress();
//        if (isOffline && !TextUtils.isEmpty(selectAddress)){
//            selectAddress = selectAddress.toLowerCase();
//        }else{
//            selectAddress = "";
//        }
//        NetRequestImpl.getInstance().getMacAddress(selectAddress, new RequestListener() {
//            @Override
//            public void start() {
//
//            }
//
//            @Override
//            public void success(JSONObject response) {
//                askAll(isOffline);
//            }
//
//            @Override
//            public void error(int errorCode, String errorMsg) {
//                askAll(isOffline);
//            }
//        });
//    }
//
//    public void askAll(boolean isOffline){
//        NetRequestImpl.getInstance().tokenAddressAsk(new RequestListener() {
//            @Override
//            public void start() {
//
//            }
//
//            @Override
//            public void success(JSONObject response) {
//                parseAddressAsk(response,isOffline);
//            }
//
//            @Override
//            public void error(int errorCode, String errorMsg) {
//                try {
//                    if (NextApplication.api != null) {
//                        NextApplication.api.updateMeshNetworkNodes(isOffline ? getWifiJson() : new JSONArray().toString());
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//        });
//    }
//
//    public void parseAddressAsk(JSONObject response,boolean isOffline){
//        try {
//            JSONArray array = response.optJSONArray("token_list");
//            if (array != null){
//                MySharedPrefs.write(NextApplication.mContext,MySharedPrefs.FILE_USER,MySharedPrefs.KEY_PHOTON_TOKEN_LIST,array.toString());
//            }else{
//                MySharedPrefs.write(NextApplication.mContext,MySharedPrefs.FILE_USER,MySharedPrefs.KEY_PHOTON_TOKEN_LIST,"");
//            }
//            JSONArray ary = new JSONArray();
//            if (array != null && array.length() > 0){
//                for (int i = 0 ; i < array.length() ; i++){
//                    JSONObject arrayObject = array.optJSONObject(i);
//                    JSONObject obj = new JSONObject();
//                    obj.put("address", arrayObject.optString("token"));
//                    obj.put("ip_port", arrayObject.optString("ip") + ":" + PhotonUrl.PHOTON_TRANSFER_PORT);
//                    ary.put(obj);
//                }
//                final String content = ary.toString();
//                if (NextApplication.api != null) {
//                    NextApplication.api.updateMeshNetworkNodes(isOffline ? content : new JSONArray().toString());
//                }
//            }else{
//                if (NextApplication.api != null) {
//                    NextApplication.api.updateMeshNetworkNodes(new JSONArray().toString());
//                }
//            }
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//    }
}
