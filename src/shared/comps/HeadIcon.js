import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {PeerIcons} from '../Icons';
import FastImage from 'react-native-fast-image';
import {WebView} from 'react-native-webview';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export default ({style = [], height = 60, width = 60, image, pub, online}) => (
  <View>
    {/*<Image*/}
    {/*  style={[*/}
    {/*    {height: height, width: width, borderRadius: height << 1},*/}
    {/*    ...style,*/}
    {/*  ]}*/}
    {/*  height={height}*/}
    {/*  width={width}*/}
    {/*  source={*/}
    {/*    image === PeerIcons.peerGirlIcon && pub ? PeerIcons.pubIcon : image*/}
    {/*  }*/}
    {/*/>*/}
    {/*<FastImage*/}
    {/*  style={[*/}
    {/*    {height: height, width: width, borderRadius: height << 1},*/}
    {/*    ...style,*/}
    {/*  ]}*/}
    {/*  source={*/}
    {/*    image === PeerIcons.peerGirlIcon && pub ? PeerIcons.pubIcon : image*/}
    {/*  }*/}
    {/*/>*/}
    <View
      style={[
        {height: height, width: width, borderRadius: height << 1},
        ...style,
      ]}>
      <WebView
        containerStyle={[{borderRadius: height << 1}]}
        source={{
          uri: 'http://10.13.230.223:3000',
        }}
      />
    </View>
    {online && online.length > 0 && (
      <View
        style={[
          styles.status,
          {
            top: height - 8,
            left: width - 8,
            backgroundColor:
              online[0][1].state === 'connected' ? '#63fd6f' : 'yellow',
          },
        ]}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  status: {
    position: 'absolute',
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});
