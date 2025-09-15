import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import NutritionTracker from './components/NutritionTracker';
import ActivityList from './components/ActivityList';
import ProgressTracker from './components/ProgressTracker';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [nutrition, setNutrition] = useState({});

  useEffect(() => {
    let storedUserId = localStorage.getItem('myDailyOrganizerUserId');
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem('myDailyOrganizerUserId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const [activitiesResponse, nutritionResponse] = await Promise.all([
        axios.get(`/api/activities/${userId}`),
        axios.get(`/api/nutrition/${userId}`)
      ]);
      setActivities(activitiesResponse.data);
      if (nutritionResponse.data) {
        setNutrition(nutritionResponse.data);
      } else {
        setNutrition({});
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [userId, fetchData]);

  const calculateProgress = () => {
    const completedActivities = activities.filter(act => act.completed).length;
    const totalActivities = activities.length;

    let activityProgress = 0;
    if (totalActivities > 0) {
      activityProgress = (completedActivities / totalActivities) * 50;
    }

    let nutritionProgress = 0;
    if (nutrition.requiredWater > 0) {
        nutritionProgress += (nutrition.consumedWater / nutrition.requiredWater) * 25;
    }
    if (nutrition.requiredKcal > 0) {
        nutritionProgress += (nutrition.consumedKcal / nutrition.requiredKcal) * 25;
    }

    const totalProgress = activityProgress + nutritionProgress;
    return Math.min(totalProgress, 100).toFixed(1);
  };

  if (!userId) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="App">
      <div className="main-content">
        <aside className="sidebar">
          <NutritionTracker userId={userId} nutrition={nutrition} onDataChange={fetchData} />
          <ProgressTracker progress={calculateProgress()} nutrition={nutrition} />
        </aside>
        <main className="activity-list-wrapper">
          <ActivityList 
            userId={userId} 
            activities={activities} 
            setActivities={setActivities} // ESTA É A LINHA QUE ESTAVA FALTANDO
            onDataChange={fetchData} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;