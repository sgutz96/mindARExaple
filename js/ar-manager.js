import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ARManager {
  constructor(container, config, onTargetChange) {
    this.container = container;
    this.config = config;
    this.onTargetChange = onTargetChange;
    this.loader = new GLTFLoader();
  }

  async init() {
    this.mindarThree = new MindARThree({
      container: this.container,
      imageTargetSrc: this.config.mindFile // puedes optimizar luego
    });

    const { scene } = this.mindarThree;

    // luces globales
    scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(0, 2, 2);
    scene.add(dir);

    this.anchors = [];

    this.config.targets.forEach((target, index) => {
      const anchor = this.mindarThree.addAnchor(index);
      this.loadModel(anchor, target);

      anchor.onTargetFound = () => {
        this.onTargetChange(target);
      };

      this.anchors.push(anchor);
    });
  }

  loadModel(anchor, target) {
    this.loader.load(target.model, (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(target.scale);
      anchor.group.add(model);
    });
  }

  async start() {
    await this.mindarThree.start();
    this.mindarThree.renderer.setAnimationLoop(() => {
      this.mindarThree.renderer.render(
        this.mindarThree.scene,
        this.mindarThree.camera
      );
    });
  }

  stop() {
    this.mindarThree.stop();
    this.mindarThree.renderer.setAnimationLoop(null);
  }
}