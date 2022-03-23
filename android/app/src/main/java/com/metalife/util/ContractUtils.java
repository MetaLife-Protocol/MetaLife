package com.metalife.util;

/**
 * 合约地址工具类
 * */
public class ContractUtils {

    /**
     * erc20 smt 的合约地址
     * contact address for smt
     * */
    public static final String CONTACT_ADDRESS = Constants.GLOBAL_SWITCH_OPEN ? "0x21f15966e07a10554c364b988e91dab01d32794a" : "0xb1f2464fc8564533a114a879fb1348fc095381b8";

    /**
     * erc20 MESH合约地址
     * contact address for mesh
     * */
    public static final String CONTACT_MESH_ADDRESS = Constants.GLOBAL_SWITCH_OPEN ? "0xcf9fbffec9e0e5bbc62e79bf1965f5db76955661" : "0x2922cdc719087223aeb4e7e91ba0a4b3e1ddc8e5";

    /**
     * 光子合约地址
     * contact address for photon
     * */
    public static final String CONTACT_PHOTON_ADDRESS = Constants.GLOBAL_SWITCH_OPEN ? "0x242e0de2B118279D1479545A131a90A8f67A2512" :"0xc479184abeb8c508ee96e4c093ee47af2256cbbf";

    /**
     * SMT contact
     */
    public static final String SMT_CONTACT = "smt";

    /**
     * 挖矿绑定合约地址
     * */
    public static final String MINER_BIND_CONTACT = Constants.GLOBAL_SWITCH_OPEN ? "0x23fb7fa0f6f88ce56b70ac3d671315f5baf84bb9" : "0x7449931e38dd938d2e8558eda9fe225acf4d14e6";

    /**
     * 挖矿质押,赎回。开启关闭挖矿合约地址
     * */
    public static final String MINER_MORTGAGE_CONTACT = Constants.GLOBAL_SWITCH_OPEN ? "0xb9b4ece952c8005f009801e5ec78e116f528c1d0" : "0xe3d5627f6f854481b23da37cea623411bf090881";

    /**
     * Spectrum smt付费上网合约地址
     * */
    public static final String SMT_NET_CONTRACT = Constants.GLOBAL_SWITCH_OPEN ? "0x7a402cf6865262f6c24ff899a6993817c6ceaeef" : "0xa48f5b07a48c48a7cbfbc18ee3a649c2fa7a384c";
}
