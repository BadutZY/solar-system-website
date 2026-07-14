import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './floatingNav.css';

// Minimal stroke-style icons, drawn inline so no icon library is required.
const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  orbit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.6" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4.5 17 5-5 3.5 3.5L17 11l3 3" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.8h.01" />
    </svg>
  ),
};

export default function FloatingNav({ onNavigateSound }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const LINKS = [
    { to: '/', label: t('nav.home'), icon: 'home' },
    { to: '/solar-system', label: t('nav.solarSystem'), icon: 'orbit' },
    { to: '/gallery', label: t('nav.gallery'), icon: 'gallery' },
    { to: '/about', label: t('nav.about'), icon: 'about' },
  ];

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <Link to="/" className="vg-brand" onClick={onNavigateSound}>
        <span className="vg-brand-dot" />
        {t('nav.brand')}
      </Link>

      <button
        className={`vg-fab ${open ? 'is-open' : ''}`}
        aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          onNavigateSound?.();
        }}
      >
        <span />
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="vg-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
          >
            <span className="vg-nav-glow" aria-hidden="true" />

            <nav className="vg-nav-list" onClick={(e) => e.stopPropagation()}>
              {LINKS.map((link, i) => {
                const isActive = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      to={link.to}
                      className={isActive ? 'is-active' : ''}
                      onClick={() => {
                        setOpen(false);
                        onNavigateSound?.();
                      }}
                    >
                      <span className="vg-nav-icon">{ICONS[link.icon]}</span>
                      <strong>{link.label}</strong>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}