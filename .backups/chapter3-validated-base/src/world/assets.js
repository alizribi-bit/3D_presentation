// Preloads every model of the prototype before the first state is shown (FR-024): nothing pops in late.
import * as THREE from 'three';
import assetManifest from '../../content/source/assets-manifest.json';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const NATURE = ['tree_default', 'tree_oak', 'tree_detailed', 'tree_fat', 'tree_cone', 'tree_small', 'tree_palm', 'tree_palmShort',
  'tree_palmDetailedTall', 'tree_palmBend', 'plant_bush', 'plant_bushLarge', 'plant_bushDetailed', 'plant_bushSmall', 'flower_yellowA',
  'flower_redA', 'flower_purpleA', 'grass', 'grass_large', 'rock_smallA', 'rock_smallC', 'rock_largeA', 'rock_tallA', 'stump_round', 'fence_simple'];
const FOOD = ['apple', 'orange', 'lemon', 'tomato', 'pear', 'grapes', 'carrot', 'cabbage', 'eggplant', 'paprika', 'pumpkin-basic',
  'watermelon', 'bread', 'loaf-baguette', 'cheese', 'honey', 'fish', 'bag', 'onion', 'corn'];
const COMMERCIAL = ['building-a', 'building-b', 'building-c', 'building-d', 'building-e', 'building-f', 'building-g', 'building-h',
  'low-detail-building-a', 'low-detail-building-b', 'low-detail-building-c', 'low-detail-building-d', 'detail-awning',
  'detail-awning-wide', 'detail-parasol-a', 'detail-parasol-b', 'detail-overhang'];
const SUBURBAN = ['building-type-a', 'building-type-b', 'building-type-c', 'building-type-d', 'building-type-e', 'building-type-f',
  'building-type-g', 'building-type-h', 'building-type-i', 'building-type-j', 'building-type-k', 'building-type-l', 'building-type-m',
  'building-type-n', 'building-type-o', 'building-type-p', 'building-type-q', 'building-type-r', 'building-type-s', 'building-type-t',
  'building-type-u', 'planter', 'tree-large', 'tree-small', 'fence-low', 'path-stones-long'];

export const MODEL_URLS = {
  'chars/guide': 'models/chars/guide.glb',
  'chars/rep': 'models/chars/rep.glb',
  'props/market-stand': 'models/props/market-stand.glb',
  'props/computer-screen': 'models/props/computer-screen.glb',
  ...Object.fromEntries(NATURE.map(n => [`nature/${n}`, `models/nature/${n}.glb`])),
  ...Object.fromEntries(FOOD.map(n => [`food/${n}`, `models/food/${n}.glb`])),
  ...Object.fromEntries(COMMERCIAL.map(n => [`commercial/${n}`, `models/commercial/${n}.glb`])),
  ...Object.fromEntries(SUBURBAN.map(n => [`suburban/${n}`, `models/suburban/${n}.glb`])),
};
export const IMAGE_URLS = assetManifest.assets.filter(a => /\.(png|jpg|jpeg|webp)$/.test(a.file)).map(a => a.file);

const cache = {};

export async function preload(onProgress = () => {}) {
  const loader = new GLTFLoader();
  const entries = Object.entries(MODEL_URLS);
  let done = 0;
  await Promise.all([
    ...entries.map(([k, url]) => loader.loadAsync(url).then(g => { cache[k] = g; onProgress(++done / (entries.length + IMAGE_URLS.length)); })),
    ...IMAGE_URLS.map(src => new Promise((res, rej) => { const i = new Image(); i.onload = () => { cache[src] = i; onProgress(++done / (entries.length + IMAGE_URLS.length)); res(); }; i.onerror = rej; i.src = src; })),
    document.fonts.load('600 30px Poppins'), document.fonts.load('400 42px Amiri', 'بسم'), document.fonts.load('400 20px "JetBrains Mono"'),
  ]);
  await restyle();
  return cache;
}

// One palette for the whole world: Kenney's turquoise leaves become ZAWEDNI greens, suburban roofs turn terracotta.
const NATURE_COLORS = { leafsGreen: '#4f9b62', grass: '#5f9f63', woodBark: '#a0704c', dirt: '#b98a62' };
async function restyle() {
  const roofs = await new THREE.TextureLoader().loadAsync('models/suburban/Textures/variation-b.png');
  roofs.colorSpace = THREE.SRGBColorSpace; roofs.flipY = false; roofs.magFilter = THREE.NearestFilter;
  for (const [k, g] of Object.entries(cache)) {
    if (!g.scene) continue;
    g.scene.traverse(m => {
      if (!m.isMesh) return;
      for (const mt of [m.material].flat()) {
        mt.roughness = Math.max(mt.roughness ?? 1, .85); mt.metalness = 0;
        if (k.startsWith('nature/') && NATURE_COLORS[mt.name]) mt.color.set(NATURE_COLORS[mt.name]);
        if (k.startsWith('suburban/') && mt.map) { roofs.wrapS = mt.map.wrapS; roofs.wrapT = mt.map.wrapT; mt.map = roofs; }
      }
    });
  }
}

export const gltf = k => { if (!cache[k]) throw new Error(`model not preloaded: ${k}`); return cache[k]; };
export const image = src => cache[src];

// A fresh, shadow-casting copy of a static model; skinned models go through SkeletonUtils.
export function instance(k) {
  const src = gltf(k).scene;
  const o = k.startsWith('chars/') ? SkeletonUtils.clone(src) : src.clone(true);
  o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return o;
}

// Scale a model so its bounding box height (or largest horizontal side) equals `size`, and stand it on y = 0.
export function fit(o, size, by = 'height') {
  const b = new THREE.Box3().setFromObject(o), s = new THREE.Vector3(); b.getSize(s);
  const ref = by === 'height' ? s.y : Math.max(s.x, s.z);
  o.scale.multiplyScalar(size / ref);
  const b2 = new THREE.Box3().setFromObject(o), c = new THREE.Vector3(); b2.getCenter(c);
  o.position.x -= c.x; o.position.z -= c.z; o.position.y -= b2.min.y;
  const g = new THREE.Group(); g.add(o); return g;
}
