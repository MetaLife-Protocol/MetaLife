package com.metalife.photon;


/**
 * Created by H on 2018/5/11.
 * Description:
 */

public class PhotonUrl {

    /**
     * 公链节点host,http协议
     */
//    public static String RAIDEN_URL_WS = "ws://10.13.0.1:18546";
//    public static String PHOTON_URL_WS = Constants.GLOBAL_SWITCH_OPEN ? "http://transport01.smartmesh.cn:44444" : "http://transport01.smartmesh.cn:17888";
//    public static String PHOTON_URL_WS = Constants.GLOBAL_SWITCH_OPEN ? "http://transport01.smartmesh.cn:44444" : "http://transport01.smartmesh.cn:17888";
//    public static String PHOTON_URL_WS = "http://transport01.smartmesh.cn:17888";
    public static String PHOTON_URL_WS = "http://transport01.smartmesh.cn:17888";
    /**
     * 光子部署的 Mesh token
     * 跟链上MESH 币的token一样
     */
    public static String PHOTON_MESH_TOKEN_ADDRESS = "0xF0123C3267Af5CbBFAB985d39171f5F5758C0900";

    /**
     * 光子部署的 SMT token
     */
//    public static String PHOTON_SMT_TOKEN_ADDRESS = Constants.GLOBAL_SWITCH_OPEN ? "0x6601F810eaF2fa749EEa10533Fd4CC23B8C791dc" : "0xF6e8A227cbD5257d2f8a764F5788ce56E3554cB5";
    public static String PHOTON_SMT_TOKEN_ADDRESS = "0xF6e8A227cbD5257d2f8a764F5788ce56E3554cB5";

    /**
     * udp 监听端口
     */
    public static String PHOTON_TRANSFER_PORT = "40001";

    /**
     * 暂时不知道干啥呢
     */
    public static int RAIDEN_CONNECTION_STATE_TIME = 2000;

    /**
     * MESH通讯 超时时间
     */
    public static int SETTLE_TIMEOUT = 20;

    /**
     * Photon 超时时间
     */
//    public static int PHOTON_SETTLE_TIMEOUT = Constants.GLOBAL_SWITCH_OPEN ? 40001 : 100;
    public static int PHOTON_SETTLE_TIMEOUT = 100;

    /**
     * 目前来看是光子网络启动状态的广播
     */
    public static final String ACTION_RAIDEN_CONNECTION_STATE = "com.lingtuan.firefly.raiden.connection.state";

    /**
     * 光子网络启动失败的广播
     */
    public static final String ACTION_PHOTON_CONNECTION_STATE_ERROR = "com.lingtuan.firefly.photon.connection.state_error";

    /**
     * 收到光子转账
     */
    public static final String ACTION_PHOTON_RECEIVER_TRANSFER = "com.lingtuan.firefly.photon_receiver_transfer";

    /**
     * 转出光子
     */
    public static final String ACTION_PHOTON_SENT_TRANSFER = "com.lingtuan.firefly.photon_sent_transfer";

    /**
     * 关闭通道，提现通知
     */
    public static final String ACTION_PHOTON_NOTIFY_CALL_ID = "com.lingtuan.firefly.photon_notify_call_id";

    /**
     * 通道状态变化
     */
    public static final String ACTION_PHOTON_NOTIFY_CALL_CHANNEL_INFO = "com.lingtuan.firefly.photon_notify_call_channel_info";

    /**
     * 合约调用变化
     */
    public static final String ACTION_PHOTON_NOTIFY_CALL_CONTRACT_INFO = "com.lingtuan.firefly.photon_notify_call_contract_info";


    /**
     * 转账成功
     */
    public static final String ACTION_PHOTON_NOTIFY_CALL_CHANNEL_TRANSFER_SUCCESS = "com.lingtuan.firefly.photon_notify_call_channel_transfer_success";

    /**
     * 转账失败
     */
    public static final String ACTION_PHOTON_NOTIFY_CALL_CHANNEL_TRANSFER_ERROR = "com.lingtuan.firefly.photon_notify_call_channel_transfer_error";

    /**
     * 上传光子日志
     */
    public static final String ACTION_PHOTON_RECEIVER_UPLOAD_LOG = "com.lingtuan.firefly.photon_receiver_upload_log";

    private static volatile PhotonUrl S_INST;

    public static PhotonUrl getInatance() {
        if (S_INST == null) {
            synchronized (PhotonUrl.class) {
                if (S_INST == null) {
                    S_INST = new PhotonUrl();
                }
            }
        }
        return S_INST;
    }

}
