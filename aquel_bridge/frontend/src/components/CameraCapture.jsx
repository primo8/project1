import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { IoMdCamera, IoMdReverseCamera, IoMdMic, IoMdStopwatch } from 'react-icons/io';
import { visionApi } from '../api/client';

const CameraCapture = ({ onCaptureDescription }) => {
    const webcamRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [currentRecognition, setCurrentRecognition] = useState('Waiting for hand...');
    const [recordedFrames, setRecordedFrames] = useState([]);

    // Real-time recognition loop
    useEffect(() => {
        let interval;
        if (isCameraOpen && !loading && !isRecording) {
            interval = setInterval(async () => {
                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) {
                    try {
                        const res = await fetch(imageSrc);
                        const blob = await res.blob();
                        const file = new File([blob], "frame.jpg", { type: "image/jpeg" });
                        const response = await visionApi.recognize(file);
                        if (response.data.status === 'recognized') {
                            setCurrentRecognition(`Potential: ${response.data.description}`);
                        } else {
                            setCurrentRecognition(response.data.description);
                        }
                    } catch (err) {
                        // Silently fail for real-time feed
                    }
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCameraOpen, loading, isRecording]);

    // Recording loop
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) {
                    setRecordedFrames(prev => [...prev, imageSrc]);
                }
            }, 800); // Capture frame every 800ms for sequence
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const handleStartRecording = () => {
        setRecordedFrames([]);
        setIsRecording(true);
        setCurrentRecognition("Recording sequence...");
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        if (recordedFrames.length === 0) return;

        setLoading(true);
        setCurrentRecognition("Translating sequence...");
        try {
            const files = await Promise.all(recordedFrames.map(async (src, i) => {
                const res = await fetch(src);
                const blob = await res.blob();
                return new File([blob], `frame_${i}.jpg`, { type: "image/jpeg" });
            }));

            const response = await visionApi.recognizeSequence(files);
            if (response.data.sentence) {
                onCaptureDescription(response.data.sentence);
            } else {
                onCaptureDescription("No symbols recognized in sequence.");
            }
            setIsCameraOpen(false);
        } catch (err) {
            console.error('Sequence error:', err);
            onCaptureDescription("Error recognizing sequence.");
        } finally {
            setLoading(false);
            setRecordedFrames([]);
        }
    };

    const captureSingle = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setLoading(true);
        try {
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

            const response = await visionApi.recognize(file);
            onCaptureDescription(response.data.description);
            setIsCameraOpen(false);
        } catch (err) {
            console.error('Vision error:', err);
            onCaptureDescription("Failed to recognize symbol.");
        } finally {
            setLoading(false);
        }
    }, [webcamRef, onCaptureDescription]);

    return (
        <div className="camera-container glass-card">
            {!isCameraOpen ? (
                <button className="btn-premium btn-primary" style={{ width: '100%' }} onClick={() => setIsCameraOpen(true)}>
                    <IoMdCamera size={24} /> Open Vision System
                </button>
            ) : (
                <div className="camera-content">
                    <div className="video-feed">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode }}
                            className="webcam"
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                        <div className="recognition-overlay">
                            {currentRecognition}
                        </div>
                        {isRecording && (
                            <div className="recording-indicator">
                                <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }}></div>
                                REC ({recordedFrames.length})
                            </div>
                        )}
                    </div>

                    <div className="sentence-actions">
                        {!isRecording ? (
                            <>
                                <button className="btn-premium btn-primary" onClick={handleStartRecording} disabled={loading}>
                                    <IoMdMic /> Record Sentence
                                </button>
                                <button className="btn-premium btn-secondary" onClick={captureSingle} disabled={loading}>
                                    Capture Single
                                </button>
                            </>
                        ) : (
                            <button className="btn-premium btn-primary" style={{ background: 'var(--secondary)' }} onClick={handleStopRecording} disabled={loading}>
                                <IoMdStopwatch /> Stop & Translate
                            </button>
                        )}
                        <button className="btn-premium btn-secondary" style={{ flex: '0 0 auto' }} onClick={() => setIsCameraOpen(false)} disabled={loading}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
