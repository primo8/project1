import React from 'react';
import { IoMdVolumeHigh, IoMdTime } from 'react-icons/io';

const ConversationHistory = ({ history, onReplay }) => {
    if (history.length === 0) return null;

    return (
        <div className="history-container">
            <h3><IoMdTime /> Recent Conversation</h3>
            <div className="history-list">
                {history.map((item, index) => (
                    <div key={index} className="history-item">
                        <div className="history-content">
                            <span className="history-text">{item.text}</span>
                            <span className="history-timestamp">{item.time}</span>
                        </div>
                        <button className="replay-btn" onClick={() => onReplay(item.text)}>
                            <IoMdVolumeHigh />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationHistory;
