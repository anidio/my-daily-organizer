import React, { useState, useEffect } from 'react';
import './StatisticsDashboard.css';

const HOURLY_ACTIVITIES_STORAGE_KEY = 'hourlyActivities';
const WATER_STORAGE_KEY = 'currentWater';
const CALORIES_STORAGE_KEY = 'currentCalories';

const StatisticsDashboard = () => {
    const [stats, setStats] = useState({
        totalActivities: 0,
        completedActivities: 0,
        completionPercentage: 0,
        totalWater: 0,
        totalCalories: 0
    });

    useEffect(() => {
        const calculateStats = () => {
            const hourlyActivities = JSON.parse(localStorage.getItem(HOURLY_ACTIVITIES_STORAGE_KEY)) || {};
            const waterConsumed = parseInt(localStorage.getItem(WATER_STORAGE_KEY)) || 0;
            const caloriesConsumed = parseInt(localStorage.getItem(CALORIES_STORAGE_KEY)) || 0;
            
            const activitiesList = Object.values(hourlyActivities);
            const totalActivities = activitiesList.length;
            const completedActivities = activitiesList.filter(act => act.isCompleted).length;
            
            const completionPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

            setStats({
                totalActivities: totalActivities,
                completedActivities: completedActivities,
                completionPercentage: completionPercentage.toFixed(1),
                totalWater: waterConsumed,
                totalCalories: caloriesConsumed
            });
        };

        calculateStats();

        window.addEventListener('localStorageUpdated', calculateStats);
        return () => {
            window.removeEventListener('localStorageUpdated', calculateStats);
        };
    }, []);

    return (
        <div className="statistics-dashboard">
            <h2>Resumo do Dia</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Atividades Concluídas</h3>
                    <p>{stats.completedActivities} / {stats.totalActivities}</p>
                </div>
                <div className="stat-card">
                    <h3>% de Conclusão</h3>
                    <p>{stats.completionPercentage}%</p>
                </div>
                <div className="stat-card">
                    <h3>Água Consumida</h3>
                    <p>{stats.totalWater}ml</p>
                </div>
                <div className="stat-card">
                    <h3>Calorias Adicionadas</h3>
                    <p>{stats.totalCalories}Kcal</p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;