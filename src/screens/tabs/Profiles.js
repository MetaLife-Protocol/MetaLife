import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {XHRImg} from '../../remote/rpm';
import {Image, Pressable, Text} from 'react-native';
import LoadingBar from '../../shared/comps/LoadingBar';
import schemaStyles from '../../shared/SchemaStyles';

// (Platform.OS === 'ios') ? {uri: './FMDemoBaseMap/FMMapBasic.html'} : {uri: 'file:///android_asset/FMDemoBaseMap/FMMapBasic.html'}
const Profiles = ({avatar}) => {
  const {text} = schemaStyles();
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({total: 0, loaded: 0});
  useEffect(() => {
    loadPNG();
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
            mouthSmile: 1.2,
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
      <LoadingBar style={[{position: 'absolute'}]} loaded={loading} />
      <Text style={[text]}>{progress.loaded / progress.total}</Text>
      <Pressable onPress={loadPNG}>
        <Image
          onProgress={event => setProgress(event.nativeEvent)}
          style={{width: '100%', height: '100%'}}
          source={uri}
        />
      </Pressable>
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
