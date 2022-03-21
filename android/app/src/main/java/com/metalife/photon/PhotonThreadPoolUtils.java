package com.metalife.photon;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PhotonThreadPoolUtils {

    private static volatile PhotonThreadPoolUtils S_INST;

    public static ExecutorService mPhotonThreadPool;

    public static PhotonThreadPoolUtils getInstance() {
        if (S_INST == null) {
            synchronized (PhotonThreadPoolUtils.class) {
                if (S_INST == null) {
                    S_INST = new PhotonThreadPoolUtils();
                }
            }
        }
        return S_INST;
    }

    /**
     * 创建可缓存线程池
     * */
    public ExecutorService getPhotonThreadPool(){
        if (mPhotonThreadPool == null){
            mPhotonThreadPool = Executors.newCachedThreadPool();
        }
        return mPhotonThreadPool;
    }

}
