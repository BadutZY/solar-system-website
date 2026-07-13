import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import CosmicBackground from '../../components/3D/CosmicBackground.jsx';
import { bodies } from '../../data/planets.js';
import './solarSystem.css';

const REAL_BODIES = bodies.filter((b) => b.texture && !b.isBelt && !b.isCloud && !b.isSatellite);

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

function Sun({ body, onSelect, selected }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <group>
      <mesh
        ref={ref}
        scale={hovered || selected?.id === body.id ? 1.06 : 1}
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

function OrbitingBody({ body, onSelect, selected, children }) {
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
      {children}
    </group>
  );
}

// Orbits its parent planet's local origin rather than the Sun. Nested inside
// the parent's own <group>, so it automatically rides along with the
// planet's orbit around the Sun while circling the planet on its own,
// much smaller, faster loop — exactly like the Moon around Earth.
function SatelliteBody({ body, onSelect, selected }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const bump = body.bumpTexture ? useLoader(THREE.TextureLoader, body.bumpTexture) : null;
  const groupRef = useRef();
  const meshRef = useRef();
  const angle = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const visualRadius = Math.max(0.12, body.renderScale * 0.75);

  useFrame((_, dt) => {
    angle.current += dt * body.orbitSpeed * 0.12;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * body.orbitRadius;
      groupRef.current.position.z = Math.sin(angle.current) * body.orbitRadius;
    }
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={hovered || selected?.id === body.id ? 1.3 : 1}
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
        <sphereGeometry args={[visualRadius, 32, 32]} />
        <meshStandardMaterial map={map} bumpMap={bump ?? undefined} bumpScale={0.03} roughness={0.95} metalness={0.02} />
      </mesh>
    </group>
  );
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(null);
  const sun = bodies.find((b) => b.isStar);
  const planets = REAL_BODIES.filter((b) => !b.isStar);
  const satellites = bodies.filter((b) => b.isSatellite);
  const satelliteOf = (parentId) => satellites.filter((s) => s.parentId === parentId);

  return (
    <div id="scroll-root" className="vg-ss-page">
      <Canvas camera={{ position: [0, 28, 46], fov: 50, far: 500 }} shadows>
        <Suspense fallback={null}>
          <CosmicBackground />
          <directionalLight position={[0, 10, 0]} intensity={0.4} />
          <Sun body={sun} onSelect={setSelected} selected={selected} />
          {planets.map((body) => (
            <group key={body.id}>
              <OrbitRing radius={body.orbitRadius} />
              <OrbitingBody body={body} onSelect={setSelected} selected={selected}>
                {satelliteOf(body.id).map((moon) => (
                  <group key={moon.id}>
                    <OrbitRing radius={moon.orbitRadius} />
                    <SatelliteBody body={moon} onSelect={setSelected} selected={selected} />
                  </group>
                ))}
              </OrbitingBody>
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

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            className="vg-ss-panel"
            initial={{ opacity: 0, x: 56, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 40, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="vg-ss-close" onClick={() => setSelected(null)} aria-label="Tutup panel">
              ×
            </button>

            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              {selected.subtitle}
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              {selected.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.4 }}
            >
              {selected.description}
            </motion.p>

            <motion.div
              className="vg-ss-stats mono"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.06, delayChildren: 0.32 }}
            >
              {[
                ['Diameter', selected.stats.diameter],
                ['Jarak dari Matahari', selected.stats.distanceFromSun],
                ['Revolusi', selected.stats.revolution],
                ['Satelit', selected.stats.moons],
              ].map(([label, value]) => (
                <motion.div
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <span>{label}</span>
                  <b>{value}</b>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}