import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLenis from '../../hooks/useLenis.js';
import { getGalleryItems, getGalleryCategories } from '../../data/gallery.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './gallery.css';

export default function Gallery() {
  useLenis();
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);

  const galleryItems = useMemo(() => getGalleryItems(language), [language]);
  const categories = useMemo(() => getGalleryCategories(t), [language]);

  useEffect(() => {
    setActive((prev) => (prev ? galleryItems.find((it) => it.id === prev.id) ?? null : prev));
  }, [galleryItems]);

  const items = useMemo(
    () => galleryItems.filter((item) => filter === 'all' || item.category === filter),
    [filter, galleryItems]
  );

  return (
    <div id="scroll-root" className="vg-gallery-page">
      <section className="vg-gallery-intro">
        <span className="eyebrow">{t('gallery.eyebrow')}</span>
        <h1>{t('gallery.title')}</h1>
        <p>{t('gallery.description')}</p>

        <div className="vg-gallery-filters">
          {categories.map((c) => (
            <button
              key={c.key}
              className={`vg-filter-btn ${filter === c.key ? 'is-active' : ''}`}
              onClick={() => setFilter(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <div className="vg-masonry">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            className="vg-tile"
            style={{
              '--accent': item.color,
              aspectRatio: i % 3 === 0 ? '3 / 4' : i % 3 === 1 ? '1 / 1' : '4 / 5',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            onClick={() => setActive(item)}
          >
            <img className="vg-tile-img" src={item.image} alt={item.name} loading="lazy" />
            <span className="vg-tile-glow" />
            <span className="vg-tile-label">
              <strong>{item.name}</strong>
              <em className="mono">{t(`gallery.categories.${item.category}`)}</em>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="vg-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="vg-lightbox-card"
              style={{ '--accent': active.color }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="vg-lightbox-visual"
                style={{ backgroundImage: `url(${active.image})` }}
              />
              <div className="vg-lightbox-info">
                <span className="eyebrow">{active.subtitle}</span>
                <h2>{active.name}</h2>
                <p>{active.description}</p>
              </div>
              <button className="vg-lightbox-close" onClick={() => setActive(null)} aria-label={t('gallery.closeAria')}>
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
