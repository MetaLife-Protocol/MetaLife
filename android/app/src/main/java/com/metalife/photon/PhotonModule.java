package com.metalife.photon;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.metalife.photon.vo.RaidenStatusVo;
import com.metalife.util.Constants;
import com.metalife.util.ContractUtils;
import com.metalife.util.Utils;

import org.json.JSONObject;
import org.web3j.utils.Numeric;

import java.io.File;

import mobile.Mobile;
import mobile.NotifyHandler;
import mobile.Strings;

/**
 * describe:
 */
public class PhotonModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public PhotonModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "Photon";
    }

    /**
     * 开启光子服务
     *
     * @param privateKey
     * @param ethRPCEndPoint
     * @param promise
     */
    @ReactMethod
    public void startPhotonServer(String privateKey, String ethRPCEndPoint, Promise promise) {

//        Log.e("startPhotonServer key:", privateKey);
//        Log.e("startPhotonServer eth:", ethRPCEndPoint);

        try {
            if (PhotonApplication.photonStatus && PhotonApplication.api == null) {
                return;
            }
//            TODO 1.钱包地址
//            final String tempAddress = WalletInfoUtils.getInstance().getSelectAddress();
            final String tempAddress = "";
            PhotonThreadPoolUtils.getInstance().getPhotonThreadPool().execute(() -> {
                try {
                    if (PhotonApplication.api != null && PhotonApplication.photonStatus) {
                        if (PhotonApplication.mRaidenSubscribe != null) {
                            PhotonApplication.mRaidenSubscribe.unsubscribe();
                        }
                        PhotonApplication.api.stop();
                        PhotonApplication.api = null;
                        PhotonApplication.photonStatus = false;
                        PhotonApplication.photonStatusStatus = false;
                    }
                    String clientIP = PhotonNetUtil.getInstance().getCurWifiIp();
                    if (TextUtils.isEmpty(clientIP)) {
                        clientIP = "0.0.0.0";
                    }
                    String fileName = "photon_log" + "(" + tempAddress + ")" + ".txt";
                    SDCardCtrl.checkPathExist();
                    File logFile = new File(SDCardCtrl.getPhotonErrorLogPath(), fileName);
                    if (!logFile.exists()) {
                        logFile.createNewFile();
                    }
                    PhotonApplication.mRaidenStatusVo = new RaidenStatusVo();
                    PhotonApplication.mRaidenStatusVo.setEthStatus(PhotonStatusType.Default);
                    PhotonApplication.mRaidenStatusVo.setXMPPStatus(PhotonStatusType.Default);
                    Bundle bundle = new Bundle();
//                     todo 发送了一个开启光子服务的广播，没看见接受的。需要确定是否在包里还是sdk里     public static final String ACTION_RAIDEN_CONNECTION_STATE = "com.lingtuan.firefly.raiden.connection.state";
                    Utils.intentAction(PhotonApplication.mContext, PhotonUrl.ACTION_RAIDEN_CONNECTION_STATE, bundle);
                    PhotonApplication.photonStatus = true;
                    /**
                     * 参数:
                     * address string– 光子节点所使用的账户地址
                     * keystorePath string – 账户私钥保存路径
                     * ethRPCEndPoint string – 公链节点host,http协议
                     * dataDir string – Photon db路径  测试环境和正式环境数据不一致，所以路径也不一样，
                     * passwordfile string – 账户密码文件路径
                     * apiAddr string – http api 监听端口
                     * listenAddr string – udp 监听端口
                     * ogFile string – 日志文件路径
                     * registryAddress string – TokenNetworkRegistry合约地址
                     * otherArgs mobile.Strings – 其他参数,参考photon -h
                     *
                     * */

                    /**
                     * privateKeyBinHex string– 私钥二进制字符串
                     * ethRPCEndPoint string – 公链节点host,http协议
                     * dataDir string – Photon db路径
                     * apiAddr string – http api 监听端口
                     * listenAddr string – udp 监听端口
                     * logFile string – 日志文件路径
                     * registryAddress string – TokenNetworkRegistry合约地址
                     * otherArgs mobile.Strings – 其他参数,参考photon -h
                     * */
                    Strings otherArg = Mobile.newStrings(1);
                    String arg = Constants.GLOBAL_SWITCH_OPEN ? "--xmpp" : "--matrix";
                    otherArg.set(0, arg);
                    String dataDir = Constants.GLOBAL_SWITCH_OPEN ? PhotonApplication.mContext.getFilesDir().getAbsolutePath() + SDCardCtrl.PHOTON_DATA
                            : PhotonApplication.mContext.getFilesDir().getAbsolutePath() + SDCardCtrl.RAIDEN_DATA;
                    PhotonApplication.api = Mobile.startUp(
                            Numeric.prependHexPrefix(privateKey),
                            TextUtils.isEmpty(ethRPCEndPoint) ? PhotonUrl.PHOTON_URL_WS : ethRPCEndPoint,
                            dataDir,
                            "127.0.0.1:5001",
                            clientIP + ":40001",
                            logFile.getAbsolutePath(),
                            ContractUtils.CONTACT_PHOTON_ADDRESS,
                            otherArg);
                    PhotonApplication.mRaidenSubscribe = PhotonApplication.api.subscribe(new NotifyHandler() {

                        @Override
                        public void onError(long l, String s) {
                            PhotonApplication.photonStatus = false;
//                            onStartPhotonError(true);
                        }

                        @Override
                        public void onNotify(long l, String s) {
//                            onPhotonNotify(l, s);
                        }

                        @Override
                        public void onReceivedTransfer(String s) {
//                            updateChannelBalance(s);
                        }

                        @Override
                        public void onStatusChange(String s) {
//                            updateStatusChanged(s);
                        }
                    });
                } catch (Exception e) {

                }
            });
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void createChannelMethod(String photonTokenAddress, String
            partnerAddress, String depositBalance, Promise promise) {
        try {
            PhotonThreadPoolUtils.getInstance().getPhotonThreadPool().execute(() -> {
                try {
//                    Mobile.startUp()


//                    if (NextApplication.api != null) {
//                        mView.createChannelStart();
                    /**
                     * partnerAddress 	string 	partner_address 	通道对方地址
                     * tokenAddress 	string 	token_address 	哪种token
                     * settleTimeout 	string 	settle_timeout 	通道结算时间 存款为0
                     * balanceStr 	big.Int 	balance 	存入金额，一定大于0
                     * newChannel 	bool 	new_channel 	判断通道是否存在，决定此次行为是创建通道并存款还是只存款  false为存钱
                     * */
//                        String channelBalance = new BigDecimal(depositBalance).multiply(Convert.Unit.ETHER.getWeiFactor()).stripTrailingZeros().toPlainString();
//                        String jsonString = NextApplication.api.deposit(partnerAddress,photonTokenAddress, PhotonUrl.PHOTON_SETTLE_TIMEOUT,channelBalance ,true);
//                        mView.createChannelSuccess(jsonString);
//                    } else {
//                        mView.photonNotStart();
//                    }
                } catch (Exception e) {
                    e.printStackTrace();
//                    mView.createChannelError();
                }
            });
        } catch (Exception e) {

        }

    }


    private void startUpError(Exception e) {
        try {
            PhotonApplication.photonStatus = false;
            if (e != null && (!TextUtils.isEmpty(e.getMessage()) || !TextUtils.equals(e.getMessage(), "connection not established"))) {
                JSONObject object = new JSONObject(e.getMessage());
                int errorCode = object.optInt("error_code", -1);
                if (errorCode == 3) {
                    Intent intent = new Intent(PhotonUrl.ACTION_PHOTON_CONNECTION_STATE_ERROR);
                    intent.putExtra(PhotonIntentDataUtils.ERROR_CODE, errorCode);
                    Utils.intentAction(PhotonApplication.mContext, intent);
                }
//                onStartPhotonError(true);
            } else {
//                onStartPhotonError(false);
            }
        } catch (Exception ce) {
            ce.printStackTrace();
            PhotonApplication.photonStatus = false;
//            onStartPhotonError(true);
        }

    }
}
