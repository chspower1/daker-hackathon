import { useEffect, useState } from 'react';
import { DECK_EXPORT_PARAM, SLIDES, SLIDE_COUNT, STAGE_HEIGHT, STAGE_WIDTH } from './deck';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scale, setScale] = useState(1);

  const [isExportMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has(DECK_EXPORT_PARAM);
    }
    return false;
  });

  useEffect(() => {
    if (isExportMode) return;

    function handleResize() {
      const { innerWidth, innerHeight } = window;
      const scaleX = innerWidth / STAGE_WIDTH;
      const scaleY = innerHeight / STAGE_HEIGHT;
      setScale(Math.min(scaleX, scaleY) * 0.95);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExportMode]);

  useEffect(() => {
    if (isExportMode) return;

    function handleKeyDown(e: KeyboardEvent) {
      const isNextKey = e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ' || e.code === 'Space';
      const isPreviousKey = e.key === 'ArrowLeft' || e.key === 'PageUp';

      if (isNextKey) {
        e.preventDefault();
        setCurrentSlide(s => Math.min(s + 1, SLIDES.length - 1));
      } else if (isPreviousKey) {
        e.preventDefault();
        setCurrentSlide(s => Math.max(s - 1, 0));
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExportMode]);

  if (isExportMode) {
    return (
      <div className="export-container">
        {SLIDES.map((Slide) => (
          <div key={Slide.displayName ?? Slide.name} className="slide-wrapper">
            <Slide />
          </div>
        ))}
      </div>
    );
  }

  const CurrentSlideComponent = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute bottom-4 text-slate-500 text-sm font-mono tracking-widest z-50 pointer-events-none">
        {currentSlide + 1} / {SLIDE_COUNT}
      </div>

      <div 
        className="transform origin-center transition-transform duration-300 ease-out shadow-2xl ring-1 ring-white/10 rounded-2xl overflow-hidden"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`
        }}
      >
        <CurrentSlideComponent />
      </div>
    </div>
  );
}
