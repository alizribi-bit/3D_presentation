import * as THREE from 'three';
const textures = new WeakMap<HTMLImageElement, THREE.Texture>();
/** Place the logo on the asset's actual sloped display, preserving its frame and stand.
 * The Kenney display normal points toward -Z; the complete monitor must turn to face our +Z cameras. */
export function decorateMonitorScreen(monitor: THREE.Object3D, image: HTMLImageElement): void {
  let display: THREE.Mesh | undefined;
  monitor.traverse(object => {
    if (!(object instanceof THREE.Mesh) || Array.isArray(object.material)
        || object.material.name !== 'metal' || object.geometry.getAttribute('position')?.count !== 4) return;
    object.material = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    object.userData['keep'] = true;
    display ??= object;
  });
  if (!display) throw new Error('Decorative monitor display is missing from the local asset.');
  display.geometry.computeBoundingBox();
  const bounds = display.geometry.boundingBox!;
  const size = bounds.getSize(new THREE.Vector3());
  const normal = new THREE.Vector3().fromBufferAttribute(display.geometry.getAttribute('normal'), 0).normalize();
  const up = new THREE.Vector3(0, 1, 0).projectOnPlane(normal).normalize();
  const right = up.clone().cross(normal).normalize();
  const aspect = image.naturalWidth / image.naturalHeight;
  const width = Math.min(size.x * .84, Math.hypot(size.y, size.z) * .72 * aspect);
  let texture = textures.get(image);
  if (!texture) {
    texture = new THREE.Texture(image); texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true;
    textures.set(image, texture);
  }
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(width, width / aspect),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }));
  logo.name = 'zawedni-monitor-logo'; logo.userData['keep'] = true;
  logo.position.copy(bounds.getCenter(new THREE.Vector3())).addScaledVector(normal, .001);
  logo.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, normal));
  display.add(logo);
  if (normal.z < 0) monitor.rotateY(Math.PI);
  monitor.name = 'decorative-monitor';
}
