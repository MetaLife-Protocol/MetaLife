import React, {useRef, useState, Suspense} from 'react';
import {connect} from 'react-redux/lib/exports';
import {Canvas, useFrame, useLoader} from '@react-three/fiber/native';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

function Box(props) {
  const mesh = useRef(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={event => setActive(!active)}
      onPointerOver={event => setHover(true)}
      onPointerOut={event => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const Profiles = ({avatar}) => {
  function Avatar(props) {
    const avatarMesh = useRef(null);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    //https://d1a370nemizbjq.cloudfront.net/e72d0bd0-de91-4d38-a7d2-0378823ccfd7.glb
    const gltf = useLoader(GLTFLoader, require('../../assets/glb/avatar.glb'));
    useFrame((state, delta) => (avatarMesh.current.rotation.y += 0.01));
    return (
      <mesh
        {...props}
        ref={avatarMesh}
        scale={active ? 1.5 : 1}
        onClick={event => setActive(!active)}
        onPointerOver={event => setHover(true)}
        onPointerOut={event => setHover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    );
  }

  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Avatar />
      </Suspense>
    </Canvas>
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
