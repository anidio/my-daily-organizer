import React, { useState, useEffect } from 'react';
import './HourlyPlanner.css';

const HOURLY_ACTIVITIES_STORAGE_KEY = 'hourlyActivities';
const START_HOUR_STORAGE_KEY = 'startHour';
const END_HOUR_STORAGE_KEY = 'endHour';
const INTERVAL_STORAGE_KEY = 'interval';
const TEMPLATES_STORAGE_KEY = 'hourlyTemplates';

const HourlyPlanner = () => {
  const [activities, setActivities] = useState({});
  const [interval, setInterval] = useState(() => {
    const storedInterval = localStorage.getItem(INTERVAL_STORAGE_KEY);
    return storedInterval ? parseInt(storedInterval) : 60;
  }); // Intervalo padrão de 60 minutos
  const [startHour, setStartHour] = useState(() => {
    const storedStartHour = localStorage.getItem(START_HOUR_STORAGE_KEY);
    return storedStartHour ? parseInt(storedStartHour) : 8;
  }); // Hora de início padrão
  const [endHour, setEndHour] = useState(() => {
    const storedEndHour = localStorage.getItem(END_HOUR_STORAGE_KEY);
    return storedEndHour ? parseInt(storedEndHour) : 22;
  }); // Hora de término padrão
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  
  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem(HOURLY_ACTIVITIES_STORAGE_KEY)) || {};
    setActivities(storedActivities);

    const storedStartHour = localStorage.getItem(START_HOUR_STORAGE_KEY);
    const storedEndHour = localStorage.getItem(END_HOUR_STORAGE_KEY);
    if (storedStartHour) setStartHour(parseInt(storedStartHour));
    if (storedEndHour) setEndHour(parseInt(storedEndHour));

    const storedInterval = localStorage.getItem(INTERVAL_STORAGE_KEY);
    if (storedInterval) setInterval(parseInt(storedInterval));

    const storedTemplates = JSON.parse(localStorage.getItem(TEMPLATES_STORAGE_KEY)) || [];
    setTemplates(storedTemplates);

    const handleStorageChange = () => {
      setActivities(JSON.parse(localStorage.getItem(HOURLY_ACTIVITIES_STORAGE_KEY)) || {});
      setStartHour(parseInt(localStorage.getItem(START_HOUR_STORAGE_KEY)) || 8);
      setEndHour(parseInt(localStorage.getItem(END_HOUR_STORAGE_KEY)) || 22);
      setInterval(parseInt(localStorage.getItem(INTERVAL_STORAGE_KEY)) || 60);
      setTemplates(JSON.parse(localStorage.getItem(TEMPLATES_STORAGE_KEY)) || []);
    };

    window.addEventListener('localStorageUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };

  }, []);

  const saveActivities = (updatedActivities) => {
    setActivities(updatedActivities);
    localStorage.setItem(HOURLY_ACTIVITIES_STORAGE_KEY, JSON.stringify(updatedActivities));
    window.dispatchEvent(new Event('localStorageUpdated'));
  };
  
  const generateTimeSlots = (start = 0, end = 24, step = 60) => {
    const slots = [];
    for (let h = start; h < end; h++) {
      for (let m = 0; m < 60; m += step) {
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    localStorage.setItem(INTERVAL_STORAGE_KEY, newInterval);
    saveActivities({});
  };

  const handleHourChange = (e, type) => {
    const newHour = parseInt(e.target.value);
    if (type === 'start') {
      setStartHour(newHour);
      localStorage.setItem(START_HOUR_STORAGE_KEY, newHour);
    } else {
      setEndHour(newHour);
      localStorage.setItem(END_HOUR_STORAGE_KEY, newHour);
    }
  };

  const handleActivityChange = (time, newActivityName) => {
    const updatedActivities = { ...activities };
    if (newActivityName.trim() === '') {
        delete updatedActivities[time];
    } else {
        updatedActivities[time] = { name: newActivityName, isCompleted: false };
    }
    saveActivities(updatedActivities);
  };
  
  const handleToggleComplete = (time) => {
    const updatedActivities = { ...activities };
    const currentActivity = updatedActivities[time] || { name: '', isCompleted: false };
    updatedActivities[time] = { ...currentActivity, isCompleted: !currentActivity.isCompleted };
    saveActivities(updatedActivities);
  };

  const handleDuplicateActivity = (time) => {
    const timeSlots = generateTimeSlots(startHour, endHour, interval);
    const currentTimeIndex = timeSlots.indexOf(time);
    const nextTimeIndex = currentTimeIndex + 1;

    if (currentTimeIndex !== -1 && nextTimeIndex < timeSlots.length) {
      const currentActivity = activities[time];
      const nextTime = timeSlots[nextTimeIndex];
      const updatedActivities = { ...activities };
      updatedActivities[nextTime] = currentActivity;
      saveActivities(updatedActivities);
    }
  };

  const handleSaveTemplate = () => {
    if (templateName.trim() === '') {
      alert('Por favor, insira um nome para o template.');
      return;
    }
    
    // Evita salvar templates vazios
    if (Object.keys(activities).length === 0) {
      alert('Não é possível salvar um template vazio.');
      return;
    }

    const newTemplate = {
      name: templateName,
      activities: activities,
      startHour: startHour,
      endHour: endHour,
      interval: interval
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
    setTemplateName('');
  };

  const handleLoadTemplate = (template) => {
    setActivities(template.activities);
    setStartHour(template.startHour);
    setEndHour(template.endHour);
    setInterval(template.interval);
    
    localStorage.setItem(HOURLY_ACTIVITIES_STORAGE_KEY, JSON.stringify(template.activities));
    localStorage.setItem(START_HOUR_STORAGE_KEY, template.startHour);
    localStorage.setItem(END_HOUR_STORAGE_KEY, template.endHour);
    localStorage.setItem(INTERVAL_STORAGE_KEY, template.interval);
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  const handleDeleteTemplate = (index) => {
    const updatedTemplates = [...templates];
    updatedTemplates.splice(index, 1);
    setTemplates(updatedTemplates);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
  };


  const timeSlots = generateTimeSlots(startHour, endHour, interval);

  return (
    <div className="hourly-planner">
      <h2>Agendador de Atividades</h2>

      <div className="planner-controls">
        <div className="time-range-selector">
          <label>Início:</label>
          <select value={startHour} onChange={(e) => handleHourChange(e, 'start')}>
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <option key={hour} value={hour}>
                {String(hour).padStart(2, '0')}:00
              </option>
            ))}
          </select>
          <label>Fim:</label>
          <select value={endHour} onChange={(e) => handleHourChange(e, 'end')}>
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <option key={hour} value={hour}>
                {String(hour).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
        <div className="interval-selector">
          <button className={interval === 15 ? 'active' : ''} onClick={() => handleIntervalChange(15)}>15 min</button>
          <button className={interval === 30 ? 'active' : ''} onClick={() => handleIntervalChange(30)}>30 min</button>
          <button className={interval === 60 ? 'active' : ''} onClick={() => handleIntervalChange(60)}>1 hora</button>
        </div>
      </div>

      <div className="template-manager">
        <div className="save-template">
          <input 
            type="text" 
            placeholder="Nome do template" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <button onClick={handleSaveTemplate}>Salvar como Template</button>
        </div>
        <div className="load-templates">
          {templates.map((template, index) => (
            <div key={index} className="template-item">
              <button onClick={() => handleLoadTemplate(template)}>
                {template.name}
              </button>
              <button className="delete-template-btn" onClick={() => handleDeleteTemplate(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="planner-grid">
        <div className="grid-header">
          <span>Horário</span>
          <span>Atividade</span>
        </div>
        {timeSlots.map((time) => (
          <div key={time} className={`grid-row ${activities[time]?.isCompleted ? 'completed-row' : ''}`}>
            <span className="time-cell">{time}</span>
            <div className="activity-cell">
              <input
                type="text"
                value={activities[time]?.name || ''}
                onChange={(e) => handleActivityChange(time, e.target.value)}
                placeholder="Adicionar atividade..."
              />
              <input
                type="checkbox"
                checked={activities[time]?.isCompleted || false}
                onChange={() => handleToggleComplete(time)}
              />
              <button className="duplicate-btn" onClick={() => handleDuplicateActivity(time)}>
                📋
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyPlanner;