# WordQuest — Teka Teki Acak Kata

[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/joeinus134131/teka-teki-acak-angka?style=flat-square&color=4ade80)](https://github.com/joeinus134131/teka-teki-acak-angka/commits/main)
[![GitHub last commit](https://img.shields.io/github/last-commit/joeinus134131/teka-teki-acak-angka?style=flat-square&color=60a5fa)](https://github.com/joeinus134131/teka-teki-acak-angka/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/joeinus134131/teka-teki-acak-angka?style=flat-square&color=f472b6)](https://github.com/joeinus134131/teka-teki-acak-angka)
[![GitHub code size](https://img.shields.io/github/languages/code-size/joeinus134131/teka-teki-acak-angka?style=flat-square&color=fb923c)](https://github.com/joeinus134131/teka-teki-acak-angka)
[![GitHub top language](https://img.shields.io/github/languages/top/joeinus134131/teka-teki-acak-angka?style=flat-square&color=a78bfa)](https://github.com/joeinus134131/teka-teki-acak-angka)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

Platform teka-teki word search interaktif dengan tampilan futuristik. Buat puzzle kustom, bagikan lewat link unik, dan mainkan bersama siapa saja — tanpa akun, tanpa instalasi.

---

## Fitur Utama

- **Quick Play** — langsung main tanpa konfigurasi dengan kata-kata acak dari bank kata bawaan
- **Room Creator** — buat puzzle kustom dengan judul, kata, dan ukuran grid sendiri
- **Share via URL** — setiap room punya link unik berbasis Base64 yang bisa dibagikan ke siapa saja
- **QR Code Generator** — otomatis muncul setelah room dibuat, siap di-scan
- **Import Kata dari File** — upload file `.txt` berisi daftar kata, satu per baris atau dipisah koma
- **Sistem Petunjuk (Hint)** — sorot posisi kata di grid untuk pemain yang kesulitan
- **4 Tema Visual** — Cyberpunk, The Matrix, Synthwave, dan Kawaii
- **4 Pilihan Background** — Grid, Dots, Stars, dan Plain
- **4 Ukuran Grid** — 10×10 (Mudah), 14×14 (Normal), 18×18 (Sulit), 22×22 (Expert)
- **Deteksi Kata Multi-Arah** — horizontal, vertikal, dan diagonal

---

## Teknologi

| Layer | Stack |
|---|---|
| Frontend | Vanilla JavaScript (ES Modules) |
| Build Tool | Vite 5 |
| Font | Orbitron, Share Tech Mono, Fredoka One, Nunito (Google Fonts) |
| Deployment | Vercel |
| QR Code | qrserver.com API |

Tidak ada framework, tidak ada dependensi runtime — murni HTML, CSS, dan JavaScript modern.

---

## Struktur Proyek

```
acak-kata/
├── src/
│   ├── engine.js        # Word search engine: generate grid, place words, fill random
│   ├── main.js          # Router berbasis hash (#landing, #play, #create)
│   ├── style.css        # Semua styling, tema, dan animasi
│   ├── ui/
│   │   ├── landing.js   # Halaman utama
│   │   ├── game.js      # Logika dan tampilan papan permainan
│   │   └── creator.js   # Form pembuat room kustom
│   └── utils/
│       └── alert.js     # Komponen notifikasi
├── index.html
├── package.json
└── .gitignore
```

---

## Menjalankan Secara Lokal

```bash
# Install dependensi
npm install

# Jalankan dev server
npm run dev

# Build untuk produksi
npm run build
```

---

## Cara Kerja

1. Puzzle di-encode ke Base64 dan disematkan langsung ke URL hash (`#play?data=...`)
2. Saat URL dibuka, data di-decode dan grid di-regenerate di sisi klien
3. Tidak ada server, tidak ada database — semua state hidup di URL

Ini berarti setiap link puzzle bisa dibagikan, di-bookmark, dan dimainkan offline setelah halaman ter-load.

---

## Lisensi

MIT — bebas digunakan dan dimodifikasi.
