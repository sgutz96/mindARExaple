import { AR_CONFIG } from "./config.js";
import { ARManager } from "./ar-manager.js";
import { UIManager } from "./ui-manager.js";

const container = document.querySelector("#container");

const ui = new UIManager();

const ar = new ARManager(container, AR_CONFIG, (target) => {
  ui.updateUI(target);
});

await ar.init();

document.getElementById("startButton").addEventListener("click", () => {
  ar.start();
});