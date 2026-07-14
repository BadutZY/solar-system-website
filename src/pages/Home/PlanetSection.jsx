import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const STAT_KEYS = ['diameter', 'mass', 'gravity', 'temperature', 'distanceFromSun', 'rotation', 'revolution', 'moons'];

export default function PlanetSection({ body, index, total, scrollContainerRef }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });

  // Raw scrollYProgress snaps instantly to wherever the scroll-snap engine
  // lands, which reads as an abrupt cut. Passing it through a spring gives
  // the panel real time-based inertia for its fade in/out.
  //
  // NOTE: the panel intentionally does NOT move vertically with scroll —
  // it stays locked in the same spot at all times. An earlier version also
  // translated it up/down (a "parallax" slide), but that read as an
  // unwanted bob/jitter, especially on mobile where the panel is docked to
  // the bottom of the screen. Only opacity animates now.
  const opacitySpring = useSpring(scrollYProgress, {
    stiffness: 18,
    damping: 22,
    mass: 1.4,
    restDelta: 0.001,
  });
  const opacityProgress = reduced ? scrollYProgress : opacitySpring;

  const opacityInfo = useTransform(opacityProgress, [0, 0.32, 0.68, 1], [0, 1, 1, 0]);

  // Alternates left/right — MUST match sideSignForIndex() in HomeCanvas.jsx
  // so the camera always frames the planet into whichever half is empty.
  const side = index % 2 === 0 ? 'left' : 'right';

  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <section id={body.id} ref={ref} className={`vg-planet-section side-${side}`}>
      <motion.div
        className="vg-planet-panel"
        style={{ opacity: opacityInfo }}
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