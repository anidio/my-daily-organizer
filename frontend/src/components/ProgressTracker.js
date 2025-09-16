import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';

const PROGRESS_STORAGE_KEY = 'progress';

const moodEmojis = {
    'ótimo': '😊',
    'produtivo': '💪',
    'neutro': '😐',
    'cansado': '😴',
    'estressado': '😤'
};

const sleepEmojis = {
    'muito bem': '😀',
    'bem': '🙂',
    'razoável': '🤨',
    'mal': '😥',
    'muito mal': '😭'
};

const ProgressTracker = ({ totalProgress }) => {
  const [progress, setProgress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    } else {
      setProgress({});
    }
    
    window.addEventListener('localStorageUpdated', handleStorageChange);
    return () => {
        window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);
  
  const handleStorageChange = () => {
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    setProgress(storedProgress ? JSON.parse(storedProgress) : {});
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProgress({ ...progress, [name]: value });
  };

  const handleSelectorChange = (name, value) => {
    setProgress({ ...progress, [name]: value });
  };

  const saveProgress = () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('localStorageUpdated'));
    toggleModal();
  };

  if (!progress) {
    return (
      <div className="progress-tracker">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="progress-tracker">
      <div className="header">
        <h2>Acompanhamento de Progresso</h2>
        <button className="settings-btn" onClick={toggleModal}>⚙️</button>
      </div>
      <div className="progress-summary">
        <h3>∑ Progresso</h3>
        <p>{totalProgress.toFixed(1)}%</p>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="progress-details">
        <h4>Detalhes do Dia</h4>
        <div className="details-list">
          {progress.wakeUpTime && (
            <div className="detail-item">
              <span className="detail-label">Hora que acordou:</span>
              <span className="detail-value">{progress.wakeUpTime}</span>
            </div>
          )}
          {progress.mood && (
            <div className="detail-item">
              <span className="detail-label">Humor:</span>
              <span className="detail-value">{moodEmojis[progress.mood] || ''} {progress.mood}</span>
            </div>
          )}
          {progress.sleepQuality && (
            <div className="detail-item">
              <span className="detail-label">Qualidade do sono:</span>
              <span className="detail-value">{sleepEmojis[progress.sleepQuality] || ''} {progress.sleepQuality}</span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Definir Metas</h3>
            <label>Hora que acordou:</label>
            <input 
              type="time" 
              name="wakeUpTime" 
              value={progress.wakeUpTime || ''}
              onChange={handleInputChange} 
            />
            
            <label>Seu humor:</label>
            <div className="selector-group">
              {Object.entries(moodEmojis).map(([key, emoji]) => (
                <span
                  key={key}
                  className={`selector-item ${progress.mood === key ? 'selected' : ''}`}
                  onClick={() => handleSelectorChange('mood', key)}
                >
                  {emoji} {key}
                </span>
              ))}
            </div>

            <label>Qualidade do sono:</label>
            <div className="selector-group">
              {Object.entries(sleepEmojis).map(([key, emoji]) => (
                <span
                  key={key}
                  className={`selector-item ${progress.sleepQuality === key ? 'selected' : ''}`}
                  onClick={() => handleSelectorChange('sleepQuality', key)}
                >
                  {emoji} {key}
                </span>
              ))}
            </div>
            
            <div className="modal-actions">
              <button onClick={saveProgress}>Salvar</button>
              <button onClick={toggleModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;