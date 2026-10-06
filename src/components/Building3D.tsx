import { useEffect, useRef } from "react";
import type * as THREE from "three";

type Props = {
  /** Returns build progress 0..1. If omitted, animates automatically on load. */
  getProgress?: () => number;
  className?: string;
  autoDuration?: number;
};

/**
 * A procedural villa drawn as blueprint lines that resolve into solid
 * materials, then landscaping and lights. three.js is loaded dynamically so
 * nothing runs during SSR.
 */
export function Building3D({ getProgress, className, autoDuration = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(getProgress);
  progressRef.current = getProgress;

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const T = await import("three");
      const el = ref.current;
      if (!el || disposed) return;

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(32, 1, 0.1, 200);
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      const BRONZE = 0xa47b4f;
      const hemi = new T.HemisphereLight(0xfff6ea, 0xc9bfae, 0.9);
      scene.add(hemi);
      const sun = new T.DirectionalLight(0xfff1dc, 1.6);
      sun.position.set(8, 14, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -12;
      sun.shadow.camera.right = 12;
      sun.shadow.camera.top = 12;
      sun.shadow.camera.bottom = -12;
      scene.add(sun);

      const root = new T.Group();
      scene.add(root);

      type Part = {
        mesh: THREE.Mesh;
        edges: THREE.LineSegments;
        lineAt: number;
        solidAt: number;
        mat: THREE.MeshStandardMaterial;
        lineMat: THREE.LineBasicMaterial;
        baseOpacity: number;
      };
      const parts: Part[] = [];

      const add = (
        size: [number, number, number],
        pos: [number, number, number],
        color: number,
        lineAt: number,
        solidAt: number,
        opts: { opacity?: number; rough?: number; metal?: number; emissive?: number; geo?: THREE.BufferGeometry } = {},
      ) => {
        const geo = opts.geo ?? new T.BoxGeometry(...size);
        const mat = new T.MeshStandardMaterial({
          color,
          roughness: opts.rough ?? 0.85,
          metalness: opts.metal ?? 0,
          transparent: true,
          opacity: 0,
          emissive: opts.emissive ?? 0x000000,
          emissiveIntensity: 0,
        });
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(...pos);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const lineMat = new T.LineBasicMaterial({ color: BRONZE, transparent: true, opacity: 0 });
        const edges = new T.LineSegments(new T.EdgesGeometry(geo), lineMat);
        edges.position.copy(mesh.position);
        root.add(mesh, edges);
        parts.push({ mesh, edges, lineAt, solidAt, mat, lineMat, baseOpacity: opts.opacity ?? 1 });
        return mesh;
      };

      const STONE = 0xe4dccd;
      const CONCRETE = 0xd2cdc4;
      const CHARCOAL = 0x2b2a28;
      const GLASS = 0x9fb3b8;

      // Ground & grid
      const grid = new T.GridHelper(30, 30, BRONZE, BRONZE);
      (grid.material as THREE.Material).transparent = true;
      (grid.material as THREE.Material).opacity = 0;
      root.add(grid);
      add([18, 0.2, 12], [0, -0.1, 0], 0xece6da, 0.0, 0.45);

      // Plinth + terrace
      add([11, 0.4, 7], [0.5, 0.2, 0], STONE, 0.05, 0.42);
      // Ground floor volume
      add([6, 2.4, 4.6], [1.6, 1.6, -0.6], CONCRETE, 0.1, 0.5);
      // Ground glazing
      add([4.4, 2.1, 0.06], [0.9, 1.45, 1.72], GLASS, 0.14, 0.58, { opacity: 0.55, rough: 0.05, metal: 0.6, emissive: 0xffc98a });
      // Columns
      for (const x of [-3.2, -1.2]) add([0.18, 2.4, 0.18], [x, 1.6, 1.6], CHARCOAL, 0.16, 0.5);
      // Cantilevered upper slab
      add([9, 0.35, 5.2], [-0.2, 2.98, 0], STONE, 0.2, 0.52);
      // Upper volume
      add([6.4, 2.2, 4], [-0.9, 4.25, -0.3], STONE, 0.24, 0.56);
      add([5.6, 1.9, 0.06], [-1.1, 4.2, 1.72], GLASS, 0.28, 0.6, { opacity: 0.5, rough: 0.05, metal: 0.6, emissive: 0xffc98a });
      // Roof slab
      add([7.6, 0.3, 5], [-0.9, 5.5, 0], CONCRETE, 0.3, 0.6);
      // Side stone wall
      add([0.5, 5.2, 4.6], [4.8, 2.9, -0.6], 0xc8bba5, 0.32, 0.62);
      // Bronze fins
      for (let i = 0; i < 6; i++) add([0.06, 1.9, 0.12], [-3.6 + i * 0.95, 4.2, 1.82], BRONZE, 0.35, 0.66, { metal: 0.7, rough: 0.35 });
      // Pool
      add([5, 0.08, 2.2], [-2.6, 0.42, 2.6], 0x7fa7ad, 0.38, 0.7, { rough: 0.05, metal: 0.3, opacity: 0.9 });

      // Landscaping: trees + shrubs (appear last)
      const trees: THREE.Mesh[] = [];
      const treeSpots: [number, number, number][] = [
        [6.4, 0, 2.6], [-6.2, 0, -1.5], [6.8, 0, -2.6], [3.6, 0, 3.6],
      ];
      for (const [x, , z] of treeSpots) {
        add([0.14, 1.4, 0.14], [x, 0.9, z], 0x6b5a45, 0.72, 0.78);
        const t = add([1, 1, 1], [x, 2.1, z], 0x7c8a5e, 0.74, 0.82, {
          geo: new T.IcosahedronGeometry(0.9, 1),
        });
        trees.push(t);
      }
      for (let i = 0; i < 7; i++) {
        add([1, 1, 1], [-5 + i * 1.6, 0.6, 3.6], 0x8a9767, 0.76, 0.84, {
          geo: new T.SphereGeometry(0.42, 12, 10),
        });
      }

      // Warm architectural lights
      const lamp = new T.PointLight(0xffc98a, 0, 14, 1.6);
      lamp.position.set(0, 2.2, 3);
      scene.add(lamp);

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove);

      const clamp = (v: number) => Math.max(0, Math.min(1, v));
      const ease = (t: number) => t * t * (3 - 2 * t);
      const start = performance.now();
      let smooth = 0;
      let raf = 0;

      const tick = () => {
        raf = requestAnimationFrame(tick);
        const auto = clamp((performance.now() - start) / 1000 / autoDuration);
        const target = progressRef.current ? progressRef.current() : ease(auto);
        smooth += (target - smooth) * 0.06;
        const p = smooth;

        (grid.material as THREE.Material).opacity = 0.35 * clamp(p / 0.08) * (1 - clamp((p - 0.45) / 0.2));
        for (const part of parts) {
          const l = clamp((p - part.lineAt) / 0.12);
          const s = clamp((p - part.solidAt) / 0.14);
          part.lineMat.opacity = l * (1 - s * 0.85);
          part.mat.opacity = s * part.baseOpacity;
          part.mesh.visible = s > 0.001;
          const grow = 0.92 + 0.08 * ease(l);
          part.mesh.scale.setScalar(grow);
          part.edges.scale.setScalar(grow);
        }
        const lights = clamp((p - 0.85) / 0.15);
        lamp.intensity = lights * 6;
        for (const part of parts) part.mat.emissiveIntensity = lights * 0.35;

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        root.rotation.y = -0.55 + p * 0.5 + mouse.x * 0.18;
        root.rotation.x = mouse.y * 0.04;

        const dist = 34 - p * 10;
        camera.position.set(dist * 0.62, 9 - p * 3, dist * 0.78);
        camera.lookAt(0, 2, 0);
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [autoDuration]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
