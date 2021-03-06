import {StyleSheet, View} from 'react-native';
import React, {useRef} from 'react';
import {PeerIcons} from '../Icons';
import FastImage from 'react-native-fast-image';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export default ({
  style = [],
  height = 60,
  width = 60,
  image,
  avatar,
  pub,
  online,
}) => {
  const onlineRender = false;
  const webview = useRef(null);
  function loadedHandler() {
    webview.current.injectJavaScript(`setUrl('${avatar}');true;`);
  }
  return (
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
      <FastImage
        style={[
          {height: height, width: width, borderRadius: height << 1},
          ...style,
        ]}
        source={
          image === PeerIcons.peerGirlIcon && pub ? PeerIcons.pubIcon : image
        }
      />
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
};

const styles = StyleSheet.create({
  status: {
    position: 'absolute',
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});
