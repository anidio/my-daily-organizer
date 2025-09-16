import React, { useState, useEffect } from 'react';
import './NutritionTracker.css';

const GOALS_STORAGE_KEY = 'goals';
const WATER_STORAGE_KEY = 'currentWater';
const CALORIES_STORAGE_KEY = 'currentCalories';

const NutritionTracker = () => {
    const [goals, setGoals] = useState(() => {
        const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
        return storedGoals ? JSON.parse(storedGoals) : { waterGoal: 0, caloriesGoal: 0 };
    });
    const [currentWater, setCurrentWater] = useState(() => {
        const storedWater = localStorage.getItem(WATER_STORAGE_KEY);
        return storedWater ? parseInt(storedWater) : 0;
    });
    const [currentCalories, setCurrentCalories] = useState(() => {
        const storedCalories = localStorage.getItem(CALORIES_STORAGE_KEY);
        return storedCalories ? parseInt(storedCalories) : 0;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calorieInput, setCalorieInput] = useState('');

    useEffect(() => {
        const handleStorageChange = () => {
            const storedWater = localStorage.getItem(WATER_STORAGE_KEY);
            if (storedWater) {
                setCurrentWater(parseInt(storedWater));
            }
            const storedCalories = localStorage.getItem(CALORIES_STORAGE_KEY);
            if (storedCalories) {
                setCurrentCalories(parseInt(storedCalories));
            }
            const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
            if (storedGoals) {
                setGoals(JSON.parse(storedGoals));
            }
        };
        window.addEventListener('localStorageUpdated', handleStorageChange);
        return () => window.removeEventListener('localStorageUpdated', handleStorageChange);
    }, []);

    const saveStateToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('localStorageUpdated'));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleGoalChange = (e) => {
        setGoals({ ...goals, [e.target.name]: e.target.value });
    };

    const handleSaveGoals = () => {
        saveStateToLocalStorage(GOALS_STORAGE_KEY, goals);
        toggleModal();
    };

    const handleAddWater = () => {
        const newWater = currentWater + 250;
        setCurrentWater(newWater);
        localStorage.setItem(WATER_STORAGE_KEY, newWater);
        window.dispatchEvent(new Event('localStorageUpdated'));
    };

    const handleCalorieInputChange = (e) => {
        setCalorieInput(e.target.value);
    };

    const handleAddCalories = () => {
        const newCaloriesValue = parseInt(calorieInput, 10);
        if (!isNaN(newCaloriesValue) && newCaloriesValue > 0) {
            const newTotalCalories = currentCalories + newCaloriesValue;
            setCurrentCalories(newTotalCalories);
            localStorage.setItem(CALORIES_STORAGE_KEY, newTotalCalories);
            setCalorieInput('');
            window.dispatchEvent(new Event('localStorageUpdated'));
        }
    };

    const calculateProgress = (current, goal) => {
        if (goal <= 0) return 0;
        return Math.min(100, (current / goal) * 100);
    };
    
    return (
        <div className="nutrition-tracker">
            <div className="header">
                <h3>Metas do Dia</h3>
                <button className="settings-btn" onClick={toggleModal}>⚙️</button>
            </div>
            <div className="counters-wrapper">
                <div className="counter">
                    <h4>Água</h4>
                    <p>{currentWater}ml / {goals.waterGoal}ml</p>
                    <button onClick={handleAddWater}>+ 250ml</button>
                    <div className="counter-progress-bar-bg">
                        <div
                            className="counter-progress-bar-fill"
                            style={{ width: `${calculateProgress(currentWater, goals.waterGoal)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="counter">
                    <h4>Calorias</h4>
                    <p>{currentCalories}Kcal / {goals.caloriesGoal}Kcal</p>
                    <div className="calorie-input-group">
                        <input
                            type="number"
                            placeholder="Adicionar Kcal"
                            value={calorieInput}
                            onChange={handleCalorieInputChange}
                        />
                        <button onClick={handleAddCalories}>Adicionar</button>
                    </div>
                    <div className="counter-progress-bar-bg">
                        <div
                            className="counter-progress-bar-fill"
                            style={{ width: `${calculateProgress(currentCalories, goals.caloriesGoal)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Definir Metas</h3>
                        <label>Meta de Água (ml):</label>
                        <input type="number" name="waterGoal" value={goals.waterGoal} onChange={handleGoalChange} />
                        <label>Meta de Calorias (kcal):</label>
                        <input type="number" name="caloriesGoal" value={goals.caloriesGoal} onChange={handleGoalChange} />
                        <div className="modal-actions">
                            <button onClick={handleSaveGoals}>Salvar</button>
                            <button onClick={toggleModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionTracker;