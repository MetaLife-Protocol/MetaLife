import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {XHRImg} from '../../remote/rpm';
import {Image, Pressable, Text, View} from 'react-native';
import LoadingBar from '../../shared/comps/LoadingBar';
import schemaStyles from '../../shared/SchemaStyles';

// (Platform.OS === 'ios') ? {uri: './FMDemoBaseMap/FMMapBasic.html'} : {uri: 'file:///android_asset/FMDemoBaseMap/FMMapBasic.html'}
const Profiles = ({avatar}) => {
  const {text, row} = schemaStyles();
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({total: 0, loaded: 0});
  const img = useRef();
  useEffect(() => {
    avatar && loadPNG();
  }, [avatar]);

  function loadPNG() {
    console.log('loading avatar');
    setLoading(false);
    XHRImg(
      {
        model: avatar,
        scene: 'halfbody-portrait-v1',
        armature: 'ArmatureTargetFemale',
        blendShapes: {
          Wolf3D_Head: {
            mouthSmile: 0.2,
          },
        },
      },
      res => {
        console.log('refresh with: ', JSON.parse(res).renders);
        setLoading(true);
        setUri({uri: JSON.parse(res).renders[0]});
      },
    );
  }

  return (
    <>
      <Pressable onPress={loadPNG} onLongPress={() => console.log(img.current)}>
        <Image
          ref={img}
          onProgress={event => setProgress(event.nativeEvent)}
          onLoadEnd={() => console.log(img.current)}
          style={{width: '100%', height: '100%'}}
          source={uri}
        />
      </Pressable>
      <View style={[row, {position: 'absolute'}]}>
        <LoadingBar style={[]} loaded={loading} />
        <Text style={[text]}>{progress.loaded / progress.total}</Text>
      </View>
    </>
  );
};

const msp = s => {
  return {
    avatar: s.user.avatar,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
