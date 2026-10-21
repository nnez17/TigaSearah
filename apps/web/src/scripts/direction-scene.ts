import { gsap } from "gsap";
import * as THREE from "three";

function createTridentShape(): THREE.Shape {
	const shape = new THREE.Shape();

	// Right half from top center tip (0, 2.70) down to bottom center (0, -1.82)
	// 1. Center arrowhead (pointing straight up)
	shape.moveTo(0, 2.72);
	shape.lineTo(0.52, 1.76); // center arrow right barb
	shape.lineTo(0.22, 1.88); // chevron notch cut-in

	// 2. Center shaft going down to saddle
	shape.lineTo(0.19, 0.45);

	// 3. Saddle curve (inner edge of the prong arm)
	// Sweeps down and then gracefully curves up toward the side arrow
	shape.bezierCurveTo(0.2, 0.05, 0.34, -0.15, 0.48, 0.22);
	shape.bezierCurveTo(0.58, 0.58, 0.68, 1.15, 0.74, 1.54);

	// 4. Right side arrowhead (pointing outward-upward at ~25 degrees)
	shape.lineTo(0.58, 1.58); // inner barb
	shape.lineTo(1.24, 2.42); // tip of the side arrow
	shape.lineTo(1.52, 1.62); // outer barb
	shape.lineTo(1.3, 1.52); // outer chevron notch

	// 5. Outer arm curve
	// Sweeps outward with a taut, elegant bow, then flows into the base junction
	shape.bezierCurveTo(1.42, 1.05, 1.36, 0.25, 1.04, -0.32);
	shape.bezierCurveTo(0.78, -0.68, 0.46, -0.74, 0.32, -0.78);

	// 6. Turned collar ring
	shape.lineTo(0.35, -0.9);
	shape.lineTo(0.18, -0.95);

	// 7. Stem / handle
	shape.bezierCurveTo(0.17, -1.15, 0.16, -1.3, 0.17, -1.42);

	// 8. Flared base / pommel
	shape.bezierCurveTo(0.24, -1.54, 0.33, -1.62, 0.31, -1.74);
	shape.bezierCurveTo(0.27, -1.82, 0.12, -1.85, 0, -1.85);

	// Mirrored left half back to top center (0, 2.72)
	shape.bezierCurveTo(-0.12, -1.85, -0.27, -1.82, -0.31, -1.74);
	shape.bezierCurveTo(-0.33, -1.62, -0.24, -1.54, -0.17, -1.42);

	shape.bezierCurveTo(-0.16, -1.3, -0.17, -1.15, -0.18, -0.95);
	shape.lineTo(-0.35, -0.9);
	shape.lineTo(-0.32, -0.78);

	shape.bezierCurveTo(-0.46, -0.74, -0.78, -0.68, -1.04, -0.32);
	shape.bezierCurveTo(-1.36, 0.25, -1.42, 1.05, -1.3, 1.52);

	shape.lineTo(-1.52, 1.62);
	shape.lineTo(-1.24, 2.42);
	shape.lineTo(-0.58, 1.58);
	shape.lineTo(-0.74, 1.54);

	shape.bezierCurveTo(-0.68, 1.15, -0.58, 0.58, -0.48, 0.22);
	shape.bezierCurveTo(-0.34, -0.15, -0.2, 0.05, -0.19, 0.45);

	shape.lineTo(-0.22, 1.88);
	shape.lineTo(-0.52, 1.76);
	shape.lineTo(0, 2.72);

	shape.closePath();
	return shape;
}

function createChiseledSpineGeometry(): THREE.BufferGeometry {
	const positions: number[] = [];

	function addTri(p1: number[], p2: number[], p3: number[]) {
		positions.push(...p1, ...p2, ...p3);
	}
	function addQuad(p1: number[], p2: number[], p3: number[], p4: number[]) {
		addTri(p1, p2, p3);
		addTri(p1, p3, p4);
	}

	// Ridge sits above extruded face (which is depth 0.28, from z = -0.14 to z = +0.14)
	const zBase = 0.141;
	const zSpine = 0.218;

	// Front side facets
	{
		const cTip = [0, 2.72, zSpine];
		const cBarbR = [0.52, 1.76, zBase];
		const cNotchR = [0.22, 1.88, zBase];
		const cMid = [0, 1.84, zSpine];
		const cBarbL = [-0.52, 1.76, zBase];
		const cNotchL = [-0.22, 1.88, zBase];
		const cShaftMid = [0, 0.45, zSpine * 0.72];
		const cShaftR = [0.19, 0.45, zBase];
		const cShaftL = [-0.19, 0.45, zBase];

		// Central arrow front facets (chiseled diamond)
		addTri(cTip, cBarbR, cMid);
		addTri(cMid, cBarbR, cNotchR);
		addTri(cTip, cMid, cBarbL);
		addTri(cMid, cNotchL, cBarbL);
		addQuad(cMid, cNotchR, cShaftR, cShaftMid);
		addQuad(cMid, cShaftMid, cShaftL, cNotchL);

		// Side arrowheads front facets
		for (const side of [1, -1]) {
			const sTip = [side * 1.24, 2.42, zSpine * 0.95];
			const sOuterBarb = [side * 1.52, 1.62, zBase];
			const sOuterNotch = [side * 1.3, 1.52, zBase];
			const sInnerBarb = [side * 0.58, 1.58, zBase];
			const sInnerNotch = [side * 0.74, 1.54, zBase];
			const sMid = [side * 1.05, 1.68, zSpine * 0.95];

			if (side === 1) {
				addTri(sTip, sOuterBarb, sMid);
				addTri(sMid, sOuterBarb, sOuterNotch);
				addTri(sTip, sMid, sInnerBarb);
				addTri(sMid, sInnerNotch, sInnerBarb);
			} else {
				addTri(sTip, sMid, sOuterBarb);
				addTri(sMid, sOuterNotch, sOuterBarb);
				addTri(sTip, sInnerBarb, sMid);
				addTri(sMid, sInnerBarb, sInnerNotch);
			}
		}
	}

	// Back side facets (mirrored in -Z, inverted winding)
	const zBaseB = -0.141;
	const zSpineB = -0.218;
	{
		const cTip = [0, 2.72, zSpineB];
		const cBarbR = [0.52, 1.76, zBaseB];
		const cNotchR = [0.22, 1.88, zBaseB];
		const cMid = [0, 1.84, zSpineB];
		const cBarbL = [-0.52, 1.76, zBaseB];
		const cNotchL = [-0.22, 1.88, zBaseB];
		const cShaftMid = [0, 0.45, zSpineB * 0.72];
		const cShaftR = [0.19, 0.45, zBaseB];
		const cShaftL = [-0.19, 0.45, zBaseB];

		addTri(cTip, cMid, cBarbR);
		addTri(cMid, cNotchR, cBarbR);
		addTri(cTip, cBarbL, cMid);
		addTri(cMid, cBarbL, cNotchL);
		addQuad(cMid, cShaftMid, cShaftR, cNotchR);
		addQuad(cMid, cNotchL, cShaftL, cShaftMid);

		for (const side of [1, -1]) {
			const sTip = [side * 1.24, 2.42, zSpineB * 0.95];
			const sOuterBarb = [side * 1.52, 1.62, zBaseB];
			const sOuterNotch = [side * 1.3, 1.52, zBaseB];
			const sInnerBarb = [side * 0.58, 1.58, zBaseB];
			const sInnerNotch = [side * 0.74, 1.54, zBaseB];
			const sMid = [side * 1.05, 1.68, zSpineB * 0.95];

			if (side === 1) {
				addTri(sTip, sMid, sOuterBarb);
				addTri(sMid, sOuterNotch, sOuterBarb);
				addTri(sTip, sInnerBarb, sMid);
				addTri(sMid, sInnerBarb, sInnerNotch);
			} else {
				addTri(sTip, sOuterBarb, sMid);
				addTri(sMid, sOuterBarb, sOuterNotch);
				addTri(sTip, sMid, sInnerBarb);
				addTri(sMid, sInnerNotch, sInnerBarb);
			}
		}
	}

	const geo = new THREE.BufferGeometry();
	geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
	geo.computeVertexNormals();
	return geo;
}

function createOrbitalParticles(): {
	mesh: THREE.Points;
	geometry: THREE.BufferGeometry;
	material: THREE.PointsMaterial;
} {
	const count = 75;
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		const radius = 2.3 + Math.random() * 1.4;
		const angle = Math.random() * Math.PI * 2;
		const z = (Math.random() - 0.5) * 1.6;
		positions[i * 3] = Math.cos(angle) * radius;
		positions[i * 3 + 1] = Math.sin(angle) * radius * 0.95 + 0.25;
		positions[i * 3 + 2] = z;
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	const material = new THREE.PointsMaterial({
		color: 0x93c5fd,
		size: 0.05,
		transparent: true,
		opacity: 0.65,
		blending: THREE.AdditiveBlending,
	});
	const mesh = new THREE.Points(geometry, material);
	return { mesh, geometry, material };
}

export function mountScene(host: HTMLElement) {
	const canvas = host.querySelector<HTMLCanvasElement>("canvas");
	if (!canvas) return;
	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: "high-performance",
		});
	} catch {
		return;
	}
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.setClearColor(0x0b0d10, 0);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.1;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
	camera.position.set(-0.2, 0.5, 13.4);
	camera.lookAt(0, 0.05, 0);
	const ambient = new THREE.HemisphereLight(0xe4f2ff, 0x183a60, 1.1);
	scene.add(ambient);
	const key = new THREE.DirectionalLight(0xf4f9ff, 2.6);
	key.position.set(-3.5, 7, 6);
	const rimRight = new THREE.DirectionalLight(0x71bfff, 2.4);
	rimRight.position.set(5.5, 2.5, -2.5);
	const rimLeft = new THREE.DirectionalLight(0x6ba9ff, 2.0);
	rimLeft.position.set(-6, 2, -2.5);
	const fill = new THREE.DirectionalLight(0xffffff, 0.8);
	fill.position.set(-5, -0.5, 3.5);
	scene.add(key, rimRight, rimLeft, fill);

	// Reactive point light that follows the cursor in 3D space
	const pointerLight = new THREE.PointLight(0x70b4ff, 4.0, 14, 1.6);
	pointerLight.position.set(0, 0, 3.2);
	scene.add(pointerLight);

	// High dynamic procedural environment giving the metal rich highlights
	const environmentScene = new THREE.Scene();
	const skyTexture = (() => {
		const size = 128;
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = size;
		const context = canvas.getContext("2d");
		if (context) {
			const gradient = context.createLinearGradient(0, 0, 0, size);
			gradient.addColorStop(0, "#ffffff");
			gradient.addColorStop(0.25, "#dceaff");
			gradient.addColorStop(0.55, "#6892c2");
			gradient.addColorStop(0.8, "#1a2c42");
			gradient.addColorStop(1, "#0d1520");
			context.fillStyle = gradient;
			context.fillRect(0, 0, size, size);
		}
		const texture = new THREE.CanvasTexture(canvas);
		texture.mapping = THREE.EquirectangularReflectionMapping;
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;
	})();
	environmentScene.background = skyTexture;
	const lightGeometry = new THREE.PlaneGeometry(12, 8);
	const lightMaterial = new THREE.MeshBasicMaterial({
		color: 0xebf4ff,
		side: THREE.DoubleSide,
	});
	const softbox = new THREE.Mesh(lightGeometry, lightMaterial);
	softbox.position.set(-5, 5, 4);
	softbox.lookAt(0, 0, 0);
	environmentScene.add(softbox);
	const softbox2 = softbox.clone();
	softbox2.position.set(5, 1, -4);
	softbox2.lookAt(0, 0, 0);
	environmentScene.add(softbox2);

	const softbox3 = softbox.clone();
	softbox3.position.set(0, 0, 7);
	softbox3.lookAt(0, 0, 0);
	environmentScene.add(softbox3);

	const softbox4 = softbox.clone();
	softbox4.scale.set(0.4, 0.25, 1);
	softbox4.position.set(-2.2, 3.6, 5.4);
	softbox4.lookAt(0, 0, 0);
	environmentScene.add(softbox4);

	const softbox5 = softbox.clone();
	softbox5.scale.set(0.35, 0.25, 1);
	softbox5.position.set(2.4, 3.2, 5.2);
	softbox5.lookAt(0, 0, 0);
	environmentScene.add(softbox5);

	const pmrem = new THREE.PMREMGenerator(renderer);
	const environment = pmrem.fromScene(environmentScene, 0.02);
	scene.environment = environment.texture;
	pmrem.dispose();
	lightGeometry.dispose();
	lightMaterial.dispose();
	skyTexture.dispose();

	const bevel = {
		bevelEnabled: true,
		bevelThickness: 0.055,
		bevelSize: 0.045,
		bevelSegments: 4,
		steps: 1,
	};
	const tridentGeometry = new THREE.ExtrudeGeometry(createTridentShape(), {
		...bevel,
		depth: 0.28,
		curveSegments: 24,
	});

	// Signature brand blue metallic finish with clearcoat and iridescence
	const face = new THREE.MeshPhysicalMaterial({
		color: 0x1e6de3,
		emissive: 0x051b47,
		metalness: 0.88,
		roughness: 0.16,
		clearcoat: 0.9,
		clearcoatRoughness: 0.06,
		iridescence: 0.45,
		iridescenceIOR: 1.36,
		iridescenceThicknessRange: [120, 360],
		reflectivity: 1.0,
		envMapIntensity: 2.4,
	});
	const bevelMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x93c5fd,
		emissive: 0x0a2a5e,
		metalness: 0.94,
		roughness: 0.12,
		clearcoat: 1.0,
		clearcoatRoughness: 0.04,
		reflectivity: 1.0,
		envMapIntensity: 2.8,
	});
	const materials = [face, bevelMaterial];

	const group = new THREE.Group();
	group.rotation.set(0, -0.22, 0);
	group.position.set(0, 0.15, 0);

	// reactionGroup isolates theme transition kinetics without disturbing
	// the organic breathing float and pointer lerp on group
	const reactionGroup = new THREE.Group();
	group.add(reactionGroup);

	const trident = new THREE.Mesh(tridentGeometry, materials);
	trident.position.z = -0.14;
	reactionGroup.add(trident);

	// Chiseled 3D diamond spine overlay
	const spineGeometry = createChiseledSpineGeometry();
	const spineMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x3b82f6,
		emissive: 0x072254,
		metalness: 0.92,
		roughness: 0.14,
		clearcoat: 0.95,
		clearcoatRoughness: 0.05,
		iridescence: 0.5,
		envMapIntensity: 2.6,
	});
	const spineMesh = new THREE.Mesh(spineGeometry, spineMaterial);
	spineMesh.position.z = -0.14;
	reactionGroup.add(spineMesh);

	// Orbital celestial particles
	const particles = createOrbitalParticles();
	reactionGroup.add(particles.mesh);

	// Dashed halo ring + 4 radiant ray pairs (matching the official logo)
	const halo = new THREE.Group();
	const haloGeometries: THREE.BufferGeometry[] = [];
	const haloMaterial = new THREE.LineDashedMaterial({
		color: 0x93c5fd,
		dashSize: 0.28,
		gapSize: 0.22,
		transparent: true,
		opacity: 0.65,
	});
	const rayMaterial = new THREE.LineBasicMaterial({
		color: 0x60a5fa,
		transparent: true,
		opacity: 0.7,
	});

	for (const [from, to] of [
		[65, -65],
		[115, 245],
	]) {
		const points = Array.from({ length: 49 }, (_, index) => {
			const angle = THREE.MathUtils.degToRad(from + ((to - from) * index) / 48);
			return new THREE.Vector3(
				Math.cos(angle) * 2.52,
				Math.sin(angle) * 2.52,
				0,
			);
		});
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		haloGeometries.push(geometry);
		const line = new THREE.Line(geometry, haloMaterial);
		line.computeLineDistances();
		halo.add(line);
	}

	// 4 pairs of outward radiance ticks
	const rayAngles = [38, 48, 132, 142, 218, 228, 312, 322];
	for (const deg of rayAngles) {
		const rad = THREE.MathUtils.degToRad(deg);
		const rInner = 2.68;
		const rOuter = 2.88;
		const rayPts = [
			new THREE.Vector3(Math.cos(rad) * rInner, Math.sin(rad) * rInner, 0),
			new THREE.Vector3(Math.cos(rad) * rOuter, Math.sin(rad) * rOuter, 0),
		];
		const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPts);
		haloGeometries.push(rayGeo);
		halo.add(new THREE.Line(rayGeo, rayMaterial));
	}

	halo.position.z = -0.4;
	reactionGroup.add(halo);
	scene.add(group);

	// Check if initial page state is light mode
	const isInitialLight =
		document.documentElement.classList.contains("light-theme");
	if (isInitialLight) {
		face.color.set(0x1d4ed8);
		face.emissive.set(0x062060);
		bevelMaterial.color.set(0x60a5fa);
		bevelMaterial.emissive.set(0x1e40af);
		spineMaterial.color.set(0x2563eb);
		pointerLight.color.set(0x2563eb);
	}

	// Unified entrance animation: starts from depth, slightly angled, blooming into resting pose
	reactionGroup.position.set(0, -0.65, -2.6);
	reactionGroup.rotation.set(0.18, -0.65, -0.06);
	reactionGroup.scale.set(0.72, 0.72, 0.72);
	pointerLight.intensity = 0;
	haloMaterial.opacity = 0;
	rayMaterial.opacity = 0;
	particles.material.opacity = 0;

	const entrance = gsap.timeline({
		defaults: { ease: "power3.out" },
	});
	entrance.to(reactionGroup.position, { x: 0, y: 0, z: 0, duration: 1.5 }, 0);
	entrance.to(reactionGroup.rotation, { x: 0, y: 0, z: 0, duration: 1.6 }, 0);
	entrance.to(
		reactionGroup.scale,
		{ x: 1.0, y: 1.0, z: 1.0, duration: 1.4, ease: "power2.out" },
		0,
	);
	entrance.to(
		[haloMaterial, rayMaterial],
		{
			opacity: (i: number) => (i === 0 ? 0.65 : 0.7),
			duration: 1.2,
			ease: "power2.inOut",
		},
		0.2,
	);
	entrance.to(
		particles.material,
		{ opacity: 0.85, duration: 1.4, ease: "power2.inOut" },
		0.3,
	);
	entrance.to(
		pointerLight,
		{
			intensity: isInitialLight ? 5.0 : 4.0,
			duration: 1.2,
			ease: "power2.out",
		},
		0.1,
	);

	// Elegant 3D Trident material & lighting theme sync (no disruptive physical spin)
	let reactionTimeline: gsap.core.Timeline | null = null;
	function triggerThemeReaction(isLight: boolean) {
		if (disposed || reduced.matches) return;
		reactionTimeline?.kill();
		reactionTimeline = gsap.timeline();

		if (isLight) {
			// Smoothly shift to light cobalt accents
			reactionTimeline.to(pointerLight, {
				intensity: 5.0,
				duration: 0.6,
				ease: "power2.out",
				onStart: () => {
					pointerLight.color.set(0x2563eb);
					face.color.set(0x1d4ed8);
					face.emissive.set(0x062060);
					bevelMaterial.color.set(0x60a5fa);
					bevelMaterial.emissive.set(0x1e40af);
					spineMaterial.color.set(0x2563eb);
				},
			});
		} else {
			// Smoothly shift back to dark titanium accents
			reactionTimeline.to(pointerLight, {
				intensity: 4.0,
				duration: 0.6,
				ease: "power2.out",
				onStart: () => {
					pointerLight.color.set(0x70b4ff);
					face.color.set(0x1e6de3);
					face.emissive.set(0x051b47);
					bevelMaterial.color.set(0x93c5fd);
					bevelMaterial.emissive.set(0x0a2a5e);
					spineMaterial.color.set(0x3b82f6);
				},
			});
		}
	}

	const handleThemeChange = (event: Event) => {
		const custom = event as CustomEvent<{
			theme: "light" | "dark";
			x: number;
			y: number;
		}>;
		const isLight = custom.detail?.theme === "light";
		triggerThemeReaction(isLight);
	};
	window.addEventListener("theme-change", handleThemeChange);
	let visible = true;
	const paused = false;
	let disposed = false;
	let frame = 0;
	let lastFrame = 0;
	let elapsed = 0;
	let pointerX = 0;
	let pointerY = 0;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const draw = () => {
		if (!disposed) renderer.render(scene, camera);
	};
	function tick(time: number) {
		frame = 0;
		if (disposed || paused || !visible || document.hidden || reduced.matches)
			return;
		const delta = lastFrame ? Math.min(time - lastFrame, 100) : 0;
		lastFrame = time;
		elapsed += delta;

		// Pointer tracking light gives specular gleam on facets
		pointerLight.position.x +=
			(pointerX * 5.5 - pointerLight.position.x) * 0.08;
		pointerLight.position.y +=
			(0.4 - pointerY * 4.5 - pointerLight.position.y) * 0.08;

		// Orbiting stardust rotation
		particles.mesh.rotation.z = elapsed * 0.00015;
		particles.mesh.rotation.y = elapsed * 0.0001;

		// Organic breathing float & responsive tilt
		group.position.y = 0.15 + Math.sin(elapsed * 0.00075) * 0.07;
		group.rotation.y += (-0.22 + pointerX * 0.22 - group.rotation.y) * 0.04;
		group.rotation.x += (pointerY * 0.12 - group.rotation.x) * 0.04;
		group.rotation.z = Math.sin(elapsed * 0.0005) * 0.015;

		draw();
		frame = requestAnimationFrame(tick);
	}
	const sync = () => {
		cancelAnimationFrame(frame);
		lastFrame = 0;
		if (
			!disposed &&
			!paused &&
			visible &&
			!document.hidden &&
			!reduced.matches
		) {
			entrance.resume();
			frame = requestAnimationFrame(tick);
		} else {
			entrance.pause();
			draw();
		}
	};

	// Sizing parameters: refined bounds so the mark never crowds copy or bottom actions
	const HALF_EXTENT_DESKTOP = 3.65;
	const HALF_EXTENT_MOBILE = 4.1;
	const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(30) / 2);

	const resize = new ResizeObserver(() => {
		const { width, height } = host.getBoundingClientRect();
		if (!width || !height || disposed) return;
		renderer.setSize(width, height, false);
		const aspect = width / height;
		camera.aspect = aspect;

		const halfExtent = aspect >= 1.1 ? HALF_EXTENT_DESKTOP : HALF_EXTENT_MOBILE;
		const distance = Math.max(
			halfExtent / HALF_FOV_TAN,
			halfExtent / HALF_FOV_TAN / aspect,
		);
		camera.position.z = distance;

		// On wide desktop: position right column at ~73% viewport width
		// Shift camera.position.x to negative so subject appears on the right
		const spread = THREE.MathUtils.clamp((aspect - 1.1) / 1.3, 0, 1);
		const halfWidth = HALF_FOV_TAN * distance * aspect;
		camera.position.x = -spread * halfWidth * 0.49;
		camera.position.y = aspect >= 1.1 ? 0.05 : 0.2;
		camera.lookAt(camera.position.x, camera.position.y, 0);
		camera.updateProjectionMatrix();
		draw();
	});
	resize.observe(host);
	const visibility = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		sync();
	});
	visibility.observe(host);
	const pointer = (event: PointerEvent) => {
		if (event.pointerType !== "mouse") return;
		const box = host.getBoundingClientRect();
		pointerX = (event.clientX - box.left) / box.width - 0.5;
		pointerY = (event.clientY - box.top) / box.height - 0.5;
	};
	const resetPointer = () => {
		pointerX = pointerY = 0;
	};
	host.addEventListener("pointermove", pointer);
	host.addEventListener("pointerleave", resetPointer);
	document.addEventListener("visibilitychange", sync);
	reduced.addEventListener("change", sync);
	const contextLost = (event: Event) => {
		event.preventDefault();
		dispose();
	};
	canvas.addEventListener("webglcontextlost", contextLost);
	const pageHide = (event: PageTransitionEvent) => {
		if (event.persisted) {
			visible = false;
			sync();
		} else dispose();
	};
	const pageShow = () => {
		visible = true;
		sync();
	};
	window.addEventListener("pagehide", pageHide);
	window.addEventListener("pageshow", pageShow);

	function dispose() {
		if (disposed) return;
		disposed = true;
		cancelAnimationFrame(frame);
		entrance.kill();
		reactionTimeline?.kill();
		window.removeEventListener("theme-change", handleThemeChange);
		resize.disconnect();
		visibility.disconnect();
		document.removeEventListener("visibilitychange", sync);
		reduced.removeEventListener("change", sync);
		host.removeEventListener("pointermove", pointer);
		host.removeEventListener("pointerleave", resetPointer);
		canvas?.removeEventListener("webglcontextlost", contextLost);
		window.removeEventListener("pagehide", pageHide);
		window.removeEventListener("pageshow", pageShow);
		tridentGeometry.dispose();
		spineGeometry.dispose();
		spineMaterial.dispose();
		particles.geometry.dispose();
		particles.material.dispose();
		haloMaterial.dispose();
		rayMaterial.dispose();
		face.dispose();
		bevelMaterial.dispose();
		for (const geometry of haloGeometries) {
			geometry.dispose();
		}
		environment.dispose();
		renderer.dispose();
		host.classList.remove("scene-ready");
	}

	if (reduced.matches) {
		dispose();
		return;
	}
	host.classList.add("scene-ready");
	sync();
	return dispose;
}
