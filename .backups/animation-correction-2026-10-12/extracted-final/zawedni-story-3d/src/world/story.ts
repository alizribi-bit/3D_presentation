// Dynamic story props are kept separate from the baked static scenery. Each frame is a pure state evaluation.
import * as THREE from 'three';
import { sceneProps } from './scene-props.ts';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { PlaceId, StoryState } from '../story/types.ts';
import { image } from './assets.js';
import { deliveryFrame } from '../story/delivery.ts';

const COLORS = { green: '#0d7b3c', blue: '#2f6db3', dark: '#223b4f', mint: '#5be38f', white: '#f4f7f2', orange: '#e8742c', red: '#b42020' };
const CENTERS: Record<PlaceId, [number, number]> = { '01': [-31,-1.5], '02': [-12,19], '03': [5,-9.5], '04': [24,12], '05': [37,-17], '06': [52,2] };
const materials = new Map<string, THREE.MeshStandardMaterial>();
const geometries = new Map<string, THREE.BufferGeometry>();
function material(color: string): THREE.MeshStandardMaterial {
  if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .85 }));
  return materials.get(color)!;
}
function box(parent: THREE.Object3D, size: [number,number,number], position: [number,number,number], color: string): THREE.Mesh {
  const key = size.join(',');
  if (!geometries.has(key)) geometries.set(key, new RoundedBoxGeometry(...size, 2, .06));
  const mesh = new THREE.Mesh(geometries.get(key)!, material(color)); mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function cable(parent: THREE.Object3D, points: [number,number,number][], color = COLORS.mint): void {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, .035, 6, false), material(color)); parent.add(mesh);
}
function screen(parent: THREE.Object3D, src: string, width: number, pos: [number,number,number], rotY = 0): THREE.Group {
  const original = image(src) as HTMLImageElement;
  const height = width * ((original.naturalHeight || 9) / (original.naturalWidth || 16));
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(...pos);
  monitorGroup.rotation.y = rotY;
  parent.add(monitorGroup);

  const body = box(monitorGroup, [width + .16, height + .16, .16], [0, 0, 0], COLORS.dark);
  const texture = new THREE.Texture(original); texture.needsUpdate = true; texture.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  face.position.z = .09;
  body.add(face);

  // monitor stand and foot so entire monitor turns together
  box(monitorGroup, [.14, height * .45, .14], [0, -height * .45, -.05], COLORS.white);
  box(monitorGroup, [width * .45, .06, width * .28], [0, -height * .65, 0], COLORS.dark);
  return monitorGroup;
}
export class StoryWorld {
  private readonly architecture = new THREE.Group();
  private readonly packet: THREE.Mesh;
  private readonly packetStart = new THREE.Vector3(5.2, 1.2, -2.6);
  private readonly packetEnd = new THREE.Vector3(-1.2, 1.2, -1.8);
  private readonly parcel: THREE.Mesh;
  private readonly gates: THREE.Mesh[] = [];
  private readonly alert: THREE.Mesh;
  private readonly alertPath: THREE.CatmullRomCurve3;
  private readonly workshopMobile: THREE.Group;
  constructor(scene: THREE.Scene, private readonly anchors: Record<string, THREE.Vector3>, private readonly invalidateShadows: () => void = () => {}) {
    const root = new THREE.Group(); scene.add(root);
    for (const id of ['02','04','05','06'] as PlaceId[]) {
      const [x,z] = CENTERS[id]; anchors[`guideSpot${id}`] = new THREE.Vector3(x-6.5,.34,z+3.2);
    }
    // The workshop: two actual interfaces, a workbench, API and storage connected by cables.
    const workshop = new THREE.Group(); workshop.position.set(-12,.34,19); root.add(workshop);
    box(workshop,[7,.25,3.2],[-1,1.35,-2.4],COLORS.white);
    for (const x of [-3.8,1.8]) box(workshop,[.18,1.3,.18],[x,.65,-2.4],COLORS.dark);
    screen(workshop,'assets/deck/v6-sup-piliers.jpg',3.1,[-2,2.9,-2.5],0);
    this.workshopMobile = screen(workshop,'assets/deck/v3-mob-evaluation.jpg',.95,[1,2.85,-2.2],-.2);
    const api = box(workshop,[1.4,1.6,1.4],[-4.8,.8,1.3],COLORS.green);
    box(workshop,[1.4,1.6,1.4],[.5,.8,3.4],COLORS.blue);
    cable(workshop,[[-4.8,.25,1.3],[-4.8,.25,-2],[-2,.25,-2]]);
    cable(workshop,[[-4.8,.25,1.3],[-2,.25,3.4],[.5,.25,3.4]]);
    api.userData['role']='API';

    // Architecture in volume: inclined presentation board facing spectator with depth
    this.architecture.name = 'architecture-board';
    this.architecture.position.set(5, 3.1, -9.5); root.add(this.architecture);
    this.architecture.rotation.x = .55;
    box(this.architecture, [15, .32, 9], [0, 0, 0], COLORS.white);
    box(this.architecture, [15.2, .08, 9.2], [0, -.06, 0], COLORS.green);

    // 9 functional component modules
    const points: [number,number,number][] = [
      [-6.2, 0.6, 2.6],   // 0: Utilisateurs
      [-3.8, 0.6, 2.6],   // 1: Ingress NGINX
      [-1.2, 0.6, 1.6],   // 2: Frontend client · admin
      [-1.2, 0.6, -1.8],  // 3: API Spring Boot
      [1.8, 0.6, 0.2],    // 4: Service IA
      [1.8, 0.6, -2.6],   // 5: PostgreSQL + volume
      [5.2, 0.6, -2.6],   // 6: GitHub
      [5.2, 0.6, 0.2],    // 7: ArgoCD
      [5.2, 0.6, 2.6]     // 8: ACR
    ];
    points.forEach((p, i) => {
      const b = box(this.architecture, [1.3, 0.85, 1.2], p, i === 0 ? COLORS.green : i < 4 ? COLORS.blue : COLORS.dark);
      box(b, [1.1, 0.08, 0.25], [0, 0.44, 0.4], i === 0 ? COLORS.mint : COLORS.orange);
      this.architecture.updateMatrixWorld(true);
      anchors[`nodeTag${i}`] = b.localToWorld(new THREE.Vector3(0, 1.4, 0));
    });
    [[0,1],[1,2],[1,3],[3,4],[3,5],[6,7],[7,3],[8,3]].forEach(([a,b]) => cable(this.architecture, [points[a!]!, points[b!]!]));
    this.packet = box(this.architecture, [.35, .35, .35], [0, 0, 0], COLORS.mint);
    this.packetStart.set(points[6]![0], points[6]![1] + 0.6, points[6]![2]);

    // Delivery: one version travels through visible gates; the same parcel stops on failed control states.
    const line = new THREE.Group(); line.position.set(24, .34, 12); root.add(line);
    this.parcel = box(line, [.82, .7, .82], [-5.8, 1.45, 0], COLORS.green);
    box(this.parcel, [.6, .08, .6], [0, .36, 0], COLORS.mint);

    for (let i = 0; i < 3; i++) {
      const gate = box(line, [.28, 2.5, 2.8], [-4 + i * 4, 1.6, 0], COLORS.mint);
      box(gate, [.36, .28, .6], [0, 1.15, 0], COLORS.white);
      this.gates.push(gate);
      anchors[`gateTag${i}`] = new THREE.Vector3(20 + i * 4, 4.4, 12);
    }

    // Supervision room: actual metric and journal screenshots, and an alert route to notification.
    const room = new THREE.Group(); room.position.set(37, .34, -17); root.add(room);
    box(room, [11, .35, 7], [0, .1, 0], COLORS.white);
    box(room, [11, 4.2, .35], [0, 2.1, -3.4], COLORS.dark);
    screen(room, 'assets/deck/v7-grafana-cpu.jpg', 4.2, [-2.5, 2.5, -3.15], 0);
    screen(room, 'assets/deck/v3-grafana-journaux.jpg', 4.2, [2.5, 2.5, -3.15], 0);
    box(room, [7, .35, 1.6], [0, 1.4, 1.8], COLORS.dark);
    for (const x of [-2.8, 2.8]) box(room, [.22, 1.4, .22], [x, .7, 1.8], COLORS.white);
    screen(room, 'assets/deck/v3-gmail-rows.jpg', 1.9, [3.8, 1.9, 1.7], -.4);
    this.alert = box(room, [.3, .3, .3], [-2.5, 2.5, -3], COLORS.orange);
    this.alertPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-2.5, 2.5, -3), new THREE.Vector3(0, 3.7, -.5), new THREE.Vector3(3.8, 1.7, 1.9)]);
    cable(room, [[-2.5, 2.5, -3], [0, 3.7, -.5], [3.8, 1.7, 1.9]], COLORS.orange);

    // Belvedere and a projection screen for the local film.
    const theater = new THREE.Group(); theater.position.set(52, .34, 2); root.add(theater);
    box(theater, [9, 5.2, .2], [0, 3.2, -3], COLORS.dark);
    box(theater, [8.5, 4.7, .04], [0, 3.2, -2.88], COLORS.white);
    for (const x of [-4.1, 4.1]) box(theater, [.2, 3, .2], [x, 1.5, -3], COLORS.white);
    for (const x of [-2.2, 0, 2.2]) box(theater, [1.4, .55, 1], [x, .6, 3.7], COLORS.green);
  }
  frame(state: StoryState, progress: number, from: StoryState = state): void {
    const seq = state.source.seq, step = state.source.step;
    const showArchitecture = seq === 'architecture';
    const visibilityChanged = this.architecture.visible !== showArchitecture;
    this.architecture.visible = showArchitecture;
    const cycle = sceneProps.get('devsecops-cycle');
    if (cycle) cycle.visible = !showArchitecture;
    // These alternative props share one location. Refresh the cached shadow map only on replacement,
    // otherwise the hidden cycle leaves its stage/shield shadows on the architecture board.
    if (visibilityChanged) this.invalidateShadows();
    if (showArchitecture) {
      this.packetEnd.set(step ? -1.2 : -3.8, 1.2, step ? -1.8 : 2.6);
      this.packet.position.copy(this.packetStart).lerp(this.packetEnd, progress);
      this.packet.visible = false;
    }
    const hidePhone = seq === 'parcours-app' && (step === 0 || step === 2);
    if (this.workshopMobile) this.workshopMobile.visible = !hidePhone;
    const atelierPhone = sceneProps.get('atelier-phone');
    if (atelierPhone) atelierPhone.visible = !hidePhone;
    const { blocked, visible, x } = deliveryFrame(state, from, progress);
    this.parcel.visible = visible;
    this.parcel.position.x = x;
    this.parcel.material = material(blocked ? COLORS.red : COLORS.green);
    this.gates.forEach((g, i) => {
      g.material = material(blocked && i === 1 ? COLORS.red : COLORS.mint);
    });
    this.alert.visible = seq === 'alerte';
    if (this.alert.visible) {
      // Detection flows to notification for FIRING and RESOLVED, then rests while the proof is read.
      this.alert.position.copy(this.alertPath.getPoint(step === 2 ? 1 : progress));
      this.alert.material = material(step === 0 ? COLORS.orange : COLORS.green);
    }
  }
}
