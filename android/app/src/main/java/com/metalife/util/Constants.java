package com.metalife.util;

/**
 * Created on 2017/8/22.
 * APP constants
 */

public class Constants {

    /**
     * The global total switch online
     * */
    public static final boolean GLOBAL_SWITCH_OPEN = true;

    /**
     * 光谱链的chain id
     * spectrum chain id
     * 主网  测试网络
     * */
    public static final int TRANS_CHAIN_ID = Constants.GLOBAL_SWITCH_OPEN ? 20180430 : 3;

//    /**
//     * 光谱链的chain id
//     * spectrum chain id
//     * 主网  开发网络
//     * */
//    public static final int TRANS_CHAIN_ID = Constants.GLOBAL_SWITCH_OPEN ? 20180430 : 4;

    /**
     * 以太坊的chain id
     * eth chain id
     * */
    public static final byte TRANS_ETH_CHAIN_ID = Constants.GLOBAL_SWITCH_OPEN ? 1 : 3;

    /**
     * 挖矿抵押金额
     * */
    //public static final String MINER_TRANS_VALUE = Constants.GLOBAL_SWITCH_OPEN ? "880000" : "440000";
    public static final String MINER_TRANS_VALUE = "440000";

    /**
     * 映射签名用到
     * mapping sing
     * */
    public static final String WALLET_MAPPING_SIGN = "e6ada4e7adbee5908de4bb85e4be9b536d6172744d657368e4b8bbe7bd91e698a0e5b084e7adbee5908de8aea4e8af81e4bdbfe794a821";

    /**
     * 用户须知h5
     * use agree
     * */
    public static final String USE_AGREE_ZH = "https://smartmesh.io/smart/document/ch/softwareServices.html";
    public static final String USE_AGREE_EN = "https://smartmesh.io/smart/document/softwareServices.html";


    /**
     * 光子用户须知h5
     * use agree
     * */
    public static final String PHOTON_USE_AGREE_ZH = "http://photon.smartmesh.cn/photon_cn_faq.html";
    public static final String PHOTON_USE_AGREE_EN = "http://photon.smartmesh.cn/photon_en_faq.html";

    /**
     * 挖矿说明h5
     * use agree
     * */
    public static final String MINER_HELPER_ZH = "http://spectrum.smartmesh.cn/spectrum_cn_miner.html";
    public static final String MINER_HELPER_EN = "http://spectrum.smartmesh.cn/spectrum_en_miner.html";

    /**
     * 转账须知h5
     * transfer mode
     * */
    public static final String TRANSFER_MODE_ZH = "https://smartmesh.io/smart/document/ch/transferMode.html";
    public static final String TRANSFER_MODE_EN = "https://smartmesh.io/smart/document/transferMode.html";

    /**
     * 提交token h5
     * submit token
     * */
    public static final String SUBMIT_TOKEN_ZH = "http://open.smartmesh.io/document/ch/howToSubmitToken.html";
    public static final String SUBMIT_TOKEN_EN = "http://open.smartmesh.io/document/howToSubmitToken.html";

    public static final String SPECTRUM_BROWSER = Constants.GLOBAL_SWITCH_OPEN ?  "https://spectrum.pub/" : "https://chain.smartmesh.cn/";

    /**
     * Refresh the friends list
     */
    public static boolean isRefresh = false;

    /**
     * Cut images returned by the callback url
     */
    public static final int REQUEST_CODE_PHOTO_URL = 60000;

    /**
     * Photo modified head
     */
    public static final int CAMERA_WITH_DATA = 0x02;


    /**
     * From revision picture album
     */
    public static final int PHOTO_PICKED_WITH_DATA = 0x03;


    /**
     * Cut the image size
     */
    public static final int MAX_IMAGE_WIDTH = 1280;

    public static final int MAX_IMAGE_HEIGHT = 1280;

    /**
     * Cut the picture quality
     */
    public static final int MAX_KB = 150;
    /**
     * Cut the picture quality
     */
    public static final int MIN_KB = 20;

    /**
     * Wide high minimum cut images
     */
    public static final int MAX_SCALE = 3;

    /**
     * Chat to send small icon file
     */
    public static final String CHAT_SEND_FILE = "chat_send_file";

    public static final int COUNTRY_CODE_RESULT = 900;// Choose the country code callback

    /**
     * transaction need confirm block
     * */
    public static final int NEED_CONFIRM_BLOCK = 17;
    /**
     * SMT Everyone
     */
    public static final String APP_EVERYONE = "everyone";

    /**
     * SMT Everyone
     */
    public static final String APP_MESH = "mesh";

    /**
     * 无网聊天室id
     */
    public static final String APP_TANGO_OFFLINE = "tango_offline";


    /**
     * SMT connection address identifier
     */
    public static final String APP_URL_FLAG = "smartmesh.io";

    /**
     * group
     */
    public static final String URL_DISCUSS = "https://smartmesh.io/smart/app/qrgroup.html?gid=";

    /*password*/
    public static final String PASSWORD = "password";
    /*Name of the wallet*/
    public static final String WALLET_NAME= "wallet_name";
    /*The wallet address*/
    public static final String WALLET_ADDRESS= "wallet_address";

    public static final String WALLET_CONTACT= "wallet_contact";

    /*Wallet marked whether I will be able to export the private key can 0 can't 1*/
    public static final String WALLET_EXTRA= "wallet_extra";

    /*Wallet has backup true or not*/
    public static final String WALLET_BACKUP= "wallet_backup";

    /*Wallet has select true or not*/
    public static final String WALLET_SELECT= "wallet_select";

    /*The private key*/
    public static final String PRIVATE_KEY = "private_key";

    /*The mnemonic*/
    public static final String MNEMONIC = "mnemonic";

    /*KeyStore*/
    public static final String KEYSTORE = "keystore";

    /*The wallet information*/
    public static final String WALLET_INFO = "wallet_info";

    public static final String WALLET_PWD_INFO = "wallet_pwd_info";


    /*The wallet icon*/
    public static final String WALLET_IMAGE = "wallet_image";

    /*Backup the wallet type*/
    public static final String WALLET_TYPE= "wallet_type";

    public static final String GESTURE_PASSWORD = "GesturePassword_";

    /*add token to list*/
    public static final String WALLET_ADD_TOKEN = "com.lingtuan.firefly.wallet_add_token";
    /*bind token to list*/
    public static final String WALLET_BIND_TOKEN = "com.lingtuan.firefly.wallet_bind_token";

    /*wallet update name to list*/
    public static final String WALLET_UPDATE_NAME = "com.lingtuan.firefly.wallet_update_name";

    /*Create (import) wallet success*/
    public static final String WALLET_SUCCESS = "com.lingtuan.firefly.wallet_success";

    public static final String WALLET_REFRESH = "com.lingtuan.firefly.wallet_refresh";
    /*Failed to create (import) purse*/
    public static final String WALLET_ERROR = "com.lingtuan.firefly.wallet_error";

    /*Create (import) wallet out of memory*/
    public static final String NO_MEMORY = "com.lingtuan.firefly.no_memory";
    /*Import the wallet password mistake*/
    public static final String WALLET_PWD_ERROR = "com.lingtuan.firefly.wallet_pwd_error";

    /*Import the wallet to repeat*/
    public static final String WALLET_REPEAT_ERROR = "com.lingtuan.firefly.wallet_repeat_error";

    /*To delete the wallet success refresh the page*/
    public static final String WALLET_REFRESH_DEL = "com.lingtuan.firefly.wallet_refresh_del";

    /*backup success refresh the page*/
    public static final String WALLET_REFRESH_BACKUP = "com.lingtuan.firefly.wallet_refresh_backup";

    /*backup success refresh the page*/
    public static final String WALLET_REFRESH_MNEMONIC = "com.lingtuan.firefly.wallet_refresh_mnemonic";

    /*To delete the wallet success refresh the page*/
    public static final String WALLET_REFRESH_GESTURE = "com.lingtuan.firefly.wallet_refresh_gesture";

    /*To add wallet success refresh the page*/
    public static final String WALLET_REFRESH_SHOW_HINT = "com.lingtuan.firefly.wallet_refresh_show_hint";

    /*To mapping the wallet success refresh the page*/
    public static final String WALLET_REFRESH_MAPPING = "com.lingtuan.firefly.wallet_refresh_mapping";

    public static final String ACTION_SELECT_CONTACT_REFRESH = "com.lingtuan.firefly.contact.refresh";


    public static final String ACTION_REFRESH_FRIEND_INBLACK = "com.lingtuan.firefly.refresh_friend_isinblack";

    /**删除好友*/
    public static final String ACTION_REFRESH_FRIEND_DELETE = "com.lingtuan.firefly.refresh_friend_delete";

    public static final String OPEN_SMARTMESH_NETWORE = "com.lingtuan.firefly.open_smartmesh_network";

    public static final String CLOSE_SMARTMESH_NETWORE = "com.lingtuan.firefly.close_smartmesh_network";

    public static final String REQUEST_INSTALL_PACKAGE = "com.lingtuan.firefly.request_install_package";


    /**
     * Version update
     */
    public static final String ACTION_UPDATE_VERSION = "com.lingtuan.firefly.updateversion";

    /**
     * Unread messages scroll
     */
    public static final String ACTION_SCROLL_TO_NEXT_UNREAD_MSG = "com.lingtuan.firefly.scrolltonextunreadmsg";

    /**
     * More pictures to send
     */
    public static final String ACTION_CHATTING_PHOTO_LIST = "com.lingtuan.firefly.chatting.photolist";

    /**
     * Album group browse pictures broadcast the action
     */
    public static final String BROADCAST_ACTION = "com.lingtuan.firefly.child_photo_filter";

    /**
     * User to update, upload pictures broadcast the action
     */
    public static final String BROADCAST_UPDATE_USER = "com.lingtuan.firefly.broadcast_update_user";

    /**
     * More pictures to send
     */
    public static final String ACTION_CHATTING_FRIEND_NOTE = "com.lingtuan.firefly.chattingui.friendnote";

    public static final String ACTION_START_UPLOAD_FILE = "com.lingtuan.firefly.upload.file.start";//To upload
    public static final String ACTION_CANCEL_UPLOAD_FILE = "com.lingtuan.firefly.upload.file.cancel";//Cancel the upload

    public static final String ACTION_START_DOWNLOAD_FILE = "com.lingtuan.firefly.download.file.start";//Start the download
    public static final String ACTION_CANCEL_DOWNLOAD_FILE = "com.lingtuan.firefly.download.file.";//Cancel the download
    public static final String ACTION_COLLECT_FILE = "com.lingtuan.firefly.file.collect";//File collection successful
    public static final String ACTION_CANCEL_COLLECT_FILE = "com.lingtuan.firefly.file.cancel.collect";//Successfully cancelled file collection
    public static final String ACTION_DOWNLOAD_CHAT_FILE_SUCCESS = "com.lingtuan.firefly.action_download_chat_file_success";//File download successful radio action
    public static final String ACTION_DOWNLOAD_CHAT_FILE_FAILED = "com.lingtuan.firefly.action_download_chat_file_failed";//Broadcast action file download failure
    public static final String ACTION_DOWNLOAD_CHAT_FILE = "com.lingtuan.firefly.action_download_chat_file";//File download progress radio action

    public static final String ACTION_GESTURE_LOGIN = "com.lingtuan.firefly.action_grsture_login";//gesture login

    //Close the guide page
    public static final String ACTION_CLOSE_GUID = "com.lingtuan.firefly.action_close_guid";

    //Network monitoring radio
    public static final String ACTION_NETWORK_RECEIVER = "com.lingtuan.firefly.newwork_receiver";


    public static final String MSG_REPORT_SEND_MSG_RESULT = "com.lingtuan.firefly_MSG_REPORT_SEND_MSG_RESULT";// Chat messages sent
    public static final String MSG_REPORT_SEND_MSG_PROGRESS = "com.lingtuan.firefly_MSG_REPORT_SEND_MSG_PROGRESS";// Send the file progress
    public static final String MSG_REPORT_START_RECV_FILE = "com.lingtuan.firefly_MSG_REPORT_START_RECV_FILE";// Begin to receive files
    public static final String MSG_REPORT_CANCEL_RECV_FILE = "com.lingtuan.firefly_MSG_REPORT_CANCEL_RECV_FILE";// Cancel the receiving documents
    public static final String MSG_REPORT_CANCEL_SEND_FILE = "com.lingtuan.firefly_MSG_REPORT_CANCEL_SEND_FILE";// Cancel the receiving documents

    /**
     * Choose members of the group chat
     */
    public static final int REQUEST_SELECT_GROUP_MEMBER = 1039;


    /***************************No net related*****************************/
    public static final int LISTEN_PORT = 8988;
    public static final int SOCKET_TIMEOUT = 5000;
    public static final int COMMAND_ID_SEND_TYPE_SYSTEM = 100;// Only the json data countless according to flow
    public static final int COMMAND_ID_SEND_TYPE_NORMALCHAT = 101;// Contains the data flow
    public static final int COMMAND_ID_SEND_TYPE_ROOMCHAT = 102;// Contains the data flow
    public static final int COMMAND_ID_SEND_TYPE_ROOMCHAT_OFFLINE = 103;//无网聊天室 区别everyone
    public static final String OFFLINE_MEMBER_LIST = "com.lingtuan.firefly.offline_member_list";// New offline users
    public static final int MSG_SERVICE_POOL_START = 10; // Open shop number of threads
    /**
     * Is connected to the network
     */
    public static boolean isConnectNet = true;

    /*eth amount*/
    public static final String AOMUNT_ETH = "?amount=&token=ETH";
    /*smt amount*/
    public static final String AOMUNT_SMT = "?amount=&token=SMT";
    public static final String AOMUNT_MESH = "?amount=&token=MESH";


}
