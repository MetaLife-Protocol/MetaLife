package com.metalife.photon;

import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.math.BigDecimal;
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

    @ReactMethod
    public void createChannelMethod(String photonTokenAddress, String partnerAddress, String depositBalance, Promise promise) {
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
                }catch (Exception e){
                    e.printStackTrace();
//                    mView.createChannelError();
                }
            });
        } catch (Exception e) {

        }

    }

    @ReactMethod
    public void startPhotonServer(String privateKey, String ethRPCEndPoint, Promise promise) {
        try {
//            if (NextApplication.photonStatus && NextApplication.api == null ){
//                return;
//            }
//            final String tempAddress = WalletInfoUtils.getInstance().getSelectAddress();
            PhotonThreadPoolUtils.getInstance().getPhotonThreadPool().execute(() -> {
                try {
//                    if (NextApplication.api != null && NextApplication.photonStatus) {
//                        if(NextApplication.mRaidenSubscribe !=null){
//                            NextApplication.mRaidenSubscribe.unsubscribe();
//                        }
//                        NextApplication.api.stop();
//                        NextApplication.api = null;
//                        NextApplication.photonStatus = false;
//                        NextApplication.photonStatusStatus = false;
//                    }
//                    String clientIP = PhotonNetUtil.getInstance().getCurWifiIp();
//                    if (TextUtils.isEmpty(clientIP)){
//                        clientIP = "0.0.0.0";
//                    }
//                    String fileName = "photon_log" + "(" + tempAddress + ")" + ".txt";
//                    SDCardCtrl.checkPathExist();
//                    File logFile = new File(SDCardCtrl.getPhotonErrorLogPath(), fileName);
//                    if (!logFile.exists()) {
//                        logFile.createNewFile();
//                    }
//                    NextApplication.mRaidenStatusVo = new RaidenStatusVo();
//                    mRaidenStatusVo.setEthStatus(PhotonStatusType.Default);
//                    mRaidenStatusVo.setXMPPStatus(PhotonStatusType.Default);
//                    Bundle bundle = new Bundle();
//                    Utils.intentAction(mContext, PhotonUrl.ACTION_RAIDEN_CONNECTION_STATE, bundle);
//                    NextApplication.photonStatus = true;
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
//                    Strings otherArg= Mobile.newStrings(1);
//                    String arg = Constants.GLOBAL_SWITCH_OPEN ? "--xmpp" : "--matrix";
//                    otherArg.set(0,arg);
//                    String dataDir = Constants.GLOBAL_SWITCH_OPEN ? NextApplication.mContext.getFilesDir().getAbsolutePath() + SDCardCtrl.PHOTON_DATA
//                            : NextApplication.mContext.getFilesDir().getAbsolutePath() + SDCardCtrl.RAIDEN_DATA;
//                    NextApplication.api = Mobile.startUp(
//                            Numeric.prependHexPrefix(privateKey),
//                            TextUtils.isEmpty(ethRPCEndPoint) ? PhotonUrl.PHOTON_URL_WS : ethRPCEndPoint,
//                            dataDir,
//                            "127.0.0.1:5001",
//                            clientIP + ":40001",
//                            logFile.getAbsolutePath(),
//                            ContractUtils.CONTACT_PHOTON_ADDRESS,
//                            otherArg);
//                    NextApplication.mRaidenSubscribe = NextApplication.api.subscribe(new NotifyHandler() {
//
//                        @Override
//                        public void onError(long l, String s) {
//                            NextApplication.photonStatus = false;
//                            onStartPhotonError(true);
//                        }
//
//                        @Override
//                        public void onNotify(long l, String s) {
//                            onPhotonNotify(l,s);
//                        }
//
//                        @Override
//                        public void onReceivedTransfer(String s) {
//                            updateChannelBalance(s);
//                        }
//
//                        @Override
//                        public void onStatusChange(String s) {
//                            updateStatusChanged(s);
//                        }
//                    });
                } catch (Exception e) {
//                    startUpError(e);
                }
            });
        } catch (Exception e) {
//            startUpError(e);
        }
    }
}
