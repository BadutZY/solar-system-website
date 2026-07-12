import { useState } from 'react';
import { motion } from 'framer-motion';
import useLenis from '../../hooks/useLenis.js';
import './about.css';

const TIMELINE = [
  {
    era: '4.6 miliar tahun lalu',
    title: 'Awan Molekul Raksasa',
    text: 'Tata Surya bermula dari awan gas dan debu raksasa (nebula) yang runtuh akibat gravitasinya sendiri — kemungkinan dipicu oleh gelombang kejut dari supernova terdekat.',
  },
  {
    era: '4.6 miliar tahun lalu',
    title: 'Piringan Protoplanet',
    text: 'Runtuhan nebula membentuk piringan berputar yang pipih. Sebagian besar massa terkumpul di pusat, membentuk protobintang yang kelak menjadi Matahari.',
  },
  {
    era: '4.6 miliar tahun lalu',
    title: 'Matahari Menyala',
    text: 'Ketika suhu dan tekanan di inti protobintang cukup tinggi, fusi hidrogen dimulai — Matahari lahir dan mulai meniupkan angin matahari yang menyapu gas ringan ke luar.',
  },
  {
    era: '4.5 miliar tahun lalu',
    title: 'Akresi Planetesimal',
    text: 'Debu dan kerikil di piringan saling bertabrakan dan menempel (akresi), membentuk planetesimal — cikal bakal planet berbatu di bagian dalam dan raksasa gas/es di bagian luar.',
  },
  {
    era: '4.5 miliar tahun lalu',
    title: 'Pembentukan Planet Berbatu',
    text: 'Merkurius, Venus, Bumi, dan Mars terbentuk dari planetesimal berbatu di zona dalam yang terlalu panas untuk es tetap padat.',
  },
  {
    era: '4.5 miliar tahun lalu',
    title: 'Raksasa Gas & Es',
    text: 'Di luar garis salju (snow line), Jupiter, Saturnus, Uranus, dan Neptunus tumbuh besar dengan menangkap gas hidrogen-helium dari piringan sebelum gas tersebut menghilang.',
  },
  {
    era: '~4 miliar tahun lalu',
    title: 'Late Heavy Bombardment',
    text: 'Periode hujan meteor hebat yang menghantam planet dan bulan bagian dalam, kemungkinan dipicu oleh migrasi orbit planet-planet raksasa.',
  },
  {
    era: 'Hari ini',
    title: 'Tata Surya di Bimasakti',
    text: 'Tata Surya kini berada di Lengan Orion, salah satu lengan spiral kecil Galaksi Bimasakti, sekitar 26,000 tahun cahaya dari pusat galaksi, dan mengorbitnya setiap ~230 juta tahun.',
  },
  {
    era: '~5 miliar tahun lagi',
    title: 'Masa Depan Matahari',
    text: 'Matahari akan kehabisan hidrogen di intinya, mengembang menjadi raksasa merah yang kemungkinan menelan Merkurius dan Venus, sebelum akhirnya menyusut menjadi katai putih.',
  },
];

export default function About() {
  useLenis();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div id="scroll-root" className="vg-about-page">
      <section className="vg-about-hero">
        <span className="eyebrow">Asal Usul</span>
        <h1>Bagaimana Tata Surya Terbentuk</h1>
        <p>
          Sekitar 4.6 miliar tahun yang lalu, sebuah sudut tenang di Galaksi Bimasakti mulai
          berubah. Inilah kisah bagaimana debu dan gas menjadi Matahari, delapan planet, dan
          segala sesuatu yang mengorbitnya.
        </p>
      </section>

      <section className="vg-timeline-wrap">
        {TIMELINE.map((item, i) => (
          <motion.button
            key={item.title}
            className={`vg-timeline-node ${openIndex === i ? 'is-open' : ''}`}
            onClick={() => setOpenIndex(i)}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.04, duration: 0.5 }}
          >
            <span className="vg-timeline-marker" />
            <span className="vg-timeline-era mono">{item.era}</span>
            <h3>{item.title}</h3>
            {openIndex === i && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.35 }}
              >
                {item.text}
              </motion.p>
            )}
          </motion.button>
        ))}
      </section>

      <section className="vg-about-context">
        <div className="vg-context-card">
          <h4>Teori Nebula</h4>
          <p>
            Teori yang paling diterima menjelaskan bahwa Matahari dan planet-planet terbentuk
            bersama dari nebula yang sama, menjelaskan mengapa hampir semua planet mengorbit
            pada bidang yang hampir sama dan arah yang sama.
          </p>
        </div>
        <div className="vg-context-card">
          <h4>Posisi di Bimasakti</h4>
          <p>
            Bimasakti sendiri adalah satu dari sekitar dua triliun galaksi di alam semesta
            teramati. Tata Surya adalah satu sistem bintang kecil di antara ratusan miliar
            bintang lain di galaksi kita.
          </p>
        </div>
        <div className="vg-context-card">
          <h4>Skala Kosmik</h4>
          <p>
            Jika Bimasakti dipadatkan seukuran benua, Tata Surya kita hanya akan seukuran
            butiran debu — sebuah pengingat betapa luasnya alam semesta yang sedang kita
            jelajahi bersama.
          </p>
        </div>
      </section>
    </div>
  );
}
