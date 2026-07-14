import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CosmicBackground from './CosmicBackground.jsx';
import TexturedPlanet from './TexturedPlanet.jsx';
import BeltParticles from './BeltParticles.jsx';
import { getBodies } from '../../data/planets.js';

const bodies = getBodies('en');

const SPACING = 15;
// How far (world units) to push the look-at target away from the planet so
// the planet itself renders off-center, inside whichever half of the screen
// is NOT covered by the text panel for that section. Desktop only — on
// mobile the panel lives below the fold (see home.css), so the planet stays
// horizontally centered instead.
const FRAME_OFFSET = 2.6;

// Mobile panel sits across the bottom ~55-60% of the screen, so the planet
// needs to sit higher in frame to stay clear of it. Shifting the look-at
// target down in world space pushes the rendered subject up on screen.
const MOBILE_VERTICAL_LIFT = 2.4;
// Camera pulls back further on mobile so the planet reads comfortably
// inside the narrower open strip above the panel.
const MOBILE_CAM_OFFSET = new THREE.Vector3(0, 2.1, 10.5);
const DESKTOP_CAM_OFFSET = new THREE.Vector3(2.2, 1.4, 7.5);

function planetWorldPositions() {
  return bodies.map((b, i) => new THREE.Vector3(i * SPACING, Math.sin(i * 1.3) * 1.2, Math.cos(i * 0.7) * 3));
}

// Panel sits on the LEFT for even index, RIGHT for odd index (see PlanetSection).
// To reveal the planet on the opposite, empty half of the screen we aim the
// camera at a point offset to the SAME side as the panel — that pushes the
// actual subject visually toward the opposite, open half.
function sideSignForIndex(i) {
  return i % 2 === 0 ? -1 : 1;
}

function CameraRig({ progressRef, isMobile }) {
  const positions = useMemo(planetWorldPositions, []);
  const lookTarget = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3(1, 0, 0));

  useFrame(({ camera }) => {
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

    // Screen-space "right" vector for the camera's current orientation,
    // derived from its forward direction so the offset stays correct as the
    // camera path curves.
    const forward = new THREE.Vector3().subVectors(focus, camera.position).normalize();
    rightVec.current.crossVectors(forward, camera.up).normalize();

    let aimPoint;
    if (isMobile) {
      // No left/right push — the panel is full-width and docked to the
      // bottom, so the planet just needs to stay centered and lifted into
      // the open strip above it.
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

export default function HomeCanvas({ progressRef, isMobile = false }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 500, position: [2, 1.4, 7.5] }}
    >
      <Suspense fallback={null}>
        <CosmicBackground />
        <directionalLight position={[10, 8, 5]} intensity={0.6} color="#ffe9c7" />
        <PlanetTrail />
        <CameraRig progressRef={progressRef} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
