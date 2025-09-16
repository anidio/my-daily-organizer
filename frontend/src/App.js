import { useEffect, useState } from 'react';
import './App.css';
import ActivityList from './components/ActivityList';
import NutritionTracker from './components/NutritionTracker';
import ProgressTracker from './components/ProgressTracker';

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
      const progressData = JSON.parse(localStorage.getItem('progress')) || {};
      const currentWater = parseInt(localStorage.getItem('currentWater')) || 0;
      const currentCalories = parseInt(localStorage.getItem('currentCalories')) || 0;
      const goals = progressData.goals || { waterGoal: 0, caloriesGoal: 0 };
      
      const totalPoints = 4;
      let achievedPoints = 0;
      
      if (goals.waterGoal > 0 && currentWater >= goals.waterGoal) {
          achievedPoints += 1;
      }
      if (goals.caloriesGoal > 0 && currentCalories <= goals.caloriesGoal) {
          achievedPoints += 1;
      }
      
      const completedActivities = activities.filter(act => act.completed).length;
      if (activities.length > 0 && completedActivities === activities.length) {
          achievedPoints += 1;
      }

      if (progressData.mood && progressData.sleepQuality && progressData.wakeUpTime) {
          achievedPoints += 1;
      }
      
      const progressPercentage = (achievedPoints / totalPoints) * 100;
      setTotalProgress(progressPercentage);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>My Daily Organizer</h1>
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