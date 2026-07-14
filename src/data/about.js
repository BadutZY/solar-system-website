// Content for the About page: a list of verified space fun facts and a
// short list of space-themed films with their official YouTube trailers.
// Kept as data, separate from the About.jsx component, so it is easy to
// review, correct, or extend independently of the page's layout code.

export const funFacts = {
  en: [
    'A day on Venus (one full rotation) lasts about 243 Earth days, which is longer than Venus\u2019 own year of about 225 Earth days.',
    'Neutron stars can spin extremely fast: some known pulsars rotate over 600 times per second.',
    'A teaspoon of neutron-star material is estimated to weigh roughly a billion tons on Earth, due to its extreme density.',
    'Astronomers estimate there are more stars in the observable universe than grains of sand on every beach on Earth.',
    'Sound cannot travel through space because it needs a medium such as air or water; the vacuum of space is completely silent.',
    'Astronauts can grow up to a few centimeters taller during long spaceflights because the lack of gravity lets the spine stretch out; they return to their normal height back on Earth.',
    'The footprints left by Apollo astronauts on the Moon are expected to last millions of years, since there is no wind or water to erode them.',
    'The Great Red Spot, a giant storm on Jupiter, has been observed continuously for well over 150 years.',
    'The observable universe is estimated to be about 93 billion light-years in diameter, even though it is only around 13.8 billion years old, because space itself has been expanding.',
    'There is a vast cloud of alcohol molecules (methanol) in a star-forming region called Sagittarius B2, near the center of the Milky Way.',
    'Saturn\u2019s moon Titan is the only other body in the Solar System known to have stable lakes and rivers on its surface, though they are made of liquid methane and ethane rather than water.',
    'The International Space Station orbits Earth roughly every 90 minutes, traveling at about 28,000 km/h.',
    'Light from the Andromeda Galaxy, the nearest large galaxy to our own, takes about 2.5 million years to reach Earth.',
    'Near a black hole\u2019s event horizon, time itself runs measurably slower relative to a distant observer, an effect called gravitational time dilation predicted by general relativity.',
    'On Venus, sulfuric-acid rain falls from the clouds but evaporates before ever reaching the scorching surface, a phenomenon known as virga.',
    'A single day on Mercury, from one sunrise to the next, lasts about 176 Earth days, even though Mercury completes an orbit around the Sun in only 88 Earth days.',
  ],
  id: [
    'Satu hari di Venus (satu kali rotasi penuh) berlangsung sekitar 243 hari Bumi, lebih lama dari satu tahun Venus sendiri yang hanya sekitar 225 hari Bumi.',
    'Bintang neutron bisa berputar sangat cepat: beberapa pulsar yang diketahui berotasi lebih dari 600 kali per detik.',
    'Satu sendok teh materi bintang neutron diperkirakan memiliki berat sekitar satu miliar ton jika berada di Bumi, karena kepadatannya yang sangat ekstrem.',
    'Para astronom memperkirakan jumlah bintang di alam semesta teramati lebih banyak daripada jumlah butiran pasir di seluruh pantai di Bumi.',
    'Suara tidak bisa merambat di luar angkasa karena membutuhkan medium seperti udara atau air; ruang hampa di luar angkasa benar-benar sunyi.',
    'Astronaut bisa bertambah tinggi beberapa sentimeter selama penerbangan luar angkasa yang lama karena tidak adanya gravitasi membuat tulang belakang meregang; tinggi mereka kembali normal setelah kembali ke Bumi.',
    'Jejak kaki astronaut Apollo di Bulan diperkirakan akan bertahan hingga jutaan tahun, karena tidak ada angin atau air yang bisa mengikisnya.',
    'Great Red Spot, badai raksasa di Jupiter, telah teramati secara terus-menerus selama lebih dari 150 tahun.',
    'Alam semesta teramati diperkirakan berdiameter sekitar 93 miliar tahun cahaya, meskipun usianya hanya sekitar 13.8 miliar tahun, karena ruang angkasa itu sendiri terus mengembang.',
    'Terdapat awan besar molekul alkohol (metanol) di sebuah wilayah pembentukan bintang bernama Sagittarius B2, dekat pusat Bimasakti.',
    'Titan, bulan milik Saturnus, adalah satu-satunya benda lain di Tata Surya yang diketahui memiliki danau dan sungai stabil di permukaannya, meski terbuat dari metana dan etana cair, bukan air.',
    'Stasiun Luar Angkasa Internasional mengorbit Bumi kira-kira setiap 90 menit, dengan kecepatan sekitar 28,000 km/jam.',
    'Cahaya dari Galaksi Andromeda, galaksi besar terdekat dengan galaksi kita, membutuhkan waktu sekitar 2.5 juta tahun untuk mencapai Bumi.',
    'Di dekat cakrawala peristiwa sebuah lubang hitam, waktu berjalan lebih lambat secara terukur dibanding pengamat yang jauh, efek yang disebut dilatasi waktu gravitasi sesuai prediksi relativitas umum.',
    'Di Venus, hujan asam sulfat turun dari awan namun menguap sebelum mencapai permukaannya yang sangat panas, fenomena yang disebut virga.',
    'Satu hari penuh di Merkurius, dari matahari terbit ke terbit berikutnya, berlangsung sekitar 176 hari Bumi, meskipun Merkurius hanya butuh 88 hari Bumi untuk mengelilingi Matahari satu kali.',
  ],
};

// videoId refers to the official YouTube trailer for each film.
const MOVIE_BASE = [
  { id: 'interstellar', year: '2014', videoId: 'zSWdZVtXT7E' },
  { id: 'project-hail-mary', year: '2026', videoId: 'yUsJQeNUaD4' },
  { id: 'the-martian', year: '2015', videoId: 'ej3ioOneTy8' },
  { id: 'life', year: '2017', videoId: 'dgOGqWHtjP0' },
  { id: 'dune-part-two', year: '2024', videoId: 'Way9Dexny3w' },
];

const MOVIE_CONTENT = {
  en: {
    interstellar: {
      title: 'Interstellar',
      description:
        'A team of astronauts travels through a wormhole near Saturn in search of a new home for humanity as Earth becomes uninhabitable, while a father races against time and relativity to return to his daughter.',
    },
    'project-hail-mary': {
      title: 'Project Hail Mary',
      description:
        'A lone astronaut wakes up aboard a spacecraft light years from home with no memory of his mission, and must piece together the science needed to save humanity from extinction.',
    },
    'the-martian': {
      title: 'The Martian',
      description:
        'Presumed dead and stranded on Mars, an astronaut must rely on ingenuity and science to survive alone on the planet while NASA races to find a way to bring him home.',
    },
    life: {
      title: 'Life',
      description:
        'The crew of the International Space Station discovers the first evidence of life on Mars, but the rapidly evolving organism proves far more intelligent and dangerous than anyone expected.',
    },
    'dune-part-two': {
      title: 'Dune: Part Two',
      description:
        'Paul Atreides unites with the Fremen of the desert planet Arrakis to wage war against the conspirators who destroyed his family, while confronting the dangerous future he foresees for the galaxy.',
    },
  },
  id: {
    interstellar: {
      title: 'Interstellar',
      description:
        'Sekelompok astronaut menembus lubang cacing di dekat Saturnus untuk mencari planet baru bagi umat manusia setelah Bumi tidak lagi layak huni, sementara seorang ayah berpacu dengan waktu dan relativitas untuk kembali kepada putrinya.',
    },
    'project-hail-mary': {
      title: 'Project Hail Mary',
      description:
        'Seorang astronaut terbangun sendirian di sebuah pesawat luar angkasa bertahun cahaya dari rumah tanpa ingatan akan misinya, dan harus menyusun kembali ilmu pengetahuan untuk menyelamatkan umat manusia dari kepunahan.',
    },
    'the-martian': {
      title: 'The Martian',
      description:
        'Dianggap tewas dan terdampar di Mars, seorang astronaut harus mengandalkan kecerdikan dan sains untuk bertahan hidup sendirian di planet tersebut sementara NASA berupaya membawanya pulang.',
    },
    life: {
      title: 'Life',
      description:
        'Awak Stasiun Luar Angkasa Internasional menemukan bukti pertama kehidupan di Mars, namun organisme yang berkembang dengan cepat itu ternyata jauh lebih cerdas dan berbahaya dari yang diperkirakan.',
    },
    'dune-part-two': {
      title: 'Dune: Part Two',
      description:
        'Paul Atreides bersatu dengan suku Fremen di planet gurun Arrakis untuk melancarkan perang terhadap para konspirator yang menghancurkan keluarganya, sambil menghadapi masa depan berbahaya yang ia lihat bagi galaksi.',
    },
  },
};

export function getFunFacts(lang = 'en') {
  return funFacts[lang] || funFacts.en;
}

export function getMovies(lang = 'en') {
  const content = MOVIE_CONTENT[lang] || MOVIE_CONTENT.en;
  return MOVIE_BASE.map((base) => ({ ...base, ...content[base.id] }));
}
