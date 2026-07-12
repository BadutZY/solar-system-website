import './audioToggle.css';

export default function AudioToggle({ enabled, onToggle }) {
  return (
    <button
      className={`vg-audio-btn ${enabled ? 'is-on' : ''}`}
      onClick={onToggle}
      aria-label={enabled ? 'Matikan ambience luar angkasa' : 'Aktifkan ambience luar angkasa'}
      title={enabled ? 'Ambience: ON' : 'Ambience: OFF'}
    >
      <span className="vg-audio-bar" />
      <span className="vg-audio-bar" />
      <span className="vg-audio-bar" />
    </button>
  );
}
