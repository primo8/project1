import React from 'react';
import { IoMdCloseCircle, IoMdVolumeHigh } from 'react-icons/io';

const SentenceBar = ({ symbols, onRemoveSymbol, onClear, onSpeak, isPlaying }) => {
    return (
        <div className="sentence-bar-container">
            <div className="sentence-strip">
                {symbols.length === 0 && <p className="placeholder-text">Select symbols to build a sentence...</p>}
                {symbols.map((symbol, index) => (
                    <div key={`${symbol.id}-${index}`} className="selected-symbol">
                        <span className="mini-emoji">{symbol.emoji}</span>
                        <span className="mini-label">{symbol.label}</span>
                        <button className="remove-btn" onClick={() => onRemoveSymbol(index)}>
                            <IoMdCloseCircle />
                        </button>
                    </div>
                ))}
            </div>
            <div className="sentence-actions">
                <button className="btn-premium btn-secondary" onClick={onClear} disabled={symbols.length === 0}>
                    Clear
                </button>
                <button
                    className="btn-premium btn-primary"
                    onClick={onSpeak}
                    disabled={symbols.length === 0 || isPlaying}
                >
                    <IoMdVolumeHigh /> {isPlaying ? 'Speaking...' : 'Speak'}
                </button>
            </div>
        </div>
    );
};

export default SentenceBar;
