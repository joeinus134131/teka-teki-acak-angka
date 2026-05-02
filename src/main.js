import './style.css';
import { renderLanding } from './ui/landing.js';
import { renderGame } from './ui/game.js';
import { renderCreator } from './ui/creator.js';

const state = {
  view: 'landing', // landing, game, creator
  puzzleData: null,
};

function router() {
  const hash = window.location.hash || '#landing';
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (hash.startsWith('#play')) {
    const params = new URLSearchParams(hash.split('?')[1]);
    const data = params.get('data');
    if (data) {
      try {
        state.puzzleData = JSON.parse(atob(data));
      } catch (e) {
        console.error('Invalid puzzle data', e);
        window.location.hash = '#landing';
        return;
      }
    } else {
      state.puzzleData = null; // Use default
    }
    renderGame(app, state.puzzleData);
  } else if (hash.startsWith('#create')) {
    renderCreator(app);
  } else {
    renderLanding(app);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  setTimeout(router, 500); // Small delay for effect
});
