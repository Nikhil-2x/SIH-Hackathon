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
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "hidden",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 16], fov: 45 }}>
        <Suspense fallback={null}>
          <HeroLights />
          <Particles count={60} />
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

