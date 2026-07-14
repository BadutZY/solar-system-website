import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './languageToggle.css';

// Two-glyph "translate" mark drawn in the same spirit as the familiar
// Google Translate icon: a serif CJK character and a bold Latin "A",
// offset and colored differently, standing for "translate between
// languages". Drawn from scratch as plain SVG shapes/text, not a
// copied asset.
function TranslateIcon() {
  return (
    <svg viewBox="0 0 36 36" width="20" height="20" aria-hidden="true">
      <text x="1" y="21" fontFamily="'Noto Serif JP','Georgia',serif" fontSize="19" fill="#6ee7ff">
        文
      </text>
      <text x="14" y="31" fontFamily="'Space Grotesk','Arial',sans-serif" fontSize="19" fontWeight="700" fill="#ffb545">
        A
      </text>
    </svg>
  );
}

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      className="vg-lang-btn"
      onClick={toggleLanguage}
      aria-label={t('language.toggleAria')}
      title={`${t('language.current')} → ${t('language.switchToLabel')}`}
    >
      <TranslateIcon />
      <span className="vg-lang-code mono">{language.toUpperCase()}</span>
    </button>
  );
}
