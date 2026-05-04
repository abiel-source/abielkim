"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

function SpinningHead() {
  const group = useRef();
  const { scene } = useGLTF("/robot.glb");
  // clone so this canvas has its own copy of the scene independent of the hero
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.6;
  });

  return (
    // shift down so the head sits near world origin — camera looks at [0,0,0] by default
    <group ref={group} position={[0, -0.55, 0]}>
      <Center>
        <primitive object={cloned} scale={0.6} />
      </Center>
    </group>
  );
}

export default function RobotFaceCanvas() {
  return (
    <Canvas
      frameloop="always"
      // slight angle so the face reads at icon size; looks at [0,0,0] by default
      camera={{ position: [0.15, 0.05, 1.3], fov: 22 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 2]} intensity={1.2} />
      <pointLight position={[-1, 1, -1]} intensity={0.4} color="#c68c2f" />
      <SpinningHead />
    </Canvas>
  );
}
