import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { skills } from "./data.js";

const orbitSkills = [...new Set(Object.values(skills).flat())];

function WireGlobe({ hovered }) {
  const globe = useRef(null);
  const orbit = useRef(null);
  const wireMaterial = useRef(null);
  const orbitMaterial = useRef(null);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (globe.current) {
      const speed = hovered ? 0.42 : 0.12;
      const targetScale = hovered ? 1.08 : 1;
      const easing = 1 - Math.exp(-delta * 5);
      globe.current.rotation.y += delta * speed;
      globe.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      globe.current.scale.x += (targetScale - globe.current.scale.x) * easing;
      globe.current.scale.y += (targetScale - globe.current.scale.y) * easing;
      globe.current.scale.z += (targetScale - globe.current.scale.z) * easing;
    }
    if (orbit.current) orbit.current.rotation.z -= delta * (hovered ? 0.28 : 0.08);
    if (wireMaterial.current) wireMaterial.current.opacity = hovered ? 0.72 : 0.48;
    if (orbitMaterial.current) orbitMaterial.current.opacity = hovered ? 0.72 : 0.48;
  });

  return (
    <>
      <group ref={globe}>
        <mesh>
          <icosahedronGeometry args={[1.35, 2]} />
          <meshBasicMaterial ref={wireMaterial} color="#38bdf8" wireframe transparent opacity={0.48} />
        </mesh>
        <mesh rotation={[0.2, 0.3, 0]}>
          <sphereGeometry args={[1.08, 12, 8]} />
          <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.2} />
        </mesh>
      </group>
      <mesh ref={orbit} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.8, 0.009, 6, 96]} />
        <meshBasicMaterial ref={orbitMaterial} color="#a78bfa" transparent opacity={0.48} />
      </mesh>
      <mesh rotation={[0.25, 0, Math.PI / 2.2]}>
        <torusGeometry args={[1.58, 0.007, 6, 96]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export default function SkillsGlobe({ enabled }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`globe-stage${hovered ? " is-hovered" : ""}`}
      role="img"
      aria-label="Animated globe surrounded by the technologies I use"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {enabled
        ? <Canvas camera={{ position: [0, 0, 5.2], fov: 48 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: true }}><WireGlobe hovered={hovered} /></Canvas>
        : <div className="globe-fallback" aria-hidden="true" />}
      <span className="globe-center-label" aria-hidden="true">BUILD<br />•<br />LEARN</span>
      <div className="globe-label-orbit" aria-hidden="true">
        {orbitSkills.map((technology, index) => (
          <div
            className="globe-label"
            key={technology}
            style={{ "--orbit-delay": `${-(index / orbitSkills.length) * 36}s` }}
          >
            <span>{technology}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
