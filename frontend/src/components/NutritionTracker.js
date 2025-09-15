import React, { useState, useEffect } from 'react';
import './NutritionTracker.css';
import { saveNutrition } from '../api/nutritionApi';

const NutritionTracker = ({ userId, nutrition, onDataChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalNutrition, setModalNutrition] = useState(nutrition);

    useEffect(() => {
        setModalNutrition(nutrition);
    }, [nutrition]);

    const handleSaveGoals = async () => {
        const updatedNutrition = await saveNutrition({
            ...modalNutrition,
            userId: userId,
        });
        if (updatedNutrition) {
            onDataChange();
            setShowModal(false);
        }
    };

    const handleAddWater = async () => {
        const updatedConsumedWater = (nutrition.consumedWater || 0) + 250;
        const updatedNutrition = await saveNutrition({ ...nutrition, consumedWater: updatedConsumedWater, userId: userId });
        if (updatedNutrition) {
            onDataChange();
        }
    };

    const handleAddKcal = async () => {
        const kcalInput = prompt("Quantas calorias você consumiu?");
        if (kcalInput) {
            const updatedConsumedKcal = (nutrition.consumedKcal || 0) + parseInt(kcalInput);
            const updatedNutrition = await saveNutrition({ ...nutrition, consumedKcal: updatedConsumedKcal, userId: userId });
            if (updatedNutrition) {
                onDataChange();
            }
        }
    };

    const predefinedMoods = [
        { value: 'ótimo', icon: '😃' },
        { value: 'produtivo', icon: '💪' },
        { value: 'neutro', icon: '😐' },
        { value: 'cansado', icon: '🥱' },
        { value: 'estressado', icon: '😠' },
    ];

    const sleepQualityOptions = [
        { value: 'muito bem', icon: '😴' },
        { value: 'bem', icon: '🙂' },
        { value: 'razoável', icon: '😐' },
        { value: 'mal', icon: '😩' },
        { value: 'muito mal', icon: '😵' },
    ];

    return (
        <div className="nutrition-tracker">
            <div className="header">
                <h3>Metas do Dia</h3>
                <button className="settings-btn" onClick={() => setShowModal(true)}>⚙️</button>
            </div>
            
            <div className="counters-wrapper">
                <div className="counter water-counter">
                    <h4>💧 Água</h4>
                    <p>{nutrition.consumedWater || 0}ml / {nutrition.requiredWater || 0}ml</p>
                    <div className="counter-progress-bar-bg">
                        <div 
                            className="counter-progress-bar-fill" 
                            style={{ width: `${(nutrition.consumedWater / nutrition.requiredWater * 100) || 0}%` }}
                        ></div>
                    </div>
                    <button onClick={handleAddWater}>+ 250ml</button>
                </div>

                <div className="counter kcal-counter">
                    <h4>🔥 Calorias</h4>
                    <p>{nutrition.consumedKcal || 0}kcal / {nutrition.requiredKcal || 0}kcal</p>
                    <div className="counter-progress-bar-bg">
                        <div 
                            className="counter-progress-bar-fill" 
                            style={{ width: `${(nutrition.consumedKcal / nutrition.requiredKcal * 100) || 0}%` }}
                        ></div>
                    </div>
                    <button onClick={handleAddKcal}>+ Kcal</button>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Definir Metas</h4>
                        <label>Meta de Água (ml): </label>
                        <input
                            type="number"
                            value={modalNutrition.requiredWater || ''}
                            onChange={(e) => setModalNutrition({ ...modalNutrition, requiredWater: parseInt(e.target.value) })}
                        />
                        <label>Meta de Calorias (kcal): </label>
                        <input
                            type="number"
                            value={modalNutrition.requiredKcal || ''}
                            onChange={(e) => setModalNutrition({ ...modalNutrition, requiredKcal: parseInt(e.target.value) })}
                        />
                        <label>Hora que acordou:</label>
                        <input
                            type="time"
                            value={modalNutrition.wokeUpTime || ''}
                            onChange={(e) => setModalNutrition({ ...modalNutrition, wokeUpTime: e.target.value })}
                        />
                        <label>Seu humor:</label>
                        <div className="selector-group">
                            {predefinedMoods.map((mood) => (
                                <button
                                    key={mood.value}
                                    type="button"
                                    className={`selector-item ${modalNutrition.mood === mood.value ? 'selected' : ''}`}
                                    onClick={() => setModalNutrition({ ...modalNutrition, mood: mood.value })}
                                >
                                    {mood.icon} {mood.value}
                                </button>
                            ))}
                        </div>
                        <label>Qualidade do sono:</label>
                        <div className="selector-group">
                            {sleepQualityOptions.map((sleep) => (
                                <button
                                    key={sleep.value}
                                    type="button"
                                    className={`selector-item ${modalNutrition.sleepQuality === sleep.value ? 'selected' : ''}`}
                                    onClick={() => setModalNutrition({ ...modalNutrition, sleepQuality: sleep.value })}
                                >
                                    {sleep.icon} {sleep.value}
                                </button>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSaveGoals}>Salvar</button>
                            <button onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionTracker;