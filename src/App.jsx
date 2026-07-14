import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader/Loader.jsx';
import FloatingNav from './components/FloatingNav/FloatingNav.jsx';
import AudioToggle from './components/AudioToggle/AudioToggle.jsx';
import LanguageToggle from './components/LanguageToggle/LanguageToggle.jsx';
import Home from './pages/Home/Home.jsx';
import SolarSystem from './pages/SolarSystem/SolarSystem.jsx';
import Gallery from './pages/Gallery/Gallery.jsx';
import About from './pages/About/About.jsx';
import useAmbientAudio from './hooks/useAmbientAudio.js';

export default function App() {
  const [loading, setLoading] = useState(true);
  const { enabled, toggleAmbience, playClick } = useAmbientAudio();

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}

      {!loading && (
        <>
          <FloatingNav onNavigateSound={playClick} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solar-system" element={<SolarSystem />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <AudioToggle enabled={enabled} onToggle={toggleAmbience} />
          <LanguageToggle />
        </>
      )}
    </>
  );
}
