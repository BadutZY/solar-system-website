import { useCallback, useRef, useState } from 'react';

export default function useAmbientAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }, []);

  const startDrone = useCallback(() => {
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 55 * 1.5;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(master);

    osc1.start();
    osc2.start();

    nodesRef.current = { master, osc1, osc2, filter };
  }, [getCtx]);

  const stopDrone = useCallback(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const ctx = ctxRef.current;
    nodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => {
      nodes.osc1.stop();
      nodes.osc2.stop();
    }, 1100);
    nodesRef.current = null;
  }, []);

  const toggleAmbience = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      const ctx = getCtx();
      if (ctx.state === 'suspended') ctx.resume();
      if (next) startDrone();
      else stopDrone();
      return next;
    });
  }, [getCtx, startDrone, stopDrone]);

  const playClick = useCallback(() => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }, [getCtx]);

  return { enabled, toggleAmbience, playClick };
}
