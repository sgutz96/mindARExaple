import * as THREE from 'three';
      import { MindARThree } from 'mindar-image-three';

      // 🧠 CONFIGURACIÓN DE TARGETS
      const CONFIG = [
        { color: 0xff0000 }, // target 0 → rojo
        { color: 0x0000ff }, // target 1 → azul
        // puedes seguir agregando más aquí
      ];

      const mindarThree = new MindARThree({
        container: document.querySelector("#container"),
        imageTargetSrc: "./target/targets_pru.mind", // 👈 usa tu archivo con varios targets
        maxTrack: CONFIG.length
      });

      console.log("📦 Archivo .mind cargado");

      const { renderer, scene, camera } = mindarThree;

      const cubes = [];

      // 🔁 crear lógica por cada target
      CONFIG.forEach((cfg, index) => {
        const anchor = mindarThree.addAnchor(index);

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.5, 0.5),
          new THREE.MeshStandardMaterial({ color: cfg.color })
        );

        cube.visible = false;
        anchor.group.add(cube);
        cubes.push(cube);

        // 🎯 eventos
        anchor.onTargetFound = () => {
          cube.visible = true;
          console.log(`Target ${index} detectado`);
        };

        anchor.onTargetLost = () => {
          cube.visible = false;
          console.log(`Target ${index} perdido`);
        };
      });

      // 💡 luces (necesarias para material estándar)
      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
      scene.add(light);

      // 🎬 START
      const start = async () => {
        await mindarThree.start();

        renderer.setAnimationLoop(() => {

          // animación
          cubes.forEach((cube) => {
            if (cube.visible) {
              cube.rotation.y += 0.02;
            }
          });

          renderer.render(scene, camera);
        });
      };

      // 🎮 botones
      const startButton = document.querySelector("#startButton");
      const stopButton = document.querySelector("#stopButton");

      startButton.addEventListener("click", start);

      stopButton.addEventListener("click", () => {
        mindarThree.stop();
        renderer.setAnimationLoop(null);
      });