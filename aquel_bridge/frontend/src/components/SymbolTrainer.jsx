import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { visionApi } from '../api/client';

const SymbolTrainer = ({ onFinished }) => {
    const webcamRef = useRef(null);
    const [symbolName, setSymbolName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleTrain = async () => {
        if (!symbolName.trim()) {
            setMessage('Please enter a name for the symbol');
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setLoading(true);
        setMessage('Training...');

        try {
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            const file = new File([blob], "train.jpg", { type: "image/jpeg" });

            await visionApi.train(symbolName, file);
            setMessage(`Symbol "${symbolName}" trained successfully!`);
            setTimeout(() => onFinished(), 2000);
        } catch (err) {
            console.error('Training error:', err);
            setMessage('Error training symbol. Make sure your hand is visible.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card trainer-container">
            <h2>Train New Symbol</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Position your hand in front of the camera and give the symbol a name.
            </p>

            <div className="trainer-grid">
                <div className="video-feed">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="webcam"
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div className="symbol-input-group">
                    <input
                        type="text"
                        placeholder="Symbol Name (e.g. Hello, Water)"
                        className="input-premium"
                        value={symbolName}
                        onChange={(e) => setSymbolName(e.target.value)}
                    />

                    <button
                        className="btn-premium btn-primary"
                        onClick={handleTrain}
                        disabled={loading || !symbolName}
                    >
                        {loading ? 'Processing...' : 'Capture & Train'}
                    </button>

                    <button
                        className="btn-premium btn-secondary"
                        onClick={onFinished}
                    >
                        Cancel
                    </button>

                    {message && (
                        <div style={{
                            marginTop: '20px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: message.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: message.includes('Error') ? '#ef4444' : '#10b981',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SymbolTrainer;
