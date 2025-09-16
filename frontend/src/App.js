import { useEffect, useState } from 'react';
import './App.css';
import ActivityList from './components/ActivityList';
import NutritionTracker from './components/NutritionTracker';
import ProgressTracker from './components/ProgressTracker';

// A função para apagar os dados do localStorage diariamente
const clearDailyData = () => {
    const LAST_VISIT_DATE_KEY = 'lastVisitDate';
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem(LAST_VISIT_DATE_KEY);

    if (lastVisitDate !== today) {
        localStorage.clear();
        localStorage.setItem(LAST_VISIT_DATE_KEY, today);
    }
};

function App() {
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
      clearDailyData();
      calculateTotalProgress();
      
      const updateHandler = () => calculateTotalProgress();
      window.addEventListener('localStorageUpdated', updateHandler);
      return () => {
          window.removeEventListener('localStorageUpdated', updateHandler);
      };
  }, []);
  
  const calculateTotalProgress = () => {
      const activities = JSON.parse(localStorage.getItem('activities')) || [];
      const dailyGoals = JSON.parse(localStorage.getItem('dailyGoals')) || {};
      const currentWater = parseInt(localStorage.getItem('currentWater')) || 0;
      const currentCalories = parseInt(localStorage.getItem('currentCalories')) || 0;
      
      let totalPercentage = 0;
      let totalGoals = 0;
      
      // 1. Cálculo do progresso das atividades
      if (activities.length > 0) {
          const completedActivities = activities.filter(act => act.completed).length;
          const activitiesProgress = (completedActivities / activities.length) * 100;
          totalPercentage += activitiesProgress;
          totalGoals++;
      }
      
      // 2. Cálculo do progresso da água
      if (dailyGoals.waterGoal > 0) {
          const waterProgress = Math.min(100, (currentWater / dailyGoals.waterGoal) * 100);
          totalPercentage += waterProgress;
          totalGoals++;
      }

      // 3. Cálculo do progresso das calorias
      if (dailyGoals.caloriesGoal > 0) {
          const caloriesProgress = Math.min(100, (currentCalories / dailyGoals.caloriesGoal) * 100);
          totalPercentage += caloriesProgress;
          totalGoals++;
      }
      
      // Média total, se houver pelo menos uma meta
      if (totalGoals > 0) {
          setTotalProgress(totalPercentage / totalGoals);
      } else {
          setTotalProgress(0);
      }
  };

  const handleNewDay = () => {
      localStorage.clear();
      window.dispatchEvent(new Event('localStorageUpdated'));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>My Daily Organizer</h1>
        <button className="new-day-btn" onClick={handleNewDay}>
          Iniciar Novo Dia
        </button>
      </header>
      <main className="app-main-layout">
        <div className="left-column">
          <NutritionTracker />
          <ProgressTracker totalProgress={totalProgress} />
        </div>
        <div className="right-column">
          <ActivityList />
        </div>
      </main>
      <footer>
        <p>&copy; 2024 My Daily Organizer</p>
      </footer>
    </div>
  );
}

export default App;