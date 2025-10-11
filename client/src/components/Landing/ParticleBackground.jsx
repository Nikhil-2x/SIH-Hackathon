import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import * as THREE from "three";

const ParticleBackground = ({ showControls = false, children }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    >
      <Canvas camera={{ position: [0, 0, 16], fov: 45 }}>
        <Suspense fallback={null}>
          <HeroLights />
          <Particles count={80} />
          {showControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
              }}
            />
          )}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
