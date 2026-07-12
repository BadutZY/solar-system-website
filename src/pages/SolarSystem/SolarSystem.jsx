import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import CosmicBackground from '../../components/3D/CosmicBackground.jsx';
import { bodies } from '../../data/planets.js';
import './solarSystem.css';

const REAL_BODIES = bodies.filter((b) => b.texture && !b.isBelt && !b.isCloud);

function OrbitRing({ radius }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#4a5578" transparent opacity={0.45} />
    </line>
  );
}

function Sun({ body }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshBasicMaterial map={map} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} distance={200} decay={0.5} color="#ffe1a8" />
      <mesh>
        <sphereGeometry args={[3.1, 32, 32]} />
        <meshBasicMaterial color="#ffb14a" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function OrbitingBody({ body, onSelect, selected }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const ring = body.hasRings && body.ringTexture ? useLoader(THREE.TextureLoader, body.ringTexture) : null;
  const groupRef = useRef();
  const meshRef = useRef();
  const angle = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const visualRadius = Math.max(0.3, body.renderScale * 0.75);

  useFrame((_, dt) => {
    angle.current += dt * body.orbitSpeed * 0.12;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * body.orbitRadius;
      groupRef.current.position.z = Math.sin(angle.current) * body.orbitRadius;
    }
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.3;
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={hovered || selected?.id === body.id ? 1.18 : 1}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(body);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[visualRadius, 48, 48]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0.05} />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2 - 0.4, 0, 0]}>
          <ringGeometry args={[visualRadius * 1.4, visualRadius * 2.2, 96]} />
          <meshBasicMaterial map={ring} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(null);
  const sun = bodies.find((b) => b.isStar);
  const planets = REAL_BODIES.filter((b) => !b.isStar);

  return (
    <div id="scroll-root" className="vg-ss-page">
      <Canvas camera={{ position: [0, 28, 46], fov: 50, far: 500 }} shadows>
        <Suspense fallback={null}>
          <CosmicBackground />
          <directionalLight position={[0, 10, 0]} intensity={0.4} />
          <Sun body={sun} />
          {planets.map((body) => (
            <group key={body.id}>
              <OrbitRing radius={body.orbitRadius} />
              <OrbitingBody body={body} onSelect={setSelected} selected={selected} />
            </group>
          ))}
          <OrbitControls
            enablePan={false}
            minDistance={8}
            maxDistance={130}
            autoRotate
            autoRotateSpeed={0.15}
          />
        </Suspense>
      </Canvas>

      <div className="vg-ss-hint mono">Seret untuk memutar · scroll untuk zoom · klik planet untuk detail</div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="vg-ss-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="vg-ss-close" onClick={() => setSelected(null)} aria-label="Tutup panel">
              ×
            </button>
            <span className="eyebrow">{selected.subtitle}</span>
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
            <div className="vg-ss-stats mono">
              <div><span>Diameter</span><b>{selected.stats.diameter}</b></div>
              <div><span>Jarak dari Matahari</span><b>{selected.stats.distanceFromSun}</b></div>
              <div><span>Revolusi</span><b>{selected.stats.revolution}</b></div>
              <div><span>Satelit</span><b>{selected.stats.moons}</b></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
