'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { KernelSize } from 'postprocessing';

/* ── Modelo con auto-fit de cámara al primer frame ── */
function Model() {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/mascota3d.glb');
  const { camera } = useThree();
  const fitted = useRef(false);

  useFrame(() => {
    if (fitted.current || !inner.current) return;
    const box = new THREE.Box3().setFromObject(inner.current);
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return;
    const fovR = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    /* 1.4 de margen para que no se corten los pies ni la cabeza */
    const dist = (maxDim / 2 / Math.tan(fovR / 2)) * 1.4;
    camera.position.set(center.x, center.y, center.z + dist);
    (camera as THREE.PerspectiveCamera).lookAt(center);
    camera.updateProjectionMatrix();
    fitted.current = true;
  });

  useFrame((state) => {
    if (!fitted.current) return;
    const e = state.clock.getElapsedTime();
    /* Empieza mirando al frente (Math.PI offset) y rota lento */
    outer.current.rotation.y = Math.PI + e * 0.45;
    outer.current.position.y = Math.sin(e * 1.1) * 0.06;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/* ── Partículas flotantes (estrellas/destellos) ── */
function Particles({ count = 38 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => (
    Array.from({ length: count }, () => ({
      pos:   new THREE.Vector3((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2),
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      size:  0.018 + Math.random() * 0.022,
    }))
  ), [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    data.forEach((d, i) => {
      dummy.position.set(
        d.pos.x + Math.sin(t * d.speed + d.phase) * 0.18,
        d.pos.y + Math.cos(t * d.speed * 0.7 + d.phase) * 0.22,
        d.pos.z,
      );
      const s = d.size * (0.7 + 0.3 * Math.sin(t * d.speed * 2 + d.phase));
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#FFD320"
        emissive="#FFD320"
        emissiveIntensity={2.5}
        roughness={0}
        metalness={1}
      />
    </instancedMesh>
  );
}

/* ── Canvas principal ── */
export default function Mascot3D({ className = '' }: { className?: string }) {
  return (
    <div className={className} style={{ mixBlendMode: 'screen' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
        style={{ background: 'transparent', display: 'block', width: '100%', height: '100%' }}
      >
        {/* Iluminación dramática festival */}
        <ambientLight intensity={0.35} />
        <hemisphereLight args={['#0d0620', '#050210', 0.25]} />
        {/* Luz principal dorada desde arriba-frente */}
        <directionalLight position={[1, 6, 4]}   intensity={3.5} color="#FFD320" />
        {/* Fill magenta desde la izquierda */}
        <directionalLight position={[-4, 1, 2]}  intensity={1.8} color="#E91E8C" />
        {/* Rim light blanco desde atrás — separa la figura del fondo oscuro */}
        <directionalLight position={[0, 3, -5]}  intensity={2.2} color="#ffffff" />
        {/* Punto cyan desde abajo — como luz de pista de baile */}
        <pointLight       position={[0, -3, 2]}  intensity={1.4} color="#00E5FF" distance={8} />

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0} floatIntensity={0.25}>
            <Model />
          </Float>

          {/* Partículas doradas manuales */}
          <Particles />

          {/* Sparkles de drei — destellos adicionales blancos/cyan */}
          <Sparkles
            count={22}
            scale={4.5}
            size={0.9}
            speed={0.25}
            color="#00E5FF"
            opacity={0.7}
          />

          <pointLight position={[0, -2.8, 0.5]} intensity={0.9} color="#E91E8C" distance={4} decay={2} />
        </Suspense>

        {/* Bloom — glow festival */}
        <EffectComposer>
          <Bloom
            intensity={1.8}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.85}
            mipmapBlur
            kernelSize={KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/mascota3d.glb');
