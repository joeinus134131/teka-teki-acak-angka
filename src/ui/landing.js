import { WordSearchEngine } from '../engine.js';
import { Storage } from '../utils/storage.js';

export function renderLanding(container) {
  const myRooms = Storage.getMyRooms();
  
  const randomWords = WordSearchEngine.getRandomWords(8);
  const quickPlayData = btoa(JSON.stringify({
    title: 'DAILY CHALLENGE',
    size: 14,
    words: randomWords,
    id: WordSearchEngine.generateRoomId(),
    mode: 'public'
  }));

  container.innerHTML = `
    <div class="container hero">
      <div class="glass-panel" style="padding: 60px; max-width: 800px;">
        <div style="margin-bottom: 20px; font-family: 'Share Tech Mono'; color: var(--accent); letter-spacing: 5px;"></div>
        <h1>WORD<span style="color: var(--accent2)">QUEST</span></h1>
        <p>Platform teka-teki acak kata tercanggih. Cari kata-kata tersembunyi, buat tantanganmu sendiri, dan bagikan petualanganmu dengan dunia.</p>
        
        <div style="display: flex; gap: 16px; margin-top: 40px; justify-content: center; flex-wrap: wrap;">
          <a href="#play?data=${quickPlayData}" class="btn btn-primary" style="padding: 16px 40px; font-size: 18px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            MAIN SEKARANG
          </a>
          <a href="#create" class="btn btn-outline" style="padding: 16px 40px; font-size: 18px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
            BUAT ROOM
          </a>
        </div>
      </div>

      <div class="features" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; width: 100%; margin-top: 60px;">
        <div class="glass-panel" style="text-align: left;">
          <h3 style="color: var(--accent); margin-bottom: 12px;">Multi Theme</h3>
          <p style="font-size: 14px;">Pilih dari berbagai tema futuristik mulai dari Cyberpunk hingga Kawaii.</p>
        </div>
        <div class="glass-panel" style="text-align: left;">
          <h3 style="color: var(--accent2); margin-bottom: 12px;">Custom Wordlist</h3>
          <p style="font-size: 14px;">Import kata-kata favoritmu atau gunakan bank kata yang sudah disediakan.</p>
        </div>
        <div class="glass-panel" style="text-align: left;">
          <h3 style="color: var(--accent3); margin-bottom: 12px;">Share & Play</h3>
          <p style="font-size: 14px;">Dapatkan link unik untuk setiap room yang kamu buat dan mainkan bersama teman.</p>
        </div>
      </div>

      <div class="rooms-section" style="width: 100%; margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
        <!-- My Rooms -->
        <div class="glass-panel">
          <h2 style="font-size: 18px; color: var(--accent2); margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">MY ROOMS (LOCAL)</h2>
          <div id="my-rooms-list" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
            ${myRooms.length === 0 ? 
              '<p style="color: var(--dim); text-align: center; padding: 20px;">Belum ada room yang dibuat.</p>' :
              myRooms.map(room => {
                const data = btoa(JSON.stringify(room));
                return `
                  <div class="room-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-family: var(--font-header); font-size: 14px;">${room.title}</div>
                      <div style="font-size: 10px; color: var(--dim);">${room.id} • ${room.words.length} KATA • ${room.mode.toUpperCase()}</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <a href="#play?data=${data}" class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">MAIN</a>
                      <button class="btn-delete btn btn-outline" data-id="${room.id}" style="padding: 4px 8px; font-size: 12px; border-color: var(--accent3); color: var(--accent3);">🗑</button>
                    </div>
                  </div>
                `;
              }).join('')
            }
          </div>
        </div>

        <!-- Public Gallery (Mock for now) -->
        <div class="glass-panel">
          <h2 style="font-size: 18px; color: var(--accent); margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">EXPLORE PUBLIC ROOMS</h2>
          <div id="public-rooms-list" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
            <div class="room-card" style="background: rgba(0, 212, 255, 0.05); border: 1px solid var(--accent); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-family: var(--font-header); font-size: 14px; color: var(--accent);">GALAXY EXPLORER</div>
                <div style="font-size: 10px; color: var(--accent);">OFFICIAL • 12 KATA • PUBLIC</div>
              </div>
              <button class="btn btn-primary" style="padding: 4px 12px; font-size: 12px; color: #000;">FEATURED</button>
            </div>
            <p style="color: var(--dim); text-align: center; padding: 20px; font-size: 12px;">Sinkronisasi dengan server publik sedang dikembangkan...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Handle Deletion
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      Storage.deleteRoom(id);
      renderLanding(container); // Re-render
    };
  });
}
