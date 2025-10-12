import React from "react";
import * as THREE from "three";

const HeroLights = () => {
  return (
    <>
      {/* Soft global light */}
      <ambientLight intensity={0.6} color={0xffffff} />

      {/* Main directional light from front */}
      <directionalLight position={[2, 5, 5]} intensity={1.5} castShadow />

      {/* Warm fill from the side */}
      <pointLight position={[-3, 2, 5]} intensity={30} color="#ffd1a8" />

      {/* Blue rim light from behind */}
      <pointLight position={[0, 5, -5]} intensity={10} color="#88ccff" />
    </>
  );
};

export default HeroLights;
