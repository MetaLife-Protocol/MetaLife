package com.metalife.util;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created on 2017/8/18.
 */

public class Utils {

    /**
     * send broadcast
     *
     * @ param action filters
     * @ param bundle parameters
     */
    public static void intentAction(Context mContext, String action, Bundle bundle) {
        if (!TextUtils.isEmpty(action)) {
            Intent intent = new Intent(action);
            if (bundle != null)
                intent.putExtra(action, bundle);
            if (mContext != null)
                mContext.sendBroadcast(intent);
        }
    }

    public static void intentAction(Context mContext, Intent intent) {
        mContext.sendBroadcast(intent);
    }

    /**
     * Record application error log when used
     */
    public static final String getSimpDate() {
        Date currentDate = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        currentDate = Calendar.getInstance().getTime();
        return formatter.format(currentDate);
    }
}


