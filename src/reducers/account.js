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
    },
  accountList: [],
};

export const accountReducer = (state = accountInitState, { type, payload }) => {
    switch (type) {
        case 'setCurrentAccount':
            return { ...state, currentAccount: payload };
        default:
            return state;
    }
};
