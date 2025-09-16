import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';

const GOALS_STORAGE_KEY = 'dailyGoals';

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
  const [goals, setGoals] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
        const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
        setGoals(storedGoals ? JSON.parse(storedGoals) : {});
    };
    
    handleStorageChange();
    window.addEventListener('localStorageUpdated', handleStorageChange);
    return () => {
        window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoals({ ...goals, [name]: value });
  };

  const handleSelectorChange = (name, value) => {
    setGoals({ ...goals, [name]: value });
  };

  const saveProgress = () => {
    // Salva apenas as metas de progresso no objeto centralizado
    const updatedGoals = {
        ...JSON.parse(localStorage.getItem(GOALS_STORAGE_KEY) || '{}'),
        wakeUpTime: goals.wakeUpTime,
        mood: goals.mood,
        sleepQuality: goals.sleepQuality
    };
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));
    window.dispatchEvent(new Event('localStorageUpdated'));
    toggleModal();
  };

  if (!goals) {
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
          {goals.wakeUpTime && (
            <div className="detail-item">
              <span className="detail-label">Hora que acordou:</span>
              <span className="detail-value">{goals.wakeUpTime}</span>
            </div>
          )}
          {goals.mood && (
            <div className="detail-item">
              <span className="detail-label">Humor:</span>
              <span className="detail-value">{moodEmojis[goals.mood] || ''} {goals.mood}</span>
            </div>
          )}
          {goals.sleepQuality && (
            <div className="detail-item">
              <span className="detail-label">Qualidade do sono:</span>
              <span className="detail-value">{sleepEmojis[goals.sleepQuality] || ''} {goals.sleepQuality}</span>
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
              value={goals.wakeUpTime || ''}
              onChange={handleInputChange} 
            />
            
            <label>Seu humor:</label>
            <div className="selector-group">
              {Object.entries(moodEmojis).map(([key, emoji]) => (
                <span
                  key={key}
                  className={`selector-item ${goals.mood === key ? 'selected' : ''}`}
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
                  className={`selector-item ${goals.sleepQuality === key ? 'selected' : ''}`}
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