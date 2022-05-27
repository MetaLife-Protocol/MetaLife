import React, {Suspense} from 'react';
import {connect} from 'react-redux/lib/exports';
import {useLoader} from '@react-three/fiber/native';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {Text} from 'react-native';

const Profiles = ({avatar}) => {
  function Avatar(props) {
    // https://d1a370nemizbjq.cloudfront.net/e72d0bd0-de91-4d38-a7d2-0378823ccfd7.glb
    // '../../assets/glb/avatar.glb'
    const result = useLoader(GLTFLoader, '../../assets/glb/avatar.glb');
    return <primitive object={result.scene} />;
  }

  function FallbackComponent() {
    return <Text>loading...</Text>;
  }

  return (
    <Suspense fallback={<FallbackComponent />}>
      <Avatar />
    </Suspense>
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
