import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const SCENE_DISTANCE = 25.2;
const sculptures = [
  { x: -3.7, y: 0, z: -2, shape: "icosahedron", color: "#38bdf8", phase: 0 },
  { x: 4.1, y: -4.2, z: -3, shape: "ring", color: "#a78bfa", phase: 1.1 },
  { x: -4.2, y: -8.4, z: -2, shape: "octahedron", color: "#38bdf8", phase: 2.2 },
  { x: 3.8, y: -12.6, z: -3, shape: "icosahedron", color: "#a78bfa", phase: 0.6 },
  { x: -4, y: -16.8, z: -2, shape: "ring", color: "#38bdf8", phase: 1.7 },
  { x: 4.1, y: -21, z: -3, shape: "octahedron", color: "#a78bfa", phase: 2.8 },
  { x: 0, y: -25.2, z: -2, shape: "icosahedron", color: "#38bdf8", phase: 0.3 },
];

function ScrollCamera({ progress, reducedMotion }) {
  const { camera } = useThree();
  useFrame(() => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    progress.current = window.scrollY / scrollable;
    const targetY = -progress.current * SCENE_DISTANCE;
    camera.position.y += (targetY - camera.position.y) * (reducedMotion ? 1 : 0.045);
    camera.lookAt(0, camera.position.y - 0.25, 0);
  });
  return null;
}

function Sculpture({ item, index, progress, reducedMotion }) {
  const group = useRef(null);
  const coreMaterial = useRef(null);
  const orbitMaterial = useRef(null);
  const secondOrbitMaterial = useRef(null);
  const trigger = index === 0 ? -0.08 : (index * 4.2) / SCENE_DISTANCE;

  useFrame((state, delta) => {
    const raw = Math.max(0, Math.min(1, (progress.current - trigger) / 0.1));
    const reveal = reducedMotion ? Number(raw > 0) : raw * raw * (3 - 2 * raw);
    if (!group.current) return;

    group.current.visible = reveal > 0.001;
    group.current.scale.setScalar(0.94 + reveal * 0.06);
    group.current.rotation.y = item.phase + (reducedMotion ? 0 : state.clock.elapsedTime * 0.035);
    group.current.rotation.x = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.025 + item.phase) * 0.035;
    if (coreMaterial.current) coreMaterial.current.opacity = reveal * 0.52;
    if (orbitMaterial.current) orbitMaterial.current.opacity = reveal * 0.26;
    if (secondOrbitMaterial.current) secondOrbitMaterial.current.opacity = reveal * 0.18;
  });

  return (
    <group ref={group} position={[item.x, item.y, item.z]} visible={index === 0}>
      <mesh>
        {item.shape === "icosahedron" && <icosahedronGeometry args={[1.15, 1]} />}
        {item.shape === "ring" && <torusGeometry args={[0.95, 0.018, 8, 96]} />}
        {item.shape === "octahedron" && <octahedronGeometry args={[1.35, 0]} />}
        <meshBasicMaterial
          ref={coreMaterial}
          color={item.color}
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.6, 0.008, 4, 96]} />
        <meshBasicMaterial
          ref={orbitMaterial}
          color={item.color}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[0.2, 0, Math.PI / 2.2]}>
        <torusGeometry args={[1.38, 0.006, 4, 96]} />
        <meshBasicMaterial
          ref={secondOrbitMaterial}
          color={item.color}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SceneContent({ light, reducedMotion }) {
  const progress = useRef(0);
  return (
    <>
      <fog attach="fog" args={["#070b14", 18, 42]} />
      <Stars radius={65} depth={48} count={light ? 650 : 1500} factor={1.5} saturation={0} fade speed={0.08} />
      <ScrollCamera progress={progress} reducedMotion={reducedMotion} />
      {sculptures.map((item, index) => (
        <Sculpture key={`${item.shape}-${index}`} item={item} index={index} progress={progress} reducedMotion={reducedMotion} />
      ))}
    </>
  );
}

export default function Scene({ light }) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 48 }} dpr={[1, 1.35]} gl={{ alpha: true, antialias: true }}>
      <SceneContent light={light} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
