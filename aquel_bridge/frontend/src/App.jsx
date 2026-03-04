import React, { useState, useCallback } from 'react';
import SymbolGrid from './components/SymbolGrid';
import SentenceBar from './components/SentenceBar';
import CameraCapture from './components/CameraCapture';
import ConversationHistory from './components/ConversationHistory';
import SymbolTrainer from './components/SymbolTrainer';
import { useSpeech } from './hooks/useSpeech';
import './index.css';

function App() {
  const [mode, setMode] = useState('communicate'); // 'communicate' or 'train'
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [history, setHistory] = useState([]);
  const { speak, isPlaying } = useSpeech();

  const handleSelectSymbol = (symbol) => {
    setSelectedSymbols((prev) => [...prev, symbol]);
  };

  const handleRemoveSymbol = (index) => {
    setSelectedSymbols((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setSelectedSymbols([]);
  };

  const handleSpeak = async () => {
    if (selectedSymbols.length === 0) return;

    const text = selectedSymbols.map(s => s.label).join(' ');
    speak(text);

    // Add to history
    setHistory(prev => [{
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, ...prev].slice(0, 10));

    setSelectedSymbols([]);
  };

  const handleCaptureDescription = (description) => {
    handleSelectSymbol({
      id: `vision-${Date.now()}`,
      label: description,
      emoji: '✨',
      category: 'Vision',
      color: '#c084fc'
    });
  };

  const handleReplay = (text) => {
    speak(text);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <h1>Aquel Bridge</h1>
        </div>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'communicate' ? 'active' : ''}`}
            onClick={() => setMode('communicate')}
          >
            Communicate
          </button>
          <button
            className={`mode-btn ${mode === 'train' ? 'active' : ''}`}
            onClick={() => setMode('train')}
          >
            Train Symbol
          </button>
        </div>

        <div className="status">
          <span className={`status-dot ${isPlaying ? 'active' : ''}`}></span>
          {isPlaying ? 'Speaking...' : 'Ready'}
        </div>
      </header>

      <main>
        {mode === 'communicate' ? (
          <>

            <SentenceBar
              symbols={selectedSymbols}
              onRemoveSymbol={handleRemoveSymbol}
              onClear={handleClear}
              onSpeak={handleSpeak}
              isPlaying={isPlaying}
            />

            <div style={{ height: '20px' }}></div>

            <CameraCapture onCaptureDescription={handleCaptureDescription} />

            <div style={{ height: '20px' }}></div>

            <SymbolGrid onSelectSymbol={handleSelectSymbol} />

            <ConversationHistory history={history} onReplay={handleReplay} />
          </>
        ) : (
          <SymbolTrainer onFinished={() => setMode('communicate')} />
        )}
      </main>

      <footer>
        <p>© 2026 Aquel Bridge — Empowering Communication</p>
      </footer>
    </div>
  );
}

export default App;
