/**
 * Created on 25 Apr 2022 by pudgefury
 */

const accountInitState = {
    currentAccount: {
        Name: '',
        Password: '',
        PassPrompt: '',
        isBackup: false,
        Mnemonic: '',
        Address: '',
        PrivateKey: '',
        Keystore: '',
        Balance: 0,
    },
    accountList: [],
    currentIndex: 0,
    currentPassword: '',
    addressBook: [],
    tokenType: '',
};

export const accountReducer = (state = accountInitState, { type, payload }) => {
    switch (type) {
        case 'setTokenType':
            state.tokenType = payload;
        case 'addAddressInfo':
            if (!payload) {
                return;
            }
            if (state.addressBook === undefined) {
                state.addressBook = [];
            }
            state.addressBook.push(payload);
        case 'deleteAddressInfo':
            state.addressBook.map((one, index) => {
                if (index === payload) {
                    state.addressBook.splice(index, 1);
                    return state;
                }
            })
        case 'setCurrentPassword':
            return { ...state, currentPassword: payload };
        case 'deleteAccount':
            if (state.accountList.length === 1)
                return state;
            state.accountList.map((one, index) => {
                if (one.Address === payload) {
                    state.accountList.splice(index, 1);
                    return state;
                }
            });
        case 'addAccount':
            if (!payload.PrivateKey) {
                return;
            }
            state.accountList.map((one, index) => {
                if (one.Address === payload.Address) {
                    return;
                }
            });
            state.accountList.push(payload);
        case 'setCurrentAccount':
            return { ...state, currentAccount: payload };
        case 'setCurrenIndex':
            return { ...state, currentIndex: payload};
        default:
            return state;
    }
};
