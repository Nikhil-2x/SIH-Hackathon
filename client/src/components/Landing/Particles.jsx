import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Particles = ({ count = 100 }) => {
  const group = useRef();

  // Simple rotation animation
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.002;
    }
  });

  const particlesArray = Array.from({ length: count }, (_, i) => (
    <mesh
      key={i}
      position={[
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ]}
    >
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshStandardMaterial color="white" />
    </mesh>
  ));

  return <group ref={group}>{particlesArray}</group>;
};

export default Particles;
