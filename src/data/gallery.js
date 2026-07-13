// Data untuk halaman Gallery.
// Setiap item merepresentasikan satu foto di public/gallery/.
// Untuk menambah foto baru: taruh file gambarnya di public/gallery/,
// lalu tambahkan satu object baru ke array galleryItems di bawah ini.

export const galleryItems = [
  {
    id: 'matahari',
    name: 'Matahari',
    subtitle: 'Bintang induk Tata Surya',
    category: 'Bintang',
    color: '#ffb545',
    image: '/gallery/matahari.jpg',
    description:
      'Matahari adalah bola plasma raksasa yang menyumbang lebih dari 99.8% massa Tata Surya. Cahayanya menjadi sumber energi utama bagi seluruh planet yang mengelilinginya.',
  },
  {
    id: 'merkurius',
    name: 'Merkurius',
    subtitle: 'Planet terdekat dengan Matahari',
    category: 'Planet',
    color: '#9b9b93',
    image: '/gallery/merkurius.jpg',
    description:
      'Merkurius adalah planet terkecil dan tercepat mengorbit Matahari. Permukaannya dipenuhi kawah akibat hantaman meteor, mirip dengan permukaan Bulan.',
  },
  {
    id: 'venus',
    name: 'Venus',
    subtitle: 'Planet terpanas di Tata Surya',
    category: 'Planet',
    color: '#e8c27a',
    image: '/gallery/venus.jpg',
    description:
      'Venus terselimuti awan tebal asam sulfat yang memerangkap panas lewat efek rumah kaca ekstrem, menjadikannya planet terpanas meski bukan yang terdekat dengan Matahari.',
  },
  {
    id: 'bumi',
    name: 'Bumi',
    subtitle: 'Rumah kita, planet biru',
    category: 'Planet',
    color: '#2a6bd6',
    image: '/gallery/bumi.jfif',
    description:
      'Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan. Sekitar 71% permukaannya tertutup air, dan atmosfernya melindungi kita dari radiasi berbahaya luar angkasa.',
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'Planet merah',
    category: 'Planet',
    color: '#c1440e',
    image: '/gallery/mars.jpg',
    description:
      'Mars dikenal sebagai planet merah karena oksida besi (karat) yang melapisi permukaannya. Planet ini menyimpan gunung berapi terbesar di Tata Surya, Olympus Mons.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'Raksasa gas terbesar',
    category: 'Planet',
    color: '#d8ae82',
    image: '/gallery/jupiter.jpg',
    description:
      'Jupiter adalah planet terbesar di Tata Surya dengan Bintik Merah Besar, badai raksasa yang telah berlangsung selama ratusan tahun dan cukup besar untuk menelan beberapa Bumi.',
  },
  {
    id: 'saturnus',
    name: 'Saturnus',
    subtitle: 'Planet bercincin',
    category: 'Planet',
    color: '#e3c99a',
    image: '/gallery/saturnus.webp',
    description:
      'Saturnus terkenal dengan sistem cincinnya yang megah, tersusun dari jutaan partikel es dan batuan. Planet ini juga memiliki lebih dari 140 bulan yang telah dikonfirmasi.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'Raksasa es yang berotasi menyamping',
    category: 'Planet',
    color: '#8fd8d8',
    image: '/gallery/uranus.jpg',
    description:
      'Uranus unik karena berotasi hampir menyamping dengan kemiringan sumbu sekitar 98 derajat, membuat kutub-kutubnya bergantian menghadap Matahari sepanjang orbitnya.',
  },
  {
    id: 'neptunus',
    name: 'Neptunus',
    subtitle: 'Raksasa es dengan badai terkencang',
    category: 'Planet',
    color: '#3b5fd8',
    image: '/gallery/neptunus.jpg',
    description:
      'Neptunus adalah planet terjauh dari Matahari dan memiliki angin terkencang di Tata Surya, dengan kecepatan yang bisa mencapai lebih dari 2.000 km/jam.',
  },
  {
    id: 'pluto',
    name: 'Pluto',
    subtitle: 'Planet kerdil ikonik',
    category: 'Planet Kerdil',
    color: '#c9b8a3',
    image: '/gallery/pluto.jpg',
    description:
      'Pluto diklasifikasikan ulang sebagai planet kerdil pada tahun 2006. Permukaannya yang beku menyimpan dataran nitrogen padat berbentuk hati yang ikonik, Tombaugh Regio.',
  },
  {
    id: 'blackhole',
    name: 'Lubang Hitam',
    subtitle: 'Fenomena gravitasi paling ekstrem',
    category: 'Fenomena',
    color: '#8a5cf6',
    image: '/gallery/blackhole.webp',
    description:
      'Lubang hitam adalah wilayah di ruang angkasa dengan gravitasi yang sangat kuat sehingga tidak ada apa pun, bahkan cahaya, yang dapat lolos setelah melewati cakrawala peristiwanya.',
  },
];

export const GALLERY_CATEGORIES = [
  'Semua',
  'Bintang',
  'Planet',
  'Planet Kerdil',
  'Fenomena',
];