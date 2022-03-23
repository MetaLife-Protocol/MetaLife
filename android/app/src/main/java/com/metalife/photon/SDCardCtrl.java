package com.metalife.photon;

import android.content.Context;
import android.os.Environment;
import android.os.StatFs;
import android.text.TextUtils;

import com.metalife.util.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

/**
 * Folder control class
 */
public class SDCardCtrl {

    /**
     * The log cat Tag
     */
    public static final String TAG = "SDCheck";

    /**
     * 隐藏文件
     */
    public static String HIDDEN_ROOT_PATH = "/.smartmesh";

    /**
     * 普通文件路径
     * */
    public static String ROOT_PATH = "/smartmesh";

    /**
     * UPLOADPATH
     */
    public static String UPLOADPATH = "/upload";

    /**
     * QRCODEPATH
     */
    public static String QRCODEPATH = "/qrcode";

    public static String DOWNLOAD = "/download";

    /**
     * Wallet path
     * */
    public static String WALLERPATH = "/ethereum/keystore";

    /**
     * raiden data
     * */
    public static String RAIDEN_DATA = "/ethereum/data";

    /**
     * photon db data
     * */
    public static String PHOTON_DATA = "/ethereum/photonData";

    /**
     * raiden pass
     * */
    public static String RAIDEN_PASS = "/ethereum/pass";


    /**
     * ERRORLOGPATH
     */
    public static String ERRORLOGPATH = "/ErrorLog";

    /**
     * OFFLINE
     */
    public static String OFFLINE = "/offLine";

    /**
     * OFFLINE
     */
    public static String FILE = "/file";


    /**
     * TEMPATH
     */
    public static String TEMPATH = "/tempPath";

    /**
     * ChatPATH
     */
    public static String CHATPATH = "/chat";

    /**
     * IMAGEPATH
     */
    public static String IMAGEPATH = "/images";

    public static String VIDEO = "/video";


    public static String AUDIO = "/audio";

    /**
     * FACE
     */
    public static String FACE = "/face";

    /**
     * CHAT_FILE
     */
    public static String CHAT_FILE_PATH = "/file";

    /**
     * 光子 错误日志
     */
    public static String PHOTON_ERROR_LOG = "/PhotonErrorLog";

    public static String getPhotonErrorLogPath() {
        return PHOTON_ERROR_LOG;
    }


    /**
     * @return ROOTPATH
     */
    public static String getCtrlCPath() {
        return HIDDEN_ROOT_PATH;
    }

    public static String getErrorLogPath() {
        return ERRORLOGPATH;
    }

    /**
     * @return OFFLINE
     */
    public static String getOfflinePath() {
        return OFFLINE;
    }


    public static String getOfflineDownloadPath() {
        return DOWNLOAD;
    }

    /**
     * @return UPLOADPATH
     */
    public static String getUploadPath() {
        return UPLOADPATH;
    }

    /**
     * @return NEXTDYNAMICPATH
     */
    public static String getChatImagePath() {
        return IMAGEPATH;
    }
    /**
     * @return FILE
     */
    public static String getFilePath() {
        return FILE;
    }

    /**
     * @return AUDIO
     */
    public static String getAudioPath() {
        return AUDIO;
    }

    /**
     * @return TEMPATH
     */
    public static String getTempPath() {
        return TEMPATH;
    }

    public static String getQrcodePath() {
        return QRCODEPATH;
    }

    /**
     * @return Is or not exist SD card
     */
    public static boolean sdCardIsExist() {
        return Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED);
    }

    /**
     * <Build data file for this application >
     */
    public static void initPath(Context context) {
        String ROOT;
        if (sdCardIsExist()) {
            ROOT = Environment.getExternalStorageDirectory().getPath();
        } else {
            ROOT = "/mnt/sdcard";
        }
        if (HIDDEN_ROOT_PATH.equals("/.smartmesh")) {
            //根目录
            HIDDEN_ROOT_PATH = ROOT + HIDDEN_ROOT_PATH;
            ROOT_PATH = ROOT + ROOT_PATH;

            //隐藏文件目录
            ERRORLOGPATH = HIDDEN_ROOT_PATH + ERRORLOGPATH;
            UPLOADPATH = HIDDEN_ROOT_PATH + UPLOADPATH;
            TEMPATH = HIDDEN_ROOT_PATH + TEMPATH;
            OFFLINE = HIDDEN_ROOT_PATH + OFFLINE;
            FILE = HIDDEN_ROOT_PATH + FILE;
            IMAGEPATH = HIDDEN_ROOT_PATH + IMAGEPATH;
            VIDEO = HIDDEN_ROOT_PATH + VIDEO;
            AUDIO = HIDDEN_ROOT_PATH + AUDIO;
            FACE = HIDDEN_ROOT_PATH + FACE;
            CHATPATH = HIDDEN_ROOT_PATH + CHATPATH;
            CHAT_FILE_PATH = CHATPATH + CHAT_FILE_PATH;

            //显示文件目录
            QRCODEPATH = ROOT_PATH + QRCODEPATH;
            DOWNLOAD = ROOT_PATH + DOWNLOAD;
            PHOTON_ERROR_LOG = ROOT_PATH +  PHOTON_ERROR_LOG;
        }
        SDFileUtils.getInstance().createDir(HIDDEN_ROOT_PATH);
        SDFileUtils.getInstance().createDir(ROOT_PATH);
        SDFileUtils.getInstance().createDir(ERRORLOGPATH);
        SDFileUtils.getInstance().createDir(PHOTON_ERROR_LOG);
        SDFileUtils.getInstance().createDir(UPLOADPATH);
        SDFileUtils.getInstance().createDir(QRCODEPATH);
        SDFileUtils.getInstance().createDir(TEMPATH);
        SDFileUtils.getInstance().createDir(OFFLINE);
        SDFileUtils.getInstance().createDir(CHATPATH);
        SDFileUtils.getInstance().createDir(IMAGEPATH);
        SDFileUtils.getInstance().createDir(VIDEO);
        SDFileUtils.getInstance().createDir(AUDIO);
        SDFileUtils.getInstance().createDir(FACE);
        SDFileUtils.getInstance().createDir(CHAT_FILE_PATH);
//        SDFileUtils.getInstance().createDir(context.getFilesDir().getAbsolutePath()+ETHEREUM);
        SDFileUtils.getInstance().createDir(context.getFilesDir().getAbsolutePath() + WALLERPATH);
        SDFileUtils.getInstance().createDir(context.getFilesDir().getAbsolutePath() + RAIDEN_DATA);
        SDFileUtils.getInstance().createDir(context.getFilesDir().getAbsolutePath() + PHOTON_DATA);
        SDFileUtils.getInstance().createDir(context.getFilesDir().getAbsolutePath() + RAIDEN_PASS);
//        SDFileUtils.getInstance().createDir(context.getFilesDir().getAbsolutePath() + DROIDPATH);
    }

    /**
     * 启动光子之前 检测相关文件夹是否存在
     * */
    public static void checkPathExist(){
        SDFileUtils.getInstance().createDir(getCtrlCPath());
        SDFileUtils.getInstance().createDir(getPhotonErrorLogPath());
        SDFileUtils.getInstance().createDir(PhotonApplication.mContext.getFilesDir().getAbsolutePath() + WALLERPATH);
        SDFileUtils.getInstance().createDir(PhotonApplication.mContext.getFilesDir().getAbsolutePath() + RAIDEN_DATA);
        SDFileUtils.getInstance().createDir(PhotonApplication.mContext.getFilesDir().getAbsolutePath() + PHOTON_DATA);
    }

    /**
     * Check the SDcard useful space
     *
     * @return
     */
    public static boolean checkSpace() {
        String path = Environment.getExternalStorageDirectory().getPath();
        StatFs statFs = new StatFs(path);
        int blockSize = statFs.getBlockSize() / 1024;
        int blockCount = statFs.getBlockCount();
        int usedBlocks = statFs.getAvailableBlocks() / 1024;
        int totalSpace = blockCount * blockSize / 1024;
        int avaliableSpace = totalSpace - usedBlocks;
        return avaliableSpace >= 64;
    }

    /**
     * to copy a single file
     * @ param oldPath String the original file path Such as: c: / FQF. TXT
     * @ param newPath String copied after the path Such as: f: / FQF. TXT
     * @return boolean
     */
    public static void copyFile(String oldPath, String newPath) {
        try {
            int byteread = 0;
            File oldfile = new File(oldPath);
            if (oldfile.exists()) {  //File exists
                InputStream inStream = new FileInputStream(oldPath);  //Read the original file
                FileOutputStream fs = new FileOutputStream(newPath);
                byte[] buffer = new byte[1024];
                while ((byteread = inStream.read(buffer)) != -1) {
                    fs.write(buffer, 0, byteread);
                }
                inStream.close();
                fs.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * <Save the App crash info to sdcard>
     */
    public static String saveCrashInfoToFile(String excepMsg) {
        if (TextUtils.isEmpty(excepMsg)) {
            return "";
        }
        String errorlog = getErrorLogPath();
        FileWriter fw = null;
        PrintWriter pw = null;
        File logFile = null;
        try {
            StringBuilder logSb = new StringBuilder();
            logSb.append("crashlog");
            logSb.append("(");
            logSb.append(Utils.getSimpDate());
            logSb.append(")");
            logSb.append(".txt");
            logFile = new File(errorlog, logSb.toString());
            if (!logFile.exists()) {
                logFile.createNewFile();
            }
            fw = new FileWriter(logFile, true);
            pw = new PrintWriter(fw);
            pw.write(excepMsg);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pw != null) {
                pw.flush();
                pw.close();
            }
            if (fw != null) {
                try {
                    fw.close();
                } catch (IOException e) {
                }
            }
        }
        return logFile == null ? "" : logFile.getAbsolutePath();
    }
}
