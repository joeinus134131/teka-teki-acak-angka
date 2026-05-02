const DICTIONARY = [
  'PLANET', 'GALAXY', 'SPACE', 'ASTRONAUT', 'NEBULA', 'STAR', 'METEOR', 'COMET',
  'ROBOT', 'CYBER', 'TECH', 'FUTURE', 'CODING', 'LOGIC', 'SYSTEM', 'DATA',
  'COFFEE', 'PIZZA', 'SUSHI', 'BURGER', 'TACO', 'PASTA', 'RAMEN', 'FRUIT',
  'OCEAN', 'FOREST', 'MOUNTAIN', 'DESERT', 'JUNGLE', 'ISLAND', 'RIVER', 'VALLEY',
  'VIBRANT', 'DYNAMIC', 'STREAM', 'ANIME', 'GAMER', 'LEGEND', 'MYSTIC', 'QUANTUM'
];

export class WordSearchEngine {
  constructor(size = 14, words = []) {
    this.size = size;
    this.words = words.map(w => w.toUpperCase().replace(/[^A-Z]/g, ''));
    this.grid = Array.from({ length: size }, () => Array(size).fill(''));
    this.placed = [];
    this.directions = [
      [0, 1],   // Right
      [1, 0],   // Down
      [1, 1],   // Diagonal Down Right
      [-1, 1],  // Diagonal Up Right
    ];
  }

  generate() {
    let attempts = 0;
    const sortedWords = [...this.words].sort((a, b) => b.length - a.length);

    while (attempts < 100) {
      this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(''));
      this.placed = [];
      let allPlaced = true;

      for (const word of sortedWords) {
        if (!this.placeWord(word)) {
          allPlaced = false;
          break;
        }
      }

      if (allPlaced) {
        this.fillRandom();
        return { grid: this.grid, placed: this.placed };
      }
      attempts++;
    }
    throw new Error('Failed to generate grid. Try reducing words or increasing size.');
  }

  placeWord(word) {
    const dirs = [...this.directions].sort(() => Math.random() - 0.5);
    
    // Try random positions
    for (let attempt = 0; attempt < 200; attempt++) {
      const r = Math.floor(Math.random() * this.size);
      const c = Math.floor(Math.random() * this.size);
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];

      if (this.canPlace(word, r, c, dr, dc)) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const row = r + i * dr;
          const col = c + i * dc;
          this.grid[row][col] = word[i];
          cells.push([row, col]);
        }
        this.placed.push({ word, cells });
        return true;
      }
    }
    return false;
  }

  canPlace(word, r, c, dr, dc) {
    const endR = r + (word.length - 1) * dr;
    const endC = c + (word.length - 1) * dc;

    if (endR < 0 || endR >= this.size || endC < 0 || endC >= this.size) return false;

    for (let i = 0; i < word.length; i++) {
      const row = r + i * dr;
      const col = c + i * dc;
      const char = this.grid[row][col];
      if (char !== '' && char !== word[i]) return false;
    }
    return true;
  }

  fillRandom() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === '') {
          this.grid[r][c] = chars[Math.floor(Math.random() * chars.length)];
        }
      }
    }
  }

  static getRandomWords(count = 8) {
    return [...DICTIONARY].sort(() => Math.random() - 0.5).slice(0, count);
  }

  static generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
