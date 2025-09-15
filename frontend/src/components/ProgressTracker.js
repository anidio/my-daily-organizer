import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ progress, nutrition }) => {
    const progressBarWidth = progress > 100 ? 100 : progress;

    const moodEmoji = {
        'ótimo': '😃',
        'produtivo': '💪',
        'neutro': '😐',
        'cansado': '🥱',
        'estressado': '😠',
    };
    const sleepEmoji = {
        'muito bem': '😴',
        'bem': '🙂',
        'razoável': '😐',
        'mal': '😩',
        'muito mal': '😵',
    };

    return (
        <div className="progress-container-wrapper">
            <div className="progress-top-section">
                <div className="progress-bar-container">
                    <p>Σ Progresso</p>
                    <div className="progress-bar-background">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${progressBarWidth}%` }}
                        ></div>
                    </div>
                    <span>{progress}%</span>
                </div>
            </div>
            
            <div className="daily-info-list">
                {nutrition.wokeUpTime && (
                    <div className="info-item">
                        <span>⏰ Acordei</span>
                        <span>{nutrition.wokeUpTime}</span>
                    </div>
                )}
                {nutrition.mood && (
                    <div className="info-item">
                        <span>{moodEmoji[nutrition.mood] || '😐'} Humor</span>
                        <span>{nutrition.mood}</span>
                    </div>
                )}
                {nutrition.sleepQuality && (
                    <div className="info-item">
                        <span>{sleepEmoji[nutrition.sleepQuality] || '😴'} Sono</span>
                        <span>{nutrition.sleepQuality}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressTracker;