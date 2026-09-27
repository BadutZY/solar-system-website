import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CosmicBackground from './CosmicBackground.jsx';
import TexturedPlanet from './TexturedPlanet.jsx';
import BeltParticles from './BeltParticles.jsx';
import { getBodies } from '../../data/planets.js';

const bodies = getBodies('en');
const SPACING = 15;
const FRAME_OFFSET = 2.6;
const MOBILE_VERTICAL_LIFT = 2.4;
const MOBILE_CAM_OFFSET = new THREE.Vector3(0, 2.1, 10.5);
const DESKTOP_CAM_OFFSET = new THREE.Vector3(2.2, 1.4, 7.5);
const MOBILE_BREAKPOINT = 860;

function planetWorldPositions() {
  return bodies.map((b, i) => new THREE.Vector3(i * SPACING, Math.sin(i * 1.3) * 1.2, Math.cos(i * 0.7) * 3));
}

function sideSignForIndex(i) {
  return i % 2 === 0 ? -1 : 1;
}

function CameraRig({ progressRef }) {
  const positions = useMemo(planetWorldPositions, []);
  const lookTarget = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3(1, 0, 0));

  useFrame(({ camera, size }) => {
    const isMobile = size.width <= MOBILE_BREAKPOINT;
    const n = bodies.length;
    const t = THREE.MathUtils.clamp(progressRef.current.value, 0, 1) * (n - 1);
    const i = Math.floor(t);
    const frac = t - i;
    const a = positions[i];
    const b = positions[Math.min(i + 1, n - 1)];

    const focus = new THREE.Vector3().lerpVectors(a, b, frac);

    const camOffset = isMobile ? MOBILE_CAM_OFFSET : DESKTOP_CAM_OFFSET;
    const camPos = new THREE.Vector3().lerpVectors(a, b, frac).add(camOffset);
    camera.position.lerp(camPos, 0.06);

    const forward = new THREE.Vector3().subVectors(focus, camera.position).normalize();
    rightVec.current.crossVectors(forward, camera.up).normalize();

    let aimPoint;
    if (isMobile) {
      aimPoint = focus.clone().add(new THREE.Vector3(0, -MOBILE_VERTICAL_LIFT, 0));
    } else {
      const nearestIndex = Math.round(t);
      const sign = sideSignForIndex(nearestIndex);
      aimPoint = focus.clone().add(rightVec.current.clone().multiplyScalar(FRAME_OFFSET * sign));
    }

    lookTarget.current.lerp(aimPoint, 0.08);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

function PlanetTrail() {
  const positions = useMemo(planetWorldPositions, []);
  const groupRefs = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    groupRefs.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = positions[i].y + Math.sin(time * 0.4 + i) * 0.35;
    });
  });

  return (
    <>
      {bodies.map((body, i) => (
        <group key={body.id} ref={(el) => (groupRefs.current[i] = el)} position={positions[i]}>
          {body.isBelt || body.isCloud ? (
            <BeltParticles body={body} />
          ) : (
            <TexturedPlanet body={body} radius={body.renderScale} spin={0.12} />
          )}
        </group>
      ))}
    </>
  );
}

function ForceViewportSync() {
  const { size, setSize, gl } = useThree();

  useFrame(() => {
    const vv = window.visualViewport;
    const w = Math.round(vv ? vv.width : window.innerWidth);
    const h = Math.round(vv ? vv.height : window.innerHeight);
    if (Math.abs(size.width - w) > 1 || Math.abs(size.height - h) > 1) {
      setSize(w, h);
      gl.setSize(w, h);
    }
  });

  return null;
}

export default function HomeCanvas({ progressRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 500, position: [2, 1.4, 7.5] }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <CosmicBackground />
        <directionalLight position={[10, 8, 5]} intensity={0.6} color="#ffe9c7" />
        <PlanetTrail />
        <CameraRig progressRef={progressRef} />
        <ForceViewportSync />
      </Suspense>
    </Canvas>
  );
}