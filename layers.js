// layers.js: レイヤーの追加、表示切替、結合などの管理
export class LayerManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.layers = [
      { id: 1, name: 'レイヤー 1', visible: true, opacity: 1.0 }
    ];
    this.render();
  }

  addLayer() {
    const newId = this.layers.length + 1;
    this.layers.push({ id: newId, name: `レイヤー ${newId}`, visible: true, opacity: 1.0 });
    this.render();
  }

  removeLayer(id) {
    if (this.layers.length > 1) {
      this.layers = this.layers.filter(l => l.id !== id);
      this.render();
    }
  }

  toggleVisibility(id) {
    const layer = this.layers.find(l => l.id === id);
    if (layer) {
      layer.visible = !layer.visible;
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="background:#222; color:#fff; padding:10px; border-radius:8px; width:180px; font-size:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <strong>レイヤー</strong>
          <button id="add-layer-btn" style="cursor:pointer;">＋</button>
        </div>
        <div id="layer-list">
          ${this.layers.slice().reverse().map(l => `
            <div style="display:flex; align-items:center; justify-content:space-between; background:#333; padding:5px; margin-bottom:4px; border-radius:4px;">
              <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                <input type="checkbox" ${l.visible ? 'checked' : ''} onchange="window.toggleLayer(${l.id})">
                <span style="color:${l.visible ? '#fff' : '#777'}">${l.name}</span>
              </label>
              <button onclick="window.removeLayer(${l.id})" style="background:none; border:none; color:#f55; cursor:pointer;">×</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('add-layer-btn').onclick = () => this.addLayer();
  }
}
