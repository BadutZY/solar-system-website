# Voyager — Explore The Solar System

Immersive storytelling experience Tata Surya. React + Vite, React Three Fiber,
Framer Motion — kamera sinematik tunggal yang terbang melalui satu ruang 3D
berkesinambungan saat Anda scroll (animasi aslinya dipertahankan), dengan
tekstur planet asli.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Build produksi: `npm run build && npm run preview`.

## Perbaikan di revisi ini

- **Animasi scroll dikembalikan seperti semula**: satu kamera sinematik
  (`HomeCanvas` + `CameraRig`) terbang menyusuri seluruh 14 objek dalam satu
  ruang 3D yang sama saat discroll — bukan lagi kanvas terpisah per section.
- **Panel deskripsi sekarang punya posisi tetap & konsisten.** Setiap section
  memakai anchor yang sama persis: `top: 12vh`, lebar dibatasi `min(460px,
  42vw)`, tinggi dibatasi dengan scroll internal untuk konten panjang. Tidak
  lagi "kadang di atas, kadang di bawah" — posisinya identik di semua 14
  section (`src/pages/Home/home.css`, class `.vg-planet-panel`).
- **Planet tidak lagi ketutupan panel.** Panel hanya menempati ±42% lebar
  layar (kiri untuk planet bernomor genap, kanan untuk yang ganjil), dan
  kamera (`CameraRig` di `HomeCanvas.jsx`) sengaja membidik sedikit ke sisi
  yang ditempati panel — efeknya planet otomatis tergeser ke sisi kosong
  yang terbuka, bukan lagi persis di tengah.
- **Header dihapus**, diganti navigasi mengambang murni (`FloatingNav`):
  logo kecil pojok kiri atas + satu tombol bundar pojok kanan atas yang
  membuka overlay menu saat diklik. Tidak ada bar penuh lagi.
- **Aset planet diperbarui**: semua planet, Matahari, dan Pluto memakai peta
  tekstur asli (bukan shader prosedural) — lihat bagian "Tentang tekstur" di
  bawah.

## Struktur

```
src/
  components/
    FloatingNav/        → brand + tombol bundar + overlay menu
    3D/
      HomeCanvas.jsx     → kamera sinematik tunggal + jalur seluruh 14 objek
      TexturedPlanet.jsx → mesh planet dengan tekstur/bump/cloud/ring asli
      BeltParticles.jsx  → representasi partikel utk sabuk/awan (bukan planet)
      CosmicBackground.jsx → starfield, dust, shooting stars, fog
    Loader/, AudioToggle/
  data/planets.js   → data + path tekstur CDN untuk 14 objek (Matahari → Awan Oort)
  pages/
    Home/
      Home.jsx           → hero + scroll-snap + tracking progres kamera
      PlanetSection.jsx  → panel teks anchor-tetap, sisi kiri/kanan bergantian
    SolarSystem/  → mode eksplorasi bebas, tekstur asli, klik untuk detail
    Gallery/, About/
```

## Tentang tekstur

Tekstur (`sunmap.jpg`, `earthmap1k.jpg`, `saturnringcolor.jpg`, dst.) dimuat
langsung dari CDN publik saat runtime (`TEX` constant di
`src/data/planets.js`, mengarah ke jsdelivr mirror dari
`jeromeetienne/threex.planets` — sumber yang sama dipakai situs referensi
Anda) — bukan file yang disertakan dalam proyek ini. Untuk hosting sendiri:
unduh set gambar yang sama dari
`https://github.com/jeromeetienne/threex.planets/tree/master/images`, taruh
di `public/textures/`, dan ganti `TEX` menjadi `'/textures'`.

Galeri masih memakai ubin gradien prosedural (belum foto asli) dan audio
ambience masih disintesis lewat Web Audio API — instruksi menggantinya ada
di komentar `src/hooks/useAmbientAudio.js` dan `src/pages/Gallery/Gallery.jsx`.
