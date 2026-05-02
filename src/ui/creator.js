import { WordSearchEngine } from '../engine.js';
import { notify } from '../utils/alert.js';
import { Storage } from '../utils/storage.js';

export function renderCreator(container) {
  let words = [];
  let isGenerated = false;

  container.innerHTML = `
    <div class="container creator-container">
      <header>
        <div style="font-family: 'Share Tech Mono'; color: var(--accent); font-size: 12px; letter-spacing: 3px;">CREATOR_MODE</div>
        <h1>BUAT ROOM BARU</h1>
      </header>

      <div class="game-layout">
        <div class="glass-panel">
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; color: var(--dim);">JUDUL TEKA-TEKI</label>
            <input type="text" id="puzzle-title" placeholder="Contoh: Teka Teki Hewan" style="width: 100%;">
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; color: var(--dim);">UKURAN GRID</label>
            <select id="grid-size" style="width: 100%;">
              <option value="10">10x10 (Mudah)</option>
              <option value="14" selected>14x14 (Normal)</option>
              <option value="18">18x18 (Sulit)</option>
              <option value="22">22x22 (Expert)</option>
            </select>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; color: var(--dim);">MODE ROOM</label>
            <select id="room-mode" style="width: 100%;">
              <option value="public">PUBLIC (Bisa dilihat siapa saja)</option>
              <option value="private">PRIVATE (Hanya dengan link/kode)</option>
            </select>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; color: var(--dim);">TAMBAH KATA</label>
            <div class="word-input-group">
              <input type="text" id="word-input" placeholder="Ketik kata..." style="flex: 1;">
              <button id="btn-add-word" class="btn btn-primary">TAMBAH</button>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; color: var(--dim);">IMPORT DARI FILE (.txt)</label>
            <input type="file" id="file-import" accept=".txt" style="width: 100%; padding: 8px;">
          </div>

          <div style="display: flex; gap: 12px; margin-top: 32px;">
            <button id="btn-generate" class="btn btn-primary" style="flex: 1;">GENERATE & PLAY</button>
            <a href="#landing" class="btn btn-outline">BATAL</a>
          </div>
        </div>

        <div class="glass-panel">
          <div id="result-section" style="display: none; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px;">
             <h3 style="color: var(--accent2); margin-bottom: 16px;">ROOM GENERATED!</h3>
             <div style="display: flex; gap: 16px; align-items: flex-start;">
                <div id="qr-code" style="background: white; padding: 10px; border-radius: 8px; min-width: 120px; height: 120px; display: flex; align-items: center; justify-content: center;">
                  <!-- QR Code will be here -->
                </div>
                <div style="flex: 1;">
                   <div style="font-size: 12px; color: var(--dim);">ROOM ID:</div>
                   <div id="room-id-display" style="font-family: 'Orbitron'; font-size: 20px; color: var(--accent); margin-bottom: 8px;"></div>
                   <div id="share-section">
                      <div class="word-input-group">
                        <input type="text" id="share-url" readonly style="flex: 1; font-size: 12px;">
                        <button id="btn-copy" class="btn btn-outline" style="padding: 8px 12px;">COPY</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <h3 style="font-size: 14px; margin-bottom: 16px; color: var(--accent);">WORDS_LIST (<span id="word-count">0</span>)</h3>
          <div id="tags-container" style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 400px; overflow-y: auto; align-content: flex-start;">
            <div style="color: var(--dim); font-size: 14px; padding: 20px; text-align: center; width: 100%;">Belum ada kata ditambahkan.</div>
          </div>
      </div>
    </div>
  `;

  const input = document.getElementById('word-input');
  const addBtn = document.getElementById('btn-add-word');
  const tagsContainer = document.getElementById('tags-container');
  const countEl = document.getElementById('word-count');
  const generateBtn = document.getElementById('btn-generate');
  const fileImport = document.getElementById('file-import');

  const updateTags = () => {
    countEl.textContent = words.length;
    if (words.length === 0) {
      tagsContainer.innerHTML = '<div style="color: var(--dim); font-size: 14px; padding: 20px; text-align: center; width: 100%;">Belum ada kata ditambahkan.</div>';
      return;
    }

    tagsContainer.innerHTML = words.map((w, i) => `
      <div class="word-tag">
        ${w}
        <button data-index="${i}">&times;</button>
      </div>
    `).join('');

    tagsContainer.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        words.splice(btn.dataset.index, 1);
        isGenerated = false; // Reset state
        updateButtonState();
        updateTags();
      };
    });
  };

  const updateButtonState = () => {
    if (isGenerated) {
      generateBtn.textContent = 'ROOM READY ✓';
      generateBtn.classList.add('btn-outline');
      generateBtn.classList.remove('btn-primary');
      generateBtn.style.opacity = '0.7';
      generateBtn.disabled = true;
    } else {
      generateBtn.textContent = words.length > 0 ? 'UPDATE & GENERATE' : 'GENERATE & PLAY';
      generateBtn.classList.remove('btn-outline');
      generateBtn.classList.add('btn-primary');
      generateBtn.style.opacity = '1';
      generateBtn.disabled = false;
    }
  };

  const addWord = (w) => {
    const cleanWord = w.toUpperCase().trim().replace(/[^A-Z]/g, '');
    if (cleanWord && !words.includes(cleanWord)) {
      if (cleanWord.length > parseInt(document.getElementById('grid-size').value)) {
        notify.error('Oops!', `Kata "${cleanWord}" terlalu panjang untuk ukuran grid ini!`);
        return;
      }
      words.push(cleanWord);
      isGenerated = false; // Reset state
      updateButtonState();
      updateTags();
    }
  };

  addBtn.onclick = () => {
    addWord(input.value);
    input.value = '';
    input.focus();
  };

  input.onkeypress = (e) => {
    if (e.key === 'Enter') addBtn.onclick();
  };

  // Reset state on config changes
  ['puzzle-title', 'grid-size', 'room-mode'].forEach(id => {
    document.getElementById(id).onchange = () => {
      isGenerated = false;
      updateButtonState();
    };
  });
  
  document.getElementById('puzzle-title').oninput = () => {
    isGenerated = false;
    updateButtonState();
  };

  fileImport.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/);
      lines.forEach(line => {
        const parts = line.split(/[,;\s]+/);
        parts.forEach(p => addWord(p));
      });
    };
    reader.readAsText(file);
  };

  generateBtn.onclick = () => {
    if (words.length < 3) {
      notify.error('Kurang Kata', 'Tambahkan minimal 3 kata sebelum generate!');
      return;
    }

    const data = {
      title: document.getElementById('puzzle-title').value || 'TEKA-TEKI ACAK',
      size: parseInt(document.getElementById('grid-size').value),
      words: words,
      id: WordSearchEngine.generateRoomId(),
      mode: document.getElementById('room-mode').value
    };

    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}#play?data=${encoded}`;
    
    // Save to local history
    Storage.saveRoom(data);
    
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('room-id-display').textContent = data.id;
    document.getElementById('share-url').value = url;
    
    // Generate QR Code using a public API
    const qrEl = document.getElementById('qr-code');
    qrEl.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}" alt="QR Code">`;
    
    // Auto scroll to result
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
    
    isGenerated = true;
    updateButtonState();
  };

  document.getElementById('btn-copy').onclick = () => {
    const copyText = document.getElementById('share-url');
    copyText.select();
    document.execCommand('copy');
    notify.success('Berhasil!', 'Link room berhasil disalin ke clipboard.');
  };
}
