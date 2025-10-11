import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { Radio } from "./Radio";
import * as THREE from "three";
import { Dance } from "./Dance";

const HeroExperience = () => {
  return (
    <Canvas camera={{ position: [0, 0, 16], fov: 45 }}>
      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={80} />
        {/* Optional rotate control */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
          }}
        />
        <group
          position={[0, 0, 0]}
          scale={[0.025, 0.025, 0.025]}
          rotation={[0, 0, 0]}
        >
          <Dance />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
