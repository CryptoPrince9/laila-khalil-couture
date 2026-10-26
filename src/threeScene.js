// Interactive 3D Haute Couture Stage & Mannequin Engine
import * as THREE from 'three';
import { DESIGNS_DATA } from './orderSystem.js';

export class HauteCouture3DScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mannequinGroup = null;
    this.videoCarouselGroup = null;
    this.clothMesh = null;
    this.particles = null;
    this.lights = {};
    this.videoTextures = [];
    this.activeMode = 'mannequin'; // 'mannequin' | 'video-carousel'
    this.currentFabric = 'noir-satin';
    this.clock = new THREE.Clock();

    // Interaction controls
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.targetZoom = 4.8;
    this.currentZoom = 4.8;
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 550;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0e, 0.12);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0.2, this.currentZoom);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting Rig
    this.setupLighting();

    // 5. Build 3D Haute Couture Mannequin & Dress
    this.buildMannequinAndDress();

    // 6. Build Floating Golden Dust Particles
    this.buildParticleCosmos();

    // 7. Build 3D Video Carousel
    this.build3DVideoCarousel();

    // 8. Event Listeners
    this.attachEventListeners();

    // 9. Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);
    this.lights.ambient = ambient;

    // Runway Key Spotlight
    const keySpot = new THREE.SpotLight(0xfffaed, 8.5);
    keySpot.position.set(3, 6, 4);
    keySpot.angle = Math.PI / 4;
    keySpot.penumbra = 0.6;
    keySpot.castShadow = true;
    this.scene.add(keySpot);
    this.lights.keySpot = keySpot;

    // Warm Golden Rim Light
    const goldRim = new THREE.DirectionalLight(0xd4af37, 4.0);
    goldRim.position.set(-4, 2, -3);
    this.scene.add(goldRim);
    this.lights.goldRim = goldRim;

    // Cool Couture Fill Light
    const coolFill = new THREE.DirectionalLight(0x88aacc, 2.0);
    coolFill.position.set(4, -1, 2);
    this.scene.add(coolFill);
    this.lights.coolFill = coolFill;

    // Floor Runway Reflection Light
    const floorLight = new THREE.PointLight(0xd4af37, 2.5, 6);
    floorLight.position.set(0, -2.2, 0);
    this.scene.add(floorLight);
    this.lights.floorLight = floorLight;
  }

  setLightingPreset(preset) {
    if (!this.lights.keySpot) return;
    if (preset === 'runway') {
      this.lights.keySpot.color.setHex(0xfffaed);
      this.lights.keySpot.intensity = 8.5;
      this.lights.goldRim.color.setHex(0xd4af37);
      this.lights.goldRim.intensity = 4.0;
      this.lights.coolFill.color.setHex(0x88aacc);
    } else if (preset === 'sunset') {
      this.lights.keySpot.color.setHex(0xff8c42);
      this.lights.keySpot.intensity = 9.0;
      this.lights.goldRim.color.setHex(0xff3366);
      this.lights.goldRim.intensity = 5.0;
      this.lights.coolFill.color.setHex(0x3a1078);
    } else if (preset === 'midnight') {
      this.lights.keySpot.color.setHex(0xd4af37);
      this.lights.keySpot.intensity = 4.0;
      this.lights.goldRim.color.setHex(0x4361ee);
      this.lights.goldRim.intensity = 6.0;
      this.lights.coolFill.color.setHex(0x1a1a2e);
    } else if (preset === 'studio') {
      this.lights.keySpot.color.setHex(0xffffff);
      this.lights.keySpot.intensity = 7.0;
      this.lights.goldRim.color.setHex(0xffffff);
      this.lights.goldRim.intensity = 3.0;
      this.lights.coolFill.color.setHex(0xffffff);
    }
  }

  buildMannequinAndDress() {
    this.mannequinGroup = new THREE.Group();

    // Brass/Gold Atelier Stand Material
    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });

    // Circular Runway Base Plinth
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.08, 64);
    const baseMesh = new THREE.Mesh(baseGeo, goldMetalMat);
    baseMesh.position.y = -2.1;
    baseMesh.receiveShadow = true;
    this.mannequinGroup.add(baseMesh);

    // Inner glowing ring on base
    const ringGeo = new THREE.TorusGeometry(1.05, 0.015, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -2.05;
    this.mannequinGroup.add(ringMesh);

    // Vertical Stand Rod
    const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.5, 32);
    const rodMesh = new THREE.Mesh(rodGeo, goldMetalMat);
    rodMesh.position.y = -0.9;
    this.mannequinGroup.add(rodMesh);

    // Mannequin Head / Finial
    const headGeo = new THREE.SphereGeometry(0.22, 32, 32);
    headGeo.scale(0.8, 1.1, 0.85);
    const headMesh = new THREE.Mesh(headGeo, goldMetalMat);
    headMesh.position.y = 1.35;
    this.mannequinGroup.add(headMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.25, 32);
    const neckMesh = new THREE.Mesh(neckGeo, goldMetalMat);
    neckMesh.position.y = 1.12;
    this.mannequinGroup.add(neckMesh);

    // Sculpted Couture Torso (Tailor's Form)
    const torsoPoints = [];
    torsoPoints.push(new THREE.Vector2(0.12, 1.05));  // Collar
    torsoPoints.push(new THREE.Vector2(0.38, 0.95));  // Shoulder
    torsoPoints.push(new THREE.Vector2(0.35, 0.70));  // Bust apex
    torsoPoints.push(new THREE.Vector2(0.22, 0.35));  // Natural waist
    torsoPoints.push(new THREE.Vector2(0.38, -0.05)); // High hip
    torsoPoints.push(new THREE.Vector2(0.42, -0.35)); // Low hip
    torsoPoints.push(new THREE.Vector2(0.18, -0.65)); // Thigh base

    const torsoGeo = new THREE.LatheGeometry(torsoPoints, 48);
    torsoGeo.scale(1.0, 1.0, 0.75); // Flatten depth for realistic couture bust
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f26,
      roughness: 0.65,
      metalness: 0.1
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    this.mannequinGroup.add(torsoMesh);

    // Elegant Waistband Belt in Polished Gold
    const beltGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 48);
    beltGeo.scale(1.0, 1.0, 0.76);
    const beltMesh = new THREE.Mesh(beltGeo, goldMetalMat);
    beltMesh.position.y = 0.35;
    this.mannequinGroup.add(beltMesh);

    // Flowing Parametric Haute Couture Gown Skirt
    const skirtGeo = new THREE.CylinderGeometry(0.24, 1.05, 1.9, 64, 32, true);
    // Displace vertices to create fluid bias-cut folds
    this.originalSkirtVertices = [];
    const pos = skirtGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      this.originalSkirtVertices.push({ x, y, z });
    }

    this.clothMaterial = this.createFabricMaterial(this.currentFabric);
    this.clothMesh = new THREE.Mesh(skirtGeo, this.clothMaterial);
    this.clothMesh.position.y = -0.55;
    this.clothMesh.castShadow = true;
    this.clothMesh.receiveShadow = true;
    this.mannequinGroup.add(this.clothMesh);

    // Dynamic Floating Silk Ribbons (Spiral Runway Ribbon)
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, -1.5, 0.4),
      new THREE.Vector3(0.7, -0.9, 0.5),
      new THREE.Vector3(0.5, -0.1, -0.5),
      new THREE.Vector3(-0.5, 0.5, -0.3),
      new THREE.Vector3(-0.4, 1.1, 0.3),
      new THREE.Vector3(0.4, 1.5, -0.2)
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 80, 0.035, 16, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.7,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    this.ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.mannequinGroup.add(this.ribbonMesh);

    this.scene.add(this.mannequinGroup);
  }

  createFabricMaterial(fabricKey) {
    switch (fabricKey) {
      case 'gold-brocade':
        return new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.85,
          roughness: 0.28,
          side: THREE.DoubleSide
        });
      case 'emerald-velvet':
        return new THREE.MeshStandardMaterial({
          color: 0x073b26,
          metalness: 0.15,
          roughness: 0.85,
          side: THREE.DoubleSide
        });
      case 'rose-organza':
        return new THREE.MeshPhysicalMaterial({
          color: 0xe8b4b8,
          metalness: 0.05,
          roughness: 0.35,
          transmission: 0.65,
          thickness: 0.5,
          side: THREE.DoubleSide
        });
      case 'liquid-silver':
        return new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          metalness: 0.95,
          roughness: 0.12,
          side: THREE.DoubleSide
        });
      case 'noir-satin':
      default:
        return new THREE.MeshStandardMaterial({
          color: 0x111115,
          metalness: 0.3,
          roughness: 0.22,
          side: THREE.DoubleSide
        });
    }
  }

  setFabric(fabricKey) {
    this.currentFabric = fabricKey;
    if (this.clothMesh) {
      this.clothMesh.material = this.createFabricMaterial(fabricKey);
    }
  }

  buildParticleCosmos() {
    const particleCount = 600;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const y = -2.0 + Math.random() * 4.0;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Golden champagne sparkle colors
      colors[i * 3] = 0.83 + Math.random() * 0.17; // R
      colors[i * 3 + 1] = 0.68 + Math.random() * 0.2; // G
      colors[i * 3 + 2] = 0.21 + Math.random() * 0.3; // B
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  build3DVideoCarousel() {
    this.videoCarouselGroup = new THREE.Group();
    this.videoCarouselGroup.visible = false;

    const radius = 2.8;
    const cardGeo = new THREE.CylinderGeometry(radius, radius, 2.2, 48, 1, true, 0, Math.PI / 3);

    DESIGNS_DATA.forEach((design, index) => {
      const angle = (index / DESIGNS_DATA.length) * Math.PI * 2;
      
      // Create HTML video element for 3D texture
      const video = document.createElement('video');
      video.src = design.videoSrc;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.play().catch(() => {});

      const videoTex = new THREE.VideoTexture(video);
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      this.videoTextures.push({ video, tex: videoTex });

      // Curved panel
      const planeGeo = new THREE.PlaneGeometry(1.4, 2.2, 16, 16);
      const planeMat = new THREE.MeshBasicMaterial({
        map: videoTex,
        side: THREE.DoubleSide
      });
      const panelMesh = new THREE.Mesh(planeGeo, planeMat);

      panelMesh.position.x = Math.sin(angle) * radius;
      panelMesh.position.z = Math.cos(angle) * radius;
      panelMesh.position.y = 0.1;
      panelMesh.lookAt(0, 0.1, 0);

      // Gold frame around 3D video panel
      const frameGeo = new THREE.RingGeometry(0.75, 0.78, 4);
      const frameMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.scale.set(1.0, 1.55, 1.0);
      frameMesh.position.z = -0.01;
      panelMesh.add(frameMesh);

      this.videoCarouselGroup.add(panelMesh);
    });

    this.scene.add(this.videoCarouselGroup);
  }

  setMode(mode) {
    this.activeMode = mode;
    if (mode === 'video-carousel') {
      this.mannequinGroup.visible = false;
      this.videoCarouselGroup.visible = true;
      this.videoTextures.forEach(item => item.video.play().catch(() => {}));
    } else {
      this.mannequinGroup.visible = true;
      this.videoCarouselGroup.visible = false;
    }
  }

  attachEventListeners() {
    const dom = this.renderer.domElement;

    // Mouse / Touch Drag to Rotate 360
    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;

        this.targetRotation.y += deltaX * 0.008;
        this.targetRotation.x = Math.max(-0.4, Math.min(0.4, this.targetRotation.x + deltaY * 0.005));

        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch controls
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.prevMousePos.x;
        const deltaY = e.touches[0].clientY - this.prevMousePos.y;

        this.targetRotation.y += deltaX * 0.008;
        this.targetRotation.x = Math.max(-0.4, Math.min(0.4, this.targetRotation.x + deltaY * 0.005));

        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    // Zoom on wheel
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetZoom = Math.max(3.2, Math.min(7.0, this.targetZoom + e.deltaY * 0.003));
    }, { passive: false });

    // Window resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight || 550;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth inertia camera & rotation interpolation
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.08;

    this.camera.position.z = this.currentZoom;

    // Slow ambient autorotation if not dragging
    if (!this.isDragging) {
      this.targetRotation.y += 0.0035;
    }

    if (this.mannequinGroup && this.mannequinGroup.visible) {
      this.mannequinGroup.rotation.y = this.currentRotation.y;
      this.mannequinGroup.rotation.x = this.currentRotation.x;

      // Physics Wave Animation for Draped Gown (Wind & Catwalk Motion)
      if (this.clothMesh && this.originalSkirtVertices) {
        const pos = this.clothMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const orig = this.originalSkirtVertices[i];
          const waveFactor = Math.abs(orig.y - 0.5) / 1.5; // Greater wave amplitude near hemline
          const wave = Math.sin(elapsedTime * 3.5 + orig.y * 4.0 + orig.x * 2.0) * 0.045 * waveFactor;
          const ruffle = Math.cos(elapsedTime * 2.5 + orig.z * 5.0) * 0.025 * waveFactor;

          pos.setX(i, orig.x + wave);
          pos.setZ(i, orig.z + ruffle);
        }
        pos.needsUpdate = true;
        this.clothMesh.geometry.computeVertexNormals();
      }

      // Spiral ribbon slow vertical breathing
      if (this.ribbonMesh) {
        this.ribbonMesh.rotation.y = elapsedTime * 0.3;
      }
    }

    // 3D Video Carousel Rotation
    if (this.videoCarouselGroup && this.videoCarouselGroup.visible) {
      this.videoCarouselGroup.rotation.y = this.currentRotation.y;
      this.videoCarouselGroup.rotation.x = this.currentRotation.x;
    }

    // Floating Golden Particle Cosmos Rotation
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.05;
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.0015;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
