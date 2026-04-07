import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LandingHero() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const isDraggingRef = useRef(false);
  const posRef = useRef({ x: 0, y: 0, velX: 0, velY: 0, rotX: 0.2, rotY: 0, zoom: 6.5 });

  useEffect(() => {
    if (!containerRef.current) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;

    // ══ SETUP THREE.JS ══════════════════════════════════
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(isMobile ? 50 : 42, W / H, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 7.5 : 6.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    rendererRef.current = renderer;
    renderer.setPixelRatio(isMobile ? 0.8 : 1.5);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // ── LIGHTS ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xe8e8e8, 0.22));
    const keyLight = new THREE.PointLight(0xd0d0d0, 85, 28);
    keyLight.position.set(4, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xb0b0b0, 65, 22);
    rimLight.position.set(-4, -2, 2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xc8c8c8, 40, 20);
    fillLight.position.set(0, -4, 3);
    scene.add(fillLight);

    const backLight = new THREE.PointLight(0xa8a8a8, 28, 18);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    const diamondLight = new THREE.PointLight(0xf5f5f5, 70, 8);
    scene.add(diamondLight);

    const spotLight = new THREE.SpotLight(0xe0e0e0, 65, 14, Math.PI * 0.15, 0.35, 1.5);
    spotLight.position.set(0, 7, 2);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // ── MATERIALS ─────────────────────────────────────────
    const matHex = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.9, roughness: 0.08, emissive: 0xb0b0b0, emissiveIntensity: 0.18 });
    const matDiamond = new THREE.MeshPhysicalMaterial({ color: 0xf5f5f5, metalness: 0, roughness: 0, transmission: 0.65, clearcoat: 1, clearcoatRoughness: 0, reflectivity: 1, transparent: true, opacity: 0.95, side: THREE.DoubleSide, envMapIntensity: 4 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.15, roughness: 0.05, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
    const matWire = new THREE.MeshBasicMaterial({ color: 0xa8a8a8, wireframe: true, transparent: true, opacity: 0.04 });
    const glowRingMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, emissive: 0xb0b0b0, emissiveIntensity: 3.0, metalness: 0, roughness: 0.8 });
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, emissive: 0xa8a8a8, emissiveIntensity: 2.4, metalness: 0, roughness: 0.8 });

    // ── Memory Leak Prevention ──────────────────────────────
    let animationFrameId = null;

    // ── MAIN GROUP ─────────────────────────────────────────
    const group = new THREE.Group();

    const hexMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.06, 0.26, 6, 1), matHex);
    hexMesh.rotation.y = Math.PI / 6;
    group.add(hexMesh);

    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.026, 8, 6), glowRingMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.rotation.z = Math.PI / 6;
    ringMesh.position.y = 0.14;
    group.add(ringMesh);

    const ring2Mesh = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.015, 8, 6), ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 2;
    ring2Mesh.rotation.z = Math.PI / 6;
    ring2Mesh.position.y = 0.14;
    group.add(ring2Mesh);

    const dProfile = [
      new THREE.Vector2(0, 0.52), new THREE.Vector2(0.36, 0.42),
      new THREE.Vector2(0.52, 0.26), new THREE.Vector2(0.57, 0.06),
      new THREE.Vector2(0.57, 0), new THREE.Vector2(0.42, -0.2),
      new THREE.Vector2(0.24, -0.4), new THREE.Vector2(0, -0.58),
    ];
    const octMesh = new THREE.Mesh(new THREE.LatheGeometry(dProfile, 8), matDiamond);
    octMesh.position.y = 0.36;
    group.add(octMesh);

    const coronaMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, emissive: 0xb0b0b0, emissiveIntensity: 2.2, transparent: true, opacity: 0.15 });
    const coronaMesh = new THREE.Mesh(new THREE.SphereGeometry(0.54, 12, 12), coronaMat);
    coronaMesh.position.y = 0.36;
    group.add(coronaMesh);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.018, 8, 40), new THREE.MeshStandardMaterial({ color: 0xc8c8c8, emissive: 0xb0b0b0, emissiveIntensity: 2.4 }));
    innerRing.rotation.x = Math.PI * 0.36;
    group.add(innerRing);

    const innerRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.013, 8, 40), new THREE.MeshStandardMaterial({ color: 0xb8b8b8, emissive: 0xa0a0a0, emissiveIntensity: 2.0 }));
    innerRing2.rotation.x = Math.PI * 0.62;
    innerRing2.rotation.y = Math.PI * 0.28;
    group.add(innerRing2);

    const orbGroup = new THREE.Group();
    const orbDefs = [
      { color: 0xd0d0d0, emissive: 0xb0b0b0, r: 0.09, orbitR: 1.62, phase: 0 },
      { color: 0xd8d8d8, emissive: 0xb8b8b8, r: 0.08, orbitR: 1.64, phase: 2.51 },
      { color: 0xc8c8c8, emissive: 0xb0b0b0, r: 0.07, orbitR: 1.6, phase: 5.03 },
    ];
    const orbMeshes = orbDefs.map(d => {
      const mat = new THREE.MeshStandardMaterial({ color: d.color, emissive: d.emissive, emissiveIntensity: 1.6, metalness: 0.3, roughness: 0.15 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 10, 10), mat);
      orbGroup.add(mesh);
      return { mesh, mat, ...d };
    });
    group.add(orbGroup);

    const shellMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.82, 1), matGlass);
    group.add(shellMesh);

    const wfMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.84, 1), matWire);
    group.add(wfMesh);

    scene.add(group);

    // ── TRAIL RINGS ────────────────────────────────────────
    const trailMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, emissive: 0xb0b0b0, emissiveIntensity: 1.8, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
    const trailRing = new THREE.Mesh(new THREE.TorusGeometry(2.62, 0.022, 8, 110), trailMat);
    trailRing.rotation.x = Math.PI * 0.18;
    scene.add(trailRing);

    const trailMat2 = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, emissive: 0xa0a0a0, emissiveIntensity: 1.3, transparent: true, opacity: 0.14, side: THREE.DoubleSide });
    const trailRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.011, 8, 110), trailMat2);
    trailRing2.rotation.x = Math.PI * 0.18;
    trailRing2.rotation.y = Math.PI * 0.08;
    scene.add(trailRing2);

    // ── PARTICLES ──────────────────────────────────────────
    const pCount = isMobile ? 80 : 150;
    const pPos = new Float32Array(pCount * 3);
    const pBase = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const x = (Math.random() - 0.5) * 26, y = (Math.random() - 0.5) * 20, z = (Math.random() - 0.5) * 12 - 3;
      pPos[i * 3] = pBase[i * 3] = x;
      pPos[i * 3 + 1] = pBase[i * 3 + 1] = y;
      pPos[i * 3 + 2] = pBase[i * 3 + 2] = z;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc8c8c8, size: isMobile ? 0.06 : 0.045, transparent: true, opacity: 0.35, sizeAttenuation: true });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── INTERACTION ────────────────────────────────────────
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      posRef.current.velY += (e.clientX - posRef.current.x) * 0.014;
      posRef.current.velX += (e.clientY - posRef.current.y) * 0.014;
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    };
    const handleWheel = (e) => {
      posRef.current.zoom = Math.max(3.5, Math.min(10, posRef.current.zoom + e.deltaY * 0.008));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: true });

    // ── ANIMATION LOOP ─────────────────────────────────────
    let t = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      t += 0.016;

      const pos = posRef.current;
      pos.rotY += pos.velY;
      pos.rotX += pos.velX;
      pos.velX *= 0.88;
      pos.velY *= 0.88;

      camera.position.z += (pos.zoom - camera.position.z) * 0.06;
      camera.position.y = Math.sin(t * 0.32) * 0.2;
      camera.position.x = Math.cos(t * 0.26) * 0.12;
      camera.lookAt(0, 0, 0);

      group.scale.setScalar(1 + Math.sin(t * 0.52) * 0.02);
      group.rotation.y = pos.rotY + t * 0.2;
      group.rotation.x = pos.rotX + Math.sin(t * 0.38) * 0.06 + 0.18;

      octMesh.rotation.y = t * 2.2;
      octMesh.rotation.x = t * 1.1;
      const floatY = 0.36 + Math.sin(t * 1.5) * 0.11;
      octMesh.position.y = floatY;
      coronaMesh.position.y = floatY;
      coronaMat.opacity = 0.12 + Math.abs(Math.sin(t * 1.9)) * 0.14;
      coronaMat.emissiveIntensity = 2.8 + Math.sin(t * 2.2);
      diamondLight.position.set(0, floatY, 0);
      diamondLight.intensity = 90 + Math.sin(t * 2.8) * 35;

      matHex.emissiveIntensity = 0.2 + Math.sin(t * 0.85) * 0.12;
      ringMesh.rotation.y = t * 0.58;
      ring2Mesh.rotation.y = -t * 0.44;
      glowRingMat.emissiveIntensity = 3.0 + Math.sin(t * 1.6) * 0.8;
      ring2Mat.emissiveIntensity = 2.4 + Math.cos(t * 1.3) * 0.6;
      innerRing.rotation.z = t * 1.3;
      innerRing2.rotation.z = -t;
      innerRing2.rotation.x = Math.PI * 0.62 + t * 0.28;

      orbMeshes.forEach((o, i) => {
        const angle = t * (0.5 + i * 0.09) + o.phase;
        o.mesh.position.set(Math.cos(angle) * o.orbitR, Math.sin(angle * 0.6) * 0.55, Math.sin(angle) * o.orbitR * 0.65);
        o.mat.emissiveIntensity = 1.8 + Math.sin(t * 1.5 + i) * 0.9;
        o.mesh.scale.setScalar(1 + Math.sin(t * 2.1 + i * 1.2) * 0.16);
      });
      orbGroup.rotation.y = t * 0.18;

      shellMesh.rotation.y = -t * 0.07;
      shellMesh.rotation.x = t * 0.04;
      wfMesh.rotation.y = -t * 0.07;
      wfMesh.rotation.x = t * 0.04;

      trailMat.emissiveIntensity = 1.8 + Math.sin(t * 0.9) * 0.5;
      trailMat.opacity = 0.22 + Math.sin(t * 1.1) * 0.08;
      trailRing2.rotation.z = t * 0.05;

      const parray = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        parray[i * 3 + 1] = pBase[i * 3 + 1] + Math.sin(t * 0.38 + pBase[i * 3] * 0.45) * 0.28;
        parray[i * 3] = pBase[i * 3] + Math.cos(t * 0.28 + pBase[i * 3 + 1] * 0.38) * 0.2;
      }
      pGeo.attributes.position.needsUpdate = true;

      keyLight.intensity = 100 + Math.sin(t * 1.2) * 20;
      rimLight.intensity = 80 + Math.cos(t) * 20;
      spotLight.intensity = 80 + Math.sin(t * 0.65) * 20;
      backLight.intensity = 35 + Math.sin(t * 0.55) * 15;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const W2 = window.innerWidth;
      const H2 = window.innerHeight;
      const isMobileNow = W2 < 768;
      camera.aspect = W2 / H2;
      camera.fov = isMobileNow ? 50 : W2 < H2 ? 58 : 42;
      camera.position.z = isMobileNow ? 7.5 : 6.5;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(isMobileNow ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W2, H2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
    ref={containerRef}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100vh',
      background: '#060b12',
      zIndex: 0,
    }}
    >
      {/* Branding Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 'clamp(16px, 3vw, 32px)',
        paddingRight: 'clamp(16px, 3vw, 32px)',
        paddingTop: 'clamp(40px, 8vh, 80px)',
      }}>
        {/* Top Section: ai logo */}
        <div style={{
          marginBottom: 'clamp(20px, 5vh, 60px)',
          textAlign: 'center',
          maxWidth: '600px',
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(64px, 16vw, 180px)',
            fontWeight: 900,
            letterSpacing: '0.15em',
            lineHeight: 0.9,
            backgroundImage: 'linear-gradient(180deg, #f5f5f5 0%, #d8d8d8 50%, #b8b8b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 clamp(15px,3vw,35px) rgba(200,200,200,0.35))',
            margin: 0,
            padding: 0,
          }}>
            ai
          </div>
        </div>

        {/* Middle Section: RESUME BUILDER */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(24px, 4vh, 50px)',
          maxWidth: '700px',
        }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(18px, 4.5vw, 56px)',
            fontWeight: 700,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            backgroundImage: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 50%, #a8a8a8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 clamp(10px,2vw,25px) rgba(200,200,200,0.25))',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Resume Builder
          </div>

          {/* Divider line */}
          <div style={{
            width: 'clamp(180px, 30vw, 360px)',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(200,200,200,0.4) 50%, transparent 100%)',
            margin: 'clamp(14px, 2vw, 24px) auto',
          }}></div>

          {/* Subtitle */}
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(11px, 2.2vw, 18px)',
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(210, 210, 210, 0.85)',
            textShadow: '0 0 clamp(6px,1vw,12px) rgba(150,150,150,0.25)',
          }}>
            A Strategic Initiative by KCF LLC
          </div>
        </div>

        {/* Bottom Section: Seal */}
        <div style={{
          position: 'relative',
          width: 'clamp(120px, 18vw, 200px)',
          height: 'clamp(120px, 18vw, 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 'clamp(20px, 3vh, 40px)',
          marginBottom: 'clamp(20px, 5vh, 60px)',
        }}>
          {/* Seal outer ring */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid rgba(180,180,180,0.4)',
            boxShadow: '0 0 0 1px rgba(160,160,160,0.2), 0 0 clamp(25px,4vw,50px) rgba(200,200,200,0.25)',
            animation: 'pulseRing2 3s ease-in-out infinite',
          }}></div>

          {/* Seal inner circle - K Icon + KCF LLC */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            width: 'clamp(70px, 11vw, 130px)',
            height: 'clamp(70px, 11vw, 130px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(42,42,42,0.95) 0%, rgba(26,26,26,0.85) 30%, rgba(15,15,15,0.95) 100%)',
            border: '2px solid rgba(200,200,200,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(2px, 0.5vw, 6px)',
            boxShadow: '0 0 clamp(20px,3vw,45px) rgba(232,232,232,0.25), inset 0 2px 8px rgba(232,232,232,0.05), inset 0 -2px 8px rgba(0,0,0,0.7)',
            animation: 'floatSeal 4s ease-in-out infinite',
          }}>
            {/* K Icon */}
            <svg
              viewBox="0 0 200 200"
              width="clamp(32px, 5vw, 60px)"
              height="clamp(32px, 5vw, 60px)"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 0 clamp(3px,0.5vw,6px) rgba(232,232,232,0.7))' }}
            >
              {/* K letter - left vertical bar */}
              <rect x="45" y="45" width="35" height="110" rx="8" fill="#e8e8e8" />
              {/* K letter - top right diagonal */}
              <path d="M 100 55 L 155 95 L 145 110 L 95 75 Z" fill="#e8e8e8" />
              {/* K letter - bottom right diagonal */}
              <path d="M 95 125 L 155 105 L 165 120 L 100 145 Z" fill="#e8e8e8" />
              {/* Center circle connector */}
              <circle cx="110" cy="100" r="20" fill="rgba(42,42,42,0.95)" stroke="#e8e8e8" strokeWidth="6" />
            </svg>

            {/* KCF LLC text */}
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(9px, 1.4vw, 14px)',
              fontWeight: 900,
              letterSpacing: '0.12em',
              lineHeight: 1.1,
              textAlign: 'center',
              color: '#d8d8d8',
              textShadow: '0 0 clamp(2px,0.4vw,3px) rgba(200,200,200,0.3)',
            }}>
              KCF<br />LLC
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSeal {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
          }
        }
        @keyframes pulseRing2 {
          0%, 100% {
            box-shadow: 0 0 0 1px rgba(160,160,160,0.2), 0 0 clamp(25px,4vw,50px) rgba(200,200,200,0.25);
          }
          50% {
            box-shadow: 0 0 0 2px rgba(200,200,200,0.3), 0 0 clamp(35px,5vw,65px) rgba(210,210,210,0.35);
          }
        }
      `}</style>
    </div>
  );
}