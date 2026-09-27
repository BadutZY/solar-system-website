import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import HomeCanvas from '../../components/3D/HomeCanvas.jsx';
import PlanetSection from './PlanetSection.jsx';
import { getBodies } from '../../data/planets.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './home.css';

const TOTAL_SECTIONS_OFFSET = 1;

const SCROLL_DURATION = 340;
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

function animateScrollTo(el, targetTop, duration, onDone) {
  const startTop = el.scrollTop;
  const distance = targetTop - startTop;
  if (Math.abs(distance) < 1) {
    onDone?.();
    return () => {};
  }
  const startTime = performance.now();
  let rafId;
  const step = (now) => {
    const t = Math.min(1, (now - startTime) / duration);
    el.scrollTop = startTop + distance * easeOutCubic(t);
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  };
  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

export default function Home() {
  const { language, t } = useLanguage();
  const bodies = useMemo(() => getBodies(language), [language]);
  const containerRef = useRef(null);
  const progressRef = useRef({ value: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const cancelAnimRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const sectionIndex = el.scrollTop / vh;
        const bodyProgress = Math.min(1, Math.max(0, (sectionIndex - 1) / (bodies.length - 1)));
        progressRef.current.value = bodyProgress;
        const idx = Math.round(bodyProgress * (bodies.length - 1));
        setActiveIndex((prev) => (prev !== idx ? idx : prev));
        raf = null;
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goToSection = (sectionIndex) => {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(bodies.length, sectionIndex));
    const target = clamped * window.innerHeight;

    cancelAnimRef.current?.();
    wheelLockRef.current = true;
    cancelAnimRef.current = animateScrollTo(el, target, SCROLL_DURATION, () => {
      wheelLockRef.current = false;
    });
  };

  const scrollToBody = (index) => goToSection(index + TOTAL_SECTIONS_OFFSET);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      if (e.target.closest('.vg-planet-panel')) return;

      e.preventDefault();
      if (wheelLockRef.current) return;
      if (Math.abs(e.deltaY) < 2) return;

      const vh = window.innerHeight;
      const current = Math.round(el.scrollTop / vh);
      const next = current + (e.deltaY > 0 ? 1 : -1);
      if (next === current || next < 0 || next > bodies.length) return;

      goToSection(next);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="vg-home">
      <div className="vg-home-canvas">
        <HomeCanvas progressRef={progressRef} />
      </div>

      <div id="scroll-root" ref={containerRef} className="vg-home-scroll">
        {/* HERO */}
        <section className="vg-hero">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t('home.eyebrow')}
          </motion.p>
          <motion.h1
            className="vg-hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('home.titleLine1')}
            <br />
            {t('home.titleLine2')}
          </motion.h1>
          <motion.p
            className="vg-hero-desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            {t('home.description')}
          </motion.p>
          <motion.button
            className="btn-primary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            onClick={() => scrollToBody(0)}
          >
            {t('home.cta')}
          </motion.button>
        </section>

        {/* ONE FULLSCREEN SECTION PER BODY */}
        {bodies.map((body, i) => (
          <PlanetSection
            key={body.id}
            body={body}
            index={i}
            total={bodies.length}
            scrollContainerRef={containerRef}
          />
        ))}
      </div>

      <div className="vg-home-progress">
        {bodies.map((body, i) => (
          <button
            key={body.id}
            className={`vg-home-dot ${activeIndex === i ? 'is-active' : ''}`}
            onClick={() => scrollToBody(i)}
            aria-label={`${t('home.jumpTo')} ${body.name}`}
            title={body.name}
          />
        ))}
      </div>
    </div>
  );
}