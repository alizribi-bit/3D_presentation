// Dynamic story props are kept separate from the baked static scenery. Each frame is a pure state evaluation.
import * as THREE from 'three';
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
function screen(parent: THREE.Object3D, src: string, width: number, pos: [number,number,number]): THREE.Mesh {
  const original = image(src) as HTMLImageElement;
  const height = width * original.naturalHeight / original.naturalWidth;
  const body = box(parent,[width+.16,height+.16,.18],pos,COLORS.dark);
  const texture = new THREE.Texture(original); texture.needsUpdate = true; texture.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(width,height), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })); face.position.z=.1; body.add(face); return body;
}
export class StoryWorld {
  private readonly architecture = new THREE.Group();
  private readonly packet: THREE.Mesh;
  private readonly packetStart = new THREE.Vector3(-5,1.85,2.5);
  private readonly packetEnd = new THREE.Vector3();
  private readonly parcel: THREE.Mesh;
  private readonly gates: THREE.Mesh[] = [];
  private readonly alert: THREE.Mesh;
  private readonly alertPath: THREE.CatmullRomCurve3;
  constructor(scene: THREE.Scene, anchors: Record<string, THREE.Vector3>) {
    const root = new THREE.Group(); scene.add(root);
    for (const id of ['02','04','05','06'] as PlaceId[]) {
      const [x,z] = CENTERS[id]; anchors[`guideSpot${id}`] = new THREE.Vector3(x-6.5,.34,z+3.2);
    }
    // The workshop: two actual interfaces, a workbench, API and storage connected by cables.
    const workshop = new THREE.Group(); workshop.position.set(-12,.34,19); root.add(workshop);
    box(workshop,[7,.25,3.2],[-1,1.35,-2.4],COLORS.white);
    for (const x of [-3.8,1.8]) box(workshop,[.18,1.3,.18],[x,.65,-2.4],COLORS.dark);
    screen(workshop,'assets/deck/v6-sup-piliers.jpg',3.1,[-2,2.9,-2.5]);
    screen(workshop,'assets/deck/v3-mob-evaluation.jpg',.95,[1,2.85,-2.2]);
    const api = box(workshop,[1.4,1.6,1.4],[-4.8,.8,1.3],COLORS.green);
    box(workshop,[1.4,1.6,1.4],[.5,.8,3.4],COLORS.blue);
    cable(workshop,[[-4.8,.25,1.3],[-4.8,.25,-2],[-2,.25,-2]]);
    cable(workshop,[[-4.8,.25,1.3],[-2,.25,3.4],[.5,.25,3.4]]);
    api.userData['role']='API';
    // Architecture in volume: edge, web/API, internal data/AI, GitOps and registry zones.
    this.architecture.position.set(5,1,-9.5); root.add(this.architecture);
    box(this.architecture,[14,.28,8],[0,0,-.5],COLORS.white);
    const points: [number,number,number][]=[[-6,1,3],[-3.6,1,3],[-1,1,1.5],[-1,1,-1.5],[2,1,0],[2,1,-3],[5,1,-3],[5,1,0],[5,1,3]];
    points.forEach((p,i)=>{box(this.architecture,[1.1,1.6,1.1],p,i===0?COLORS.green:i<4?COLORS.blue:COLORS.dark);anchors[`nodeTag${i}`]=new THREE.Vector3(p[0]+5,p[1]+2.2,p[2]-9.5);});
    [[0,1],[1,2],[1,3],[3,4],[3,5],[6,7],[7,3],[8,3]].forEach(([a,b])=>cable(this.architecture,[points[a!]!,points[b!]!]));
    this.packet=box(this.architecture,[.35,.35,.35],[0,0,0],COLORS.mint);
    // Delivery: one version travels through visible gates; the same parcel stops on failed control states.
    const line = new THREE.Group(); line.position.set(24,.34,12); root.add(line);
    this.parcel=box(line,[.75,.65,.75],[-5.8,1.43,0],COLORS.green);
    for(let i=0;i<3;i++) {this.gates.push(box(line,[.25,2.4,2.65],[-4+i*4,1.6,0],COLORS.mint));anchors[`gateTag${i}`]=new THREE.Vector3(20+i*4,4.4,12);}
    // Supervision room: actual metric and journal screenshots, and an alert route to notification.
    const room = new THREE.Group(); room.position.set(37,.34,-17); root.add(room);
    box(room,[11,.35,7],[0,.1,0],COLORS.white);
    box(room,[11,4.2,.35],[0,2.1,-3.4],COLORS.dark);
    screen(room,'assets/deck/v7-grafana-cpu.jpg',4.2,[-2.5,2.5,-3.15]);
    screen(room,'assets/deck/v3-grafana-journaux.jpg',4.2,[2.5,2.5,-3.15]);
    box(room,[7,.35,1.6],[0,1.4,1.8],COLORS.dark);
    for(const x of [-2.8,2.8]) box(room,[.22,1.4,.22],[x,.7,1.8],COLORS.white);
    screen(room,'assets/deck/v3-gmail-rows.jpg',1.9,[3.8,1.7,1.7]);
    this.alert=box(room,[.3,.3,.3],[-2.5,2.5,-3],COLORS.orange);
    this.alertPath=new THREE.CatmullRomCurve3([new THREE.Vector3(-2.5,2.5,-3),new THREE.Vector3(0,3.7,-.5),new THREE.Vector3(3.8,1.7,1.9)]);
    cable(room,[[-2.5,2.5,-3],[0,3.7,-.5],[3.8,1.7,1.9]],COLORS.orange);
    // Belvedere and a projection screen for the local film.
    const theater = new THREE.Group(); theater.position.set(52,.34,2); root.add(theater);
    box(theater,[9,5.2,.2],[0,3.2,-3],COLORS.dark);
    box(theater,[8.5,4.7,.04],[0,3.2,-2.88],COLORS.white);
    for(const x of [-4.1,4.1]) box(theater,[.2,3,.2],[x,1.5,-3],COLORS.white);
    for(const x of [-2.2,0,2.2]) box(theater,[1.4,.55,1],[x,.6,3.7],COLORS.green);
  }
  frame(state: StoryState, progress: number, from: StoryState = state): void {
    const seq = state.source.seq, step = state.source.step;
    const showArchitecture = ['architecture','routage','isolation','secrets'].includes(seq);
    this.architecture.visible=showArchitecture;
    if(showArchitecture) {
      this.packetEnd.set(step?3:0,1.85,step?-1.8:1.6);
      this.packet.position.copy(this.packetStart).lerp(this.packetEnd,progress); this.packet.visible=seq==='routage';
    }
    const { blocked, visible, x } = deliveryFrame(state, from, progress);
    this.parcel.visible=visible; this.parcel.position.x=x;
    this.parcel.material=material(blocked?COLORS.red:COLORS.green);
    this.gates.forEach((g,i)=>{g.material=material(blocked&&i===1?COLORS.red:COLORS.mint);});
    this.alert.visible=seq==='alerte';
    if(this.alert.visible) { this.alert.position.copy(this.alertPath.getPoint(step===0?0:step===1?progress:1)); this.alert.material=material(step===2?COLORS.green:COLORS.orange); }
  }
}
