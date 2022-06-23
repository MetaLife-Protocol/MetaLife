/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  contractTransaction,
  createWallet,
  exportKeystore,
  exportPrivateKeyFromKeystore,
  exportPrivateKeyFromMnemonic,
  bigNumberFormatUnits,
  bigNumberParseUnits,
  getBalance,
  getContractBalance,
  getContractGasLimit,
  getContractNfts,
  getGasLimit,
  getGasPrice,
  getNonce,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  sendTransaction,
  signTransaction,
  waitForContractTransaction,
  waitForTransaction,
  getContract,
  getSignerContract,
} from 'react-native-web3-wallet';
const SMT_chainId = 20180430;
const ETH_chainId = 1;
const MLT_decmis = 18;
const MESH_decmis = 18;
const erc20ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const erc721ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

var keystore = {
  address: 'c978beb3b6be2e96c527a025a3f023045cca1fa9',
  id: 'aa5d0d9b-f65a-4d7b-97d7-e7610ef99065',
  version: 3,
  crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: {iv: '18a8ecd774d16a47eb53b8e43751bf81'},
    ciphertext:
      '4a21b238c8f277f8b0952ecd8d5e98922aab5a6b75f11fef5c703e4055c47570',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      n: 4096,
      p: 6,
      r: 8,
      salt: '90a6b0c368c3b48cf9d08911e8fd5d687498cfeb17a77fc040a5eb7ba14aa73d',
    },
    mac: '6819b1818570833db528e2dc9808302ee60b00fcc065f445d18df298e67def14',
  },
};

var keystoreManyverse = {
  address: '8b4b70cbfa3ed36a4fc0f245531530462686e69f',
  id: '7c529aaa-1ba1-4a2f-8295-f0b123a2a058',
  version: 3,
  Crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: {iv: 'e13acd85915586604b40ca5a69795b61'},
    ciphertext:
      '52d3f10075a629866ef148b1fcb1c882a2f32a5df25ba11ec5f0e43bd86f6083',
    kdf: 'scrypt',
    kdfparams: {
      salt: '6b1d3c1e6389134139011f5ae393048c57a0af1af27380ec0bf7c6f7399241be',
      n: 131072,
      dklen: 32,
      p: 1,
      r: 8,
    },
    mac: 'b41f5e86970b9a75f9d395557b1a93c7fd188f69b946a230a72d27d480ac9b0d',
  },
};
// getGasPrice('https://jsonapi1.smartmesh.io/')
//   .then(gasPrice => {
//     console.log('gasPrice', gasPrice.toString());
//     getNonce(
//       'https://jsonapi1.smartmesh.io/',
//       '0xc978beb3b6be2e96c527a025a3f023045cca1fa9',
//     )
//       .then(nonce => {
//         console.log('nonce', nonce);
//         contractTransaction(
//           'https://jsonapi1.smartmesh.io/',
//           // '0xa4c9af589c07b7539e5fcc45975b995a45e3f379',
//           '0xa27f8f580c01db0682ce185209ffb84121a2f711',
//           erc20ABI,
//           JSON.stringify(keystore),
//           'qwerty',
//           nonce,
//           0,
//           gasPrice,
//           '0x6025B091C6AB619F8e2F75170EB69dc57040dc6e',
//           '1',
//           MLT_decmis,
//         )
//           .then(tx => {
//             console.log('tx', tx);
//             waitForContractTransaction(tx)
//               .then(res => {
//                 console.log('res', res);
//               })
//               .catch(err => {
//                 console.log(err);
//               });
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });

// getGasPrice('https://jsonapi1.smartmesh.io/')
//   .then(gasPrice => {
//     console.log('gasPrice', gasPrice.toString());
//     getGasLimit(
//       'https://jsonapi1.smartmesh.io/',
//       '0xc978beb3b6be2e96c527a025a3f023045cca1fa9',
//       '0x6025B091C6AB619F8e2F75170EB69dc57040dc6e',
//       '0.02',
//       '',
//     )
//       .then(gasLimit => {
//         console.log('gasLimit', gasLimit.toString());
//         console.log('gas', bigNumberFormatUnits(gasPrice.mul(gasLimit)));

//         getNonce(
//           'https://jsonapi1.smartmesh.io/',
//           '0xc978beb3b6be2e96c527a025a3f023045cca1fa9',
//         )
//           .then(nonce => {
//             console.log('nonce', nonce);
//             signTransaction(
//               JSON.stringify(keystore),
//               'qwerty',
//               nonce,
//               gasLimit,
//               gasPrice,
//               '0x8b4b70cbfa3ed36a4fc0f245531530462686e69f',
//               SMT_chainId,
//               '0.1',
//               '',
//             )
//               .then(signedTx => {
//                 console.log('signedTx', signedTx);
//                 sendTransaction('https://jsonapi1.smartmesh.io/', signedTx)
//                   .then(resTx => {
//                     console.log(resTx);
//                     waitForTransaction(
//                       'https://jsonapi1.smartmesh.io/',
//                       resTx.hash,
//                     )
//                       .then(res => {
//                         console.log(res);
//                       })
//                       .catch(err => {
//                         console.log(err);
//                       });
//                   })
//                   .catch(err => {
//                     console.log(err);
//                   });
//               })
//               .catch(err => {
//                 console.log(err);
//               });
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });

// exportKeystore(JSON.stringify(keystore), 'qwerty')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// exportPrivateKeyFromKeystore(JSON.stringify(keystore), 'qwerty')
//   .then(res => {
//     console.log('privateKey export', res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// exportPrivateKeyFromMnemonic(
//   'shallow gauge banana life evidence miracle have pizza syrup help define leg',
//   "m/44'/60'/0'/0/0",
// )
//   .then(res => {
//     console.log('privateKey export', res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// importKeystore(JSON.stringify(keystore), 'qwerty')
//   .then(res => {
//     console.log('privateKey export', res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
importMnemonic(
  'coyote broccoli deny main skill siren among dove utility bachelor fox leisure scout slight cement stereo weekend priority parent vote canyon core poet connect',
  '123456',
)
  .then(res => {
    console.log('privateKey export', JSON.stringify(res));
  })
  .catch(err => {
    console.log(err);
  });

// importPrivateKey(
//   '0xca77d739a3dd95da05607167a8e78d8f8af66f8e0b602faccb6cf8e6f4a5c967',
//   '222222',
// )
//   .then(res => {
//     console.log('import', res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// //0 BTC 60  ETH
// createWallet('123456', "m/44'/60'/0'/0/0")
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// //eth
// getBalance('', '0xC978bEb3B6be2E96c527A025a3f023045CCA1Fa9')
//   .then(res => {
//     console.log(bigNumberFormatUnits(res));
//   })
//   .catch(err => {
//     console.log(err);
//   });
// //smt
// getBalance(
//   'https://jsonapi1.smartmesh.io/',
//   '0x8b4b70cbfa3ed36a4fc0f245531530462686e69f',
// )
//   .then(res => {
//     console.log(bigNumberFormatUnits(res));
//   })
//   .catch(err => {
//     console.log(err);
//   });

// //nft
// getContractBalance(
//   '',
//   '0x241CEc8387626e5ada11158b8c3169A0F67d8354',
//   erc721ABI,
//   '0x6772E08124A96fbca0125789a83DeF29e7262735',
// )
//   .then(res => {
//     console.log(bigNumberFormatUnits(res, 0));
//   })
//   .catch(err => {
//     console.log(err);
//   });
// getContractNfts(
//   '',
//   '0x241CEc8387626e5ada11158b8c3169A0F67d8354',
//   erc721ABI,
//   '0x6772E08124A96fbca0125789a83DeF29e7262735',
// )
//   .then(nfts => {
//     console.log(nfts);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// //mesh
// getContractBalance(
//   'https://jsonapi1.smartmesh.io/',
//   '0xa4c9af589c07b7539e5fcc45975b995a45e3f379',
//   erc20ABI,
//   '0x6025B091C6AB619F8e2F75170EB69dc57040dc6e',
// )
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// //mlt
// getContractBalance(
//   'https://jsonapi1.smartmesh.io/',
//   '0xa27f8f580c01db0682ce185209ffb84121a2f711',
//   erc20ABI,
//   '0x6025B091C6AB619F8e2F75170EB69dc57040dc6e',
// )
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// getSignerContract(
//   'https://jsonapi1.smartmesh.io/',
//   '0xa27f8f580c01db0682ce185209ffb84121a2f711',
//   erc20ABI,
//   JSON.stringify(keystore),
//   'qwerty',
// )
//   .then(contract => {
//     contract
//       .balanceOf('0x6025B091C6AB619F8e2F75170EB69dc57040dc6e')
//       .then(res => {
//         console.log(bigNumberFormatUnits(res));
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
