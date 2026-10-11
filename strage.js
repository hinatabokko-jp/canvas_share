// storage.js: ローカルストレージまたはFirebaseを活用した作品保存と履歴画面
export class StorageManager {
  constructor() {
    this.storageKey = 'canvas_share_history';
  }

  saveArtwork(dataUrl, title = '無題の作品') {
    const history = this.getHistory();
    const newEntry = {
      id: Date.now(),
      title: title,
      date: new Date().toLocaleString(),
      image: dataUrl
    };
    history.unshift(newEntry);
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  getHistory() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  renderHistoryModal(containerId, onClose) {
    const history = this.getHistory();
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:1000;">
        <div style="background:#1e1e1e; color:#fff; padding:20px; border-radius:10px; width:80%; max-height:80vh; overflow-y:auto;">
          <h2>保存した作品の履歴</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:15px; margin-top:15px;">
            ${history.map(item => `
              <div style="background:#2a2a2a; padding:10px; border-radius:6px; text-align:center;">
                <img src="${item.image}" style="width:100%; height:120px; object-fit:cover; border-radius:4px;">
                <p style="font-size:12px; margin:5px 0;">${item.date}</p>
              </div>
            `).join('')}
          </div>
          <button id="close-history" style="margin-top:20px; padding:8px 16px; background:#444; color:#fff; border:none; border-radius:4px; cursor:pointer;">閉じる</button>
        </div>
      </div>
    `;
    document.getElementById('close-history').onclick = onClose;
  }
}
