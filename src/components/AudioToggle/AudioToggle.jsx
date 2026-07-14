import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './audioToggle.css';

export default function AudioToggle({ enabled, onToggle }) {
  const { t } = useLanguage();
  return (
    <button
      className={`vg-audio-btn ${enabled ? 'is-on' : ''}`}
      onClick={onToggle}
      aria-label={enabled ? t('audio.disable') : t('audio.enable')}
      title={enabled ? t('audio.onTitle') : t('audio.offTitle')}
    >
      <span className="vg-audio-bar" />
      <span className="vg-audio-bar" />
      <span className="vg-audio-bar" />
    </button>
  );
}
