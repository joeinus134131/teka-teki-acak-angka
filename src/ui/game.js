import { WordSearchEngine } from '../engine.js';
import { notify } from '../utils/alert.js';

export function renderGame(container, customData = null) {
  const defaultWords = ['KPI', 'MAYORA', 'INDAH', 'JAYANTI', 'DUA', 'HIJAU', 'ENERGY', 'HEMAT', 'LISTRIK'];
  const words = customData?.words || defaultWords;
  const size = customData?.size || 14;
  const title = customData?.title || 'TEKA-TEKI ACAK';
  const roomId = customData?.id || 'LOCAL-01';
  const mode = customData?.mode || 'public';

  container.innerHTML = `
    <div class="container">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="font-family: 'Share Tech Mono'; color: var(--accent); font-size: 12px; letter-spacing: 3px;">MISSION_ID: ${roomId} [${mode.toUpperCase()}]</div>
          <h1 style="font-size: 24px;">${title}</h1>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <div id="game-timer" style="font-family: 'Share Tech Mono'; color: var(--accent2); font-size: 20px; background: rgba(0,255,157,0.1); padding: 4px 12px; border-radius: 4px; border: 1px solid var(--accent2); min-width: 100px; text-align: center;">00:00</div>
          <select id="bg-select" class="btn btn-outline" style="padding: 8px 12px;">
            <option value="grid">GRID BG</option>
            <option value="dots">DOTS BG</option>
            <option value="stars">STARS BG</option>
            <option value="default">PLAIN BG</option>
          </select>
          <select id="theme-select" class="btn btn-outline" style="padding: 8px 12px;">
            <option value="default">CYBERPUNK</option>
            <option value="matrix">THE MATRIX</option>
            <option value="synthwave">SYNTHWAVE</option>
            <option value="kawaii">KAWAII 🌸</option>
          </select>
          <a href="#landing" class="btn btn-outline">KEMBALI</a>
        </div>
      </header>

      <div class="game-layout">
        <div class="glass-panel board-container">
          <div id="grid"></div>
        </div>
        
        <div class="sidebar" style="display: flex; flex-direction: column; gap: 20px;">
          <div class="glass-panel">
            <h3 style="font-size: 14px; margin-bottom: 16px; color: var(--accent);">DAFTAR KATA</h3>
            <div id="word-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
          </div>
          
          <div class="glass-panel">
            <h3 style="font-size: 14px; margin-bottom: 16px; color: var(--accent2);">STATISTIK</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>DITEMUKAN:</span>
              <span id="stat-found" style="color: var(--accent2); font-weight: bold;">0</span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
              <div id="progress-bar" style="height: 100%; width: 0%; background: var(--accent2); transition: width 0.3s;"></div>
            </div>
          </div>

          <button id="btn-hint" class="btn btn-outline" style="width: 100%;">MINTA KISI-KISI</button>
          <button id="btn-share" class="btn btn-outline" style="width: 100%; border-color: var(--accent);">BAGIKAN GAME INI</button>
          <button id="btn-reset" class="btn btn-outline" style="width: 100%;">RESTART GAME</button>
        </div>
      </div>
    </div>

    <div id="win-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; align-items: center; justify-content: center; flex-direction: column; backdrop-filter: blur(12px); padding: 20px; overflow-y: auto;">
      <div id="podium-section" style="display: flex; align-items: flex-end; gap: 20px; margin-bottom: 40px;">
        <!-- Podium will be injected here -->
      </div>
      
      <h2 id="final-time-display" style="font-size: 24px; color: var(--accent2); margin-bottom: 8px;">TIME: 00:00</h2>
      
      <div id="leaderboard-table" class="glass-panel" style="width: 100%; max-width: 400px; padding: 16px; margin-bottom: 32px;">
        <h3 style="font-size: 14px; color: var(--accent); margin-bottom: 12px; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 8px;">TOP 10 RANKING</h3>
        <div id="leaderboard-rows" style="display: flex; flex-direction: column; gap: 8px;">
           <!-- Ranking rows -->
        </div>
      </div>

      <div style="display: flex; gap: 16px;">
        <button id="btn-play-again" class="btn btn-primary">MAIN LAGI</button>
        <a href="#landing" class="btn btn-outline">KE MENU UTAMA</a>
      </div>
    </div>
  `;

  // Game Logic
  let engine, gridData, foundWords = new Set();
  let selecting = false, startCell = null, selection = [];
  let startTime = null, timerInterval = null, isStarted = false;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startTimer = () => {
    if (isStarted) return;
    isStarted = true;
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      document.getElementById('game-timer').textContent = formatTime(elapsed);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    return Date.now() - startTime;
  };

  const init = () => {
    engine = new WordSearchEngine(size, words);
    try {
      gridData = engine.generate();
    } catch (e) {
      notify.error('Generation Failed', e.message).then(() => {
        window.location.hash = '#create';
      });
      return;
    }
    foundWords = new Set();
    renderGrid();
    renderWordList();
    updateStats();
  };

  const renderGrid = () => {
    const gridEl = document.getElementById('grid');
    gridEl.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
    gridEl.innerHTML = '';

    gridData.grid.forEach((row, r) => {
      row.forEach((char, c) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = char;
        
        cell.onmousedown = (e) => startSelection(r, c);
        cell.onmouseenter = (e) => updateSelection(r, c);
        gridEl.appendChild(cell);
      });
    });

    window.onmouseup = () => endSelection();
  };

  const renderWordList = () => {
    const listEl = document.getElementById('word-list');
    listEl.innerHTML = words.map(w => `
      <div class="word-item" data-word="${w.toUpperCase()}" style="display: flex; align-items: center; gap: 8px; opacity: 0.6; transition: all 0.3s;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--border);"></div>
        <span style="font-size: 14px; letter-spacing: 1px;">${w.toUpperCase()}</span>
      </div>
    `).join('');
  };

  const startSelection = (r, c) => {
    startTimer(); // Start timer on first interaction
    selecting = true;
    startCell = [r, c];
    updateSelection(r, c);
  };

  const updateSelection = (r, c) => {
    if (!selecting) return;
    const [sr, sc] = startCell;
    const dr = r - sr;
    const dc = c - sc;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return;

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    selection = [];
    for (let i = 0; i <= steps; i++) {
      selection.push([sr + i * stepR, sc + i * stepC]);
    }

    // Update UI
    document.querySelectorAll('.cell').forEach(el => el.classList.remove('selecting'));
    selection.forEach(([tr, tc]) => {
      const cell = document.querySelector(`.cell[data-r="${tr}"][data-c="${tc}"]`);
      if (cell) cell.classList.add('selecting');
    });
  };

  const endSelection = () => {
    if (!selecting) return;
    selecting = false;
    
    const selectedWord = selection.map(([r, c]) => gridData.grid[r][c]).join('');
    const reversedWord = [...selectedWord].reverse().join('');

    const matched = gridData.placed.find(p => p.word === selectedWord || p.word === reversedWord);

    if (matched && !foundWords.has(matched.word)) {
      foundWords.add(matched.word);
      selection.forEach(([r, c]) => {
        document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`).classList.add('found');
      });
      
      const wordItem = document.querySelector(`.word-item[data-word="${matched.word}"]`);
      if (wordItem) {
        wordItem.style.opacity = '1';
        wordItem.style.color = 'var(--found)';
        wordItem.querySelector('span').style.textDecoration = 'line-through';
      }
      
      updateStats();
      if (foundWords.size === words.length) {
        const finalMs = stopTimer();
        showWinScreen(finalMs);
      }
    }

    document.querySelectorAll('.cell').forEach(el => el.classList.remove('selecting'));
  };

  const updateStats = () => {
    document.getElementById('stat-found').textContent = foundWords.size;
    const progress = (foundWords.size / words.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
  };

  const showWinScreen = async (ms) => {
    const overlay = document.getElementById('win-overlay');
    const finalTimeDisplay = document.getElementById('final-time-display');
    const podiumEl = document.getElementById('podium-section');
    const rowsEl = document.getElementById('leaderboard-rows');

    finalTimeDisplay.textContent = `TIME: ${formatTime(ms)}`;
    overlay.style.display = 'flex';

    // Handle Leaderboard
    const username = await askUsername();
    const scores = saveScore(roomId, username, ms);
    renderLeaderboard(scores, podiumEl, rowsEl);
  };

  const askUsername = () => {
    return new Promise((resolve) => {
      notify.info('MISI SELESAI!', 'Masukkan namamu untuk masuk ke papan peringkat:');
      
      // Use Swal directly for input modal to ensure consistency
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          title: 'INPUT IDENTITAS',
          input: 'text',
          inputLabel: 'NAMA AGENT:',
          inputPlaceholder: 'Ketik namamu di sini...',
          background: 'var(--panel)',
          color: 'var(--text)',
          confirmButtonText: 'SUBMIT DATA',
          confirmButtonColor: 'var(--accent)',
          customClass: {
            popup: 'glass-panel',
            title: 'alert-title',
            input: 'swal-input-custom',
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
          allowOutsideClick: false,
          inputValidator: (value) => {
            if (!value) return 'Nama tidak boleh kosong!';
            if (value.length > 15) return 'Nama maksimal 15 karakter!';
          }
        }).then((result) => {
          resolve(result.value || 'ANONYMOUS');
        });
      });
    });
  };

  const saveScore = (rid, name, time) => {
    const key = `leaderboard_${rid}`;
    let scores = JSON.parse(localStorage.getItem(key) || '[]');
    scores.push({ name, time, date: Date.now() });
    scores.sort((a, b) => a.time - b.time);
    scores = scores.slice(0, 10); // Top 10
    localStorage.setItem(key, JSON.stringify(scores));
    return scores;
  };

  const renderLeaderboard = (scores, podiumEl, rowsEl) => {
    // Podium (Top 3)
    const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual effect
    podiumEl.innerHTML = podiumOrder.map(idx => {
      const score = scores[idx];
      
      const heights = [100, 140, 80];
      const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
      const labels = ['2ND', '1ST', '3RD'];
      const animations = ['slideUp 0.5s ease 0.2s backwards', 'slideUp 0.5s ease backwards', 'slideUp 0.5s ease 0.4s backwards'];

      if (!score) return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.3; animation: ${animations[idx]}">
          <div style="font-family: var(--font-header); font-size: 10px; color: #555;">EMPTY</div>
          <div style="width: 80px; height: ${heights[idx]}px; background: #222; border: 1px dashed #444; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center; color: #444; font-family: var(--font-header); font-weight: 900;">
            ${labels[idx]}
          </div>
        </div>
      `;

      return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; animation: ${animations[idx]}">
          <div style="font-family: var(--font-header); font-size: 12px; color: ${colors[idx]}; text-shadow: 0 0 10px ${colors[idx]}88;">${score.name}</div>
          <div style="width: 80px; height: ${heights[idx]}px; background: linear-gradient(to top, ${colors[idx]}44, ${colors[idx]}); border-radius: 8px 8px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; font-family: var(--font-header); font-weight: 900; box-shadow: 0 0 30px ${colors[idx]}44; border: 1px solid ${colors[idx]}">
            <span style="font-size: 24px;">${labels[idx][0]}</span>
            <span style="font-size: 10px; margin-top: -5px;">${labels[idx].substring(1)}</span>
          </div>
          <div style="font-size: 11px; color: var(--accent2); font-family: 'Share Tech Mono';">${formatTime(score.time)}</div>
        </div>
      `;
    }).join('');

    // Rows (Rest of Top 10)
    rowsEl.innerHTML = scores.map((s, i) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px; font-size: 12px; ${i < 3 ? 'border-left: 3px solid var(--accent);' : ''}">
        <span>#${i + 1} ${s.name}</span>
        <span style="color: var(--accent2);">${formatTime(s.time)}</span>
      </div>
    `).join('');
  };

  // Event Listeners
  document.getElementById('theme-select').onchange = (e) => {
    document.body.dataset.theme = e.target.value;
  };

  document.getElementById('bg-select').onchange = (e) => {
    document.body.dataset.bg = e.target.value;
  };

  document.getElementById('btn-reset').onclick = () => init();
  
  document.getElementById('btn-share').onclick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      notify.success('Link Tersalin', 'Link game berhasil disalin! Kirim ke teman untuk main bersama.');
    });
  };

  document.getElementById('btn-play-again').onclick = () => {
    document.getElementById('win-overlay').style.display = 'none';
    init();
  };

  document.getElementById('btn-hint').onclick = () => {
    const remaining = gridData.placed.filter(p => !foundWords.has(p.word));
    if (remaining.length > 0) {
      const target = remaining[Math.floor(Math.random() * remaining.length)];
      const [r, c] = target.cells[0];
      const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      cell.style.animation = 'spin 0.5s ease';
      cell.style.borderColor = 'var(--accent3)';
      setTimeout(() => {
        cell.style.animation = '';
        cell.style.borderColor = '';
      }, 2000);
    }
  };

  init();
}
