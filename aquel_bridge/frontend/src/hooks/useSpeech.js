import { useState, useCallback } from 'react';
import { ttsApi } from '../api/client';

export const useSpeech = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(null);

    const speak = useCallback(async (text, voice = 'en-US-female') => {
        if (!text) return;

        setIsPlaying(true);
        setError(null);

        try {
            const response = await ttsApi.speak(text, voice);
            const audioUrl = `http://localhost:8000${response.data.url}`;

            const audio = new Audio(audioUrl);
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => {
                setError('Failed to play audio');
                setIsPlaying(false);
            };

            await audio.play();
        } catch (err) {
            console.error('Speech error:', err);
            setError('Failed to generate speech');
            setIsPlaying(false);

            // Fallback to browser TTS if backend fails
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
            }
        }
    }, []);

    return { speak, isPlaying, error };
};
