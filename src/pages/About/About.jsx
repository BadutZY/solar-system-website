import { useMemo } from 'react';
import { motion } from 'framer-motion';
import useLenis from '../../hooks/useLenis.js';
import { getFunFacts, getMovies } from '../../data/about.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './about.css';

export default function About() {
  useLenis();
  const { language, t } = useLanguage();

  const funFacts = useMemo(() => getFunFacts(language), [language]);
  const movies = useMemo(() => getMovies(language), [language]);

  return (
    <div id="scroll-root" className="vg-about-page">
      <section className="vg-about-hero">
        <span className="eyebrow">{t('about.eyebrow')}</span>
        <h1>{t('about.title')}</h1>
        <p>{t('about.description')}</p>
      </section>

      <section className="vg-facts-grid">
        {funFacts.map((fact, i) => (
          <motion.div
            key={fact}
            className="vg-fact-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: (i % 4) * 0.05, duration: 0.45 }}
          >
            <span className="vg-fact-index mono">
              {t('about.funFactsSectionLabel')} {String(i + 1).padStart(2, '0')}
            </span>
            <p>{fact}</p>
          </motion.div>
        ))}
      </section>

      <section className="vg-movies-section">
        <div className="vg-movies-intro">
          <span className="eyebrow">{t('about.moviesEyebrow')}</span>
          <h2>{t('about.moviesTitle')}</h2>
          <p>{t('about.moviesDescription')}</p>
        </div>

        <div className="vg-movies-grid">
          {movies.map((movie, i) => (
            <div className="vg-movie-title" style={{ gridArea: `t${i + 1}` }} key={`title-${movie.id}`}>
              <h3>{movie.title}</h3>
              <span className="mono vg-movie-year">{movie.year}</span>
            </div>
          ))}
          {movies.map((movie, i) => (
            <div className="vg-movie-trailer" style={{ gridArea: `v${i + 1}` }} key={`trailer-${movie.id}`}>
              <div className="vg-movie-trailer-frame">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.videoId}`}
                  title={movie.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
          {movies.map((movie, i) => (
            <div className="vg-movie-desc" style={{ gridArea: `d${i + 1}` }} key={`desc-${movie.id}`}>
              <p>{movie.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
