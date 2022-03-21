package com.metalife.photon.entity;

import java.io.Serializable;

public class PhotonPayEntity implements Serializable {

    //接收方地址
    private String toAddress;
    //转账金额
    private String total;
    //转账携带参数
    private String data;
    //光谱付费上网合约地址
    private String contractaddr;
    //手机mac地址
    private String phoneMac;

    public String getPhoneMac() {
        return phoneMac;
    }

    public void setPhoneMac(String phoneMac) {
        this.phoneMac = phoneMac;
    }

    public String getContractaddr() {
        return contractaddr;
    }

    public void setContractaddr(String contractaddr) {
        this.contractaddr = contractaddr;
    }

    public String getToAddress() {
        return toAddress;
    }

    public void setToAddress(String toAddress) {
        this.toAddress = toAddress;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
