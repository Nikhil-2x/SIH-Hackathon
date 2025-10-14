import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Text,
  Float,
  Html,
  OrbitControls,
  Stars,
  Environment,
} from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Simple floating blobs using instancing for performance
function FloatingBlobs({ count = 40, radius = 8 }) {
  const meshRef = useRef();
  const dummy = new THREE.Object3D();
  const [speeds] = useState(() =>
    Array.from({ length: count }, () => 0.2 + Math.random() * 0.6)
  );
  const [offsets] = useState(() =>
    Array.from({ length: count }, () => Math.random() * Math.PI * 2)
  );

  useFrame((state) => {
    for (let i = 0; i < count; i++) {
      const angle = offsets[i] + state.clock.elapsedTime * 0.15 * speeds[i];
      const y = Math.sin(angle * 2) * 0.8;
      const r = radius * (0.4 + (Math.sin(angle * 0.3) + 1) / 4);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      dummy.position.set(x, y, z);
      const s = 0.2 + (Math.sin(angle * 3) + 1) * 0.15;
      dummy.scale.setScalar(s);
      dummy.rotation.set(angle * 2, angle * 1.5, angle);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color="#6366f1"
        roughness={0.3}
        metalness={0.6}
        emissive="#4f46e5"
        emissiveIntensity={0.4}
      />
    </instancedMesh>
  );
}

function SubtleCameraRig() {
  const group = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.15;
    group.current.position.x = Math.sin(t) * 0.6;
    group.current.position.y = Math.sin(t * 1.5) * 0.3;
  });
  return <group ref={group} />;
}

function GradientBG() {
  // Fullscreen plane with gradient shader
  const shader = {
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#0f0c29") },
      uColor2: { value: new THREE.Color("#302b63") },
      uColor3: { value: new THREE.Color("#24243e") },
    },
    vertexShader: `varying vec2 vUv;\nvoid main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
    fragmentShader: `uniform float uTime;uniform vec3 uColor1;uniform vec3 uColor2;uniform vec3 uColor3;varying vec2 vUv;\nfloat noise(vec2 p){return fract(sin(dot(p,vec2(23.14069263277926,2.665144142690225)))*12345.6789);}\nvoid main(){float n = noise(vUv* (4.0+sin(uTime*0.1)*2.0));float m = smoothstep(0.2,0.8,vUv.y + n*0.15);vec3 col = mix(uColor1, uColor2, m);col = mix(col, uColor3, smoothstep(0.8,1.0,vUv.y)+0.1*sin(uTime*0.2));gl_FragColor=vec4(col,1.0);}`,
  };
  const matRef = useRef();
  useFrame((_, delta) => {
    matRef.current.uniforms.uTime.value += delta * 60.0; // speed
  });
  return (
    <mesh position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial ref={matRef} args={[shader]} depthWrite={false} />
    </mesh>
  );
}

export function ComingSoonScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        className="bg-[#030712]"
      >
        <color attach="background" args={["#030712"]} />
        <SubtleCameraRig />
        <GradientBG />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <Center>
            <Text
              fontSize={1.4}
              lineHeight={1}
              letterSpacing={0.02}
              anchorX="center"
              anchorY="middle"
              maxWidth={16}
            >
              WORK IN PROGRESS
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.9}
                roughness={0.25}
                emissive="#6366f1"
                emissiveIntensity={0.8}
              />
            </Text>
          </Center>
        </Float>
        <FloatingBlobs />
        <Stars
          radius={60}
          depth={40}
          count={1200}
          factor={4}
          fade
          speed={0.6}
        />
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.1}
        />
        <Html
          center
          wrapperClass="pointer-events-none select-none"
          distanceFactor={8}
        >
          <div className="text-center px-4">
            <h2 className="text-lg md:text-2xl font-medium tracking-wide text-indigo-300/90">
              We are crafting this page
            </h2>
            <p className="mt-2 max-w-md text-xs md:text-sm text-indigo-100/70 leading-relaxed">
              This section is under active development. Expect something
              immersive soon. Stay tuned while we choreograph the experience.
            </p>
          </div>
        </Html>
      </Canvas>
      {/* Overlay UI */}
      <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-3 text-indigo-100/80">
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono tracking-widest uppercase">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Building Next Segment...</span>
        </div>
        <div className="w-56 md:w-80 h-1.5 bg-indigo-900/40 rounded-full overflow-hidden">
          {mounted && (
            <div className="h-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-[progress_6s_linear_infinite]" />
          )}
        </div>
      </div>
      <style>{`
        @keyframes progress {0%{transform:translateX(-60%)}100%{transform:translateX(110%)}}
      `}</style>
    </div>
  );
}

export default ComingSoonScene;
