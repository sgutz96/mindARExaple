export class UIManager {
  constructor() {
    this.tagContainer = document.querySelector(".hud-tags");
    this.title = document.querySelector(".hud-title");
  }

  updateUI(target) {
    // actualizar título
    this.title.innerHTML = `${target.name}<br><span>DETECTADO</span>`;

    // limpiar tags
    this.tagContainer.innerHTML = "";

    target.tags.forEach((tag, i) => {
      const el = document.createElement("div");
      el.classList.add("tag");
      if (i === 0) el.classList.add("active");
      el.textContent = tag;
      this.tagContainer.appendChild(el);
    });

    document.getElementById("hud").classList.add("visible");
  }
}