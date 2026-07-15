import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const STAT_KEYS = ['diameter', 'mass', 'gravity', 'temperature', 'distanceFromSun', 'rotation', 'revolution', 'moons'];

// How much of the section needs to be inside the scroll container's
// viewport before its info panel is considered "active" and fades in.
const ACTIVE_THRESHOLD = 0.55;

export default function PlanetSection({ body, index, total, scrollContainerRef }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const reduced = !!useReducedMotion();

  // The panel's visibility used to be driven by framer-motion's
  // scroll-linked `useScroll`/`useTransform`, computed from precise pixel
  // offsets inside the custom scroll container. That math depends on the
  // container being fully measured at the moment the hook first runs — in
  // local dev, React's <StrictMode> happens to invoke effects twice, which
  // masked a timing race where the very first measurement could be taken
  // a beat too early. Production builds only run effects once, so that
  // stale measurement stuck around and the panel's opacity never left 0 —
  // it rendered, but stayed invisible.
  //
  // IntersectionObserver sidesteps that entirely: it doesn't do any manual
  // scroll-position math, it just reports whether the section is on
  // screen, and it behaves identically in dev and in a production build.
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= ACTIVE_THRESHOLD);
      },
      {
        root: scrollContainerRef?.current ?? null,
        threshold: [0, ACTIVE_THRESHOLD, 1],
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [scrollContainerRef]);

  // Alternates left/right — MUST match sideSignForIndex() in HomeCanvas.jsx
  // so the camera always frames the planet into whichever half is empty.
  const side = index % 2 === 0 ? 'left' : 'right';

  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <section id={body.id} ref={ref} className={`vg-planet-section side-${side}`}>
      <motion.div
        className="vg-planet-panel"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: isActive ? 'auto' : 'none' }}
      >
        <span className="vg-planet-index mono">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="eyebrow">{body.subtitle}</span>
        <h2 className="vg-planet-name">{body.name}</h2>
        <p className="vg-planet-desc">{body.description}</p>

        <div className="vg-telemetry">
          {STAT_KEYS.map((key) => (
            <div className="vg-telemetry-cell" key={key}>
              <span className="vg-telemetry-label mono">{t(`planetSection.${key}`)}</span>
              <span className="vg-telemetry-value mono">{body.stats[key]}</span>
            </div>
          ))}
        </div>

        <div className="vg-planet-more">
          <button
            type="button"
            className="vg-planet-more-toggle mono"
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
          >
            {moreOpen ? t('planetSection.less') : t('planetSection.more')}
          </button>

          <AnimatePresence initial={false}>
            {moreOpen && (
              <motion.div
                key="more-body"
                className="vg-planet-more-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.55, ease: [0.65, 0, 0.35, 1] },
                  opacity: { duration: 0.4, ease: 'easeInOut' },
                }}
                style={{ overflow: 'hidden' }}
              >
                <div className="vg-planet-more-inner">
                  <p>
                    <strong>{t('planetSection.structure')}:</strong> {body.stats.structure}
                  </p>
                  <p>
                    <strong>{t('planetSection.atmosphere')}:</strong> {body.stats.atmosphere}
                  </p>
                  <p>
                    <strong>{t('planetSection.phenomena')}:</strong> {body.stats.phenomena}
                  </p>
                  {body.missions && (
                    <>
                      <strong>{t('planetSection.missions')}:</strong>
                      <ul>
                        {body.missions.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {body.timeline && (
                    <>
                      <strong>{t('planetSection.timeline')}:</strong>
                      <ul>
                        {body.timeline.map((entry) => (
                          <li key={entry.year}>
                            <span className="mono">{entry.year}</span> - {entry.event}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <strong>{t('planetSection.funFact')}:</strong>
                  <p>{body.funFact}</p>
                  {body.uniqueFacts && (
                    <ul>
                      {body.uniqueFacts.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}