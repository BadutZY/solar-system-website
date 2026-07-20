import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import CosmicBackground from '../../components/3D/CosmicBackground.jsx';
import { getBodies } from '../../data/planets.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './solarSystem.css';

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function spawnScale(elapsed, delay, duration = 0.8) {
  if (elapsed <= delay) return 0;
  return Math.max(0, easeOutBack(Math.min(1, (elapsed - delay) / duration)));
}

function spawnFade(elapsed, delay, duration = 0.8) {
  if (elapsed <= delay) return 0;
  return easeOutCubic(Math.min(1, (elapsed - delay) / duration));
}

function OrbitRing({ radius, appearDelay = 0 }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const matRef = useRef();

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.opacity = 0.45 * spawnFade(state.clock.elapsedTime, appearDelay, 0.9);
    }
  });

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial ref={matRef} color="#4a5578" transparent opacity={0} />
    </line>
  );
}

function Sun({ body, onSelect, selected, appearDelay = 0 }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const ref = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
    const spawn = spawnScale(state.clock.elapsedTime, appearDelay, 1.0);
    const hoverScale = hovered || selected?.id === body.id ? 1.06 : 1;
    if (ref.current) ref.current.scale.setScalar(hoverScale * spawn);
    if (glowRef.current) glowRef.current.scale.setScalar(spawn);
  });

  return (
    <group>
      <mesh
        ref={ref}
        scale={0}
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
      <mesh ref={glowRef} scale={0}>
        <sphereGeometry args={[3.1, 32, 32]} />
        <meshBasicMaterial color="#ffb14a" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function OrbitingBody({ body, onSelect, selected, appearDelay = 0, children }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const ring = body.hasRings && body.ringTexture ? useLoader(THREE.TextureLoader, body.ringTexture) : null;
  const groupRef = useRef();
  const meshRef = useRef();
  const ringRef = useRef();
  const angle = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const visualRadius = Math.max(0.3, body.renderScale * 0.75);

  useFrame((state, dt) => {
    angle.current += dt * body.orbitSpeed * 0.12;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * body.orbitRadius;
      groupRef.current.position.z = Math.sin(angle.current) * body.orbitRadius;
    }
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.3;

    const spawn = spawnScale(state.clock.elapsedTime, appearDelay, 0.85);
    const hoverScale = hovered || selected?.id === body.id ? 1.18 : 1;
    if (meshRef.current) meshRef.current.scale.setScalar(hoverScale * spawn);
    if (ringRef.current) ringRef.current.scale.setScalar(spawn);
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={0}
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
        <mesh ref={ringRef} scale={0} rotation={[Math.PI / 2 - 0.4, 0, 0]}>
          <ringGeometry args={[visualRadius * 1.4, visualRadius * 2.2, 96]} />
          <meshBasicMaterial map={ring} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      )}
      {children}
    </group>
  );
}

function SatelliteBody({ body, onSelect, selected, appearDelay = 0 }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const bump = body.bumpTexture ? useLoader(THREE.TextureLoader, body.bumpTexture) : null;
  const groupRef = useRef();
  const meshRef = useRef();
  const angle = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const visualRadius = Math.max(0.12, body.renderScale * 0.75);

  useFrame((state, dt) => {
    angle.current += dt * body.orbitSpeed * 0.12;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * body.orbitRadius;
      groupRef.current.position.z = Math.sin(angle.current) * body.orbitRadius;
    }
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.25;

    const spawn = spawnScale(state.clock.elapsedTime, appearDelay, 0.7);
    const hoverScale = hovered || selected?.id === body.id ? 1.3 : 1;
    if (meshRef.current) meshRef.current.scale.setScalar(hoverScale * spawn);
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={0}
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
  const { language, t } = useLanguage();
  const bodies = useMemo(() => getBodies(language), [language]);
  const REAL_BODIES = useMemo(
    () => bodies.filter((b) => b.texture && !b.isBelt && !b.isCloud && !b.isSatellite),
    [bodies]
  );
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected((prev) => (prev ? bodies.find((b) => b.id === prev.id) ?? null : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodies]);

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
          <Sun body={sun} onSelect={setSelected} selected={selected} appearDelay={0.15} />
          {planets.map((body, index) => (
            <group key={body.id}>
              <OrbitRing radius={body.orbitRadius} appearDelay={0.35 + index * 0.1} />
              <OrbitingBody
                body={body}
                onSelect={setSelected}
                selected={selected}
                appearDelay={0.45 + index * 0.1}
              >
                {satelliteOf(body.id).map((moon, moonIndex) => (
                  <group key={moon.id}>
                    <OrbitRing radius={moon.orbitRadius} appearDelay={0.9 + index * 0.1 + moonIndex * 0.08} />
                    <SatelliteBody
                      body={moon}
                      onSelect={setSelected}
                      selected={selected}
                      appearDelay={1.0 + index * 0.1 + moonIndex * 0.08}
                    />
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
            <button className="vg-ss-close" onClick={() => setSelected(null)} aria-label={t('solarSystem.closeAria')}>
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
                [t('solarSystem.diameter'), selected.stats.diameter],
                [t('solarSystem.distanceFromSun'), selected.stats.distanceFromSun],
                [t('solarSystem.revolution'), selected.stats.revolution],
                [t('solarSystem.moons'), selected.stats.moons],
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