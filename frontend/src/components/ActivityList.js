import React, { useState } from 'react';
import './ActivityList.css';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ActivityList = ({ userId, activities, setActivities, onDataChange }) => {
    const [newActivityTitle, setNewActivityTitle] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const handleAddActivity = async (e) => {
        e.preventDefault();
        if (!newActivityTitle.trim()) return;

        try {
            const newActivity = {
                userId,
                title: newActivityTitle,
                description: '',
                completed: false,
                position: activities.length
            };
            await axios.post('/api/activities', newActivity);
            onDataChange();
            setNewActivityTitle('');
        } catch (error) {
            console.error('Erro ao adicionar atividade:', error);
        }
    };

    const handleToggleComplete = async (id) => {
        const activityToUpdate = activities.find(act => act.id === id);
        if (!activityToUpdate) return;

        const updatedActivity = {
            ...activityToUpdate,
            completed: !activityToUpdate.completed,
        };

        setActivities(activities.map(act => act.id === id ? updatedActivity : act));

        try {
            await axios.put(`/api/activities/${id}`, updatedActivity);
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/activities/${id}`);
            onDataChange();
        } catch (error) {
            console.error('Erro ao deletar atividade:', error);
        }
    };

    const handleEdit = (activity) => {
        setEditingId(activity.id);
        setEditingTitle(activity.title);
    };

    const handleSaveEdit = async (activity) => {
        const updatedActivity = {
            ...activity,
            title: editingTitle,
        };

        setActivities(activities.map(act => act.id === activity.id ? updatedActivity : act));
        setEditingId(null);

        try {
            await axios.put(`/api/activities/${activity.id}`, updatedActivity);
        } catch (error) {
            console.error('Erro ao salvar edição:', error);
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedActivities = Array.from(activities);
        const [removed] = reorderedActivities.splice(result.source.index, 1);
        reorderedActivities.splice(result.destination.index, 0, removed);

        reorderedActivities.forEach((activity, index) => {
            activity.position = index;
        });

        setActivities(reorderedActivities);

        try {
            await axios.put(`/api/activities/reorder`, reorderedActivities);
        } catch (error) {
            console.error('Erro ao reordenar atividades:', error);
        }
    };

    return (
        <div className="activity-container">
            <h2 className="title">Minhas Atividades</h2>
            <form onSubmit={handleAddActivity} className="add-form">
                <input 
                    type="text" 
                    value={newActivityTitle} 
                    onChange={(e) => setNewActivityTitle(e.target.value)} 
                    placeholder="Adicionar nova atividade..."
                />
                <button type="submit">+</button>
            </form>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="activityList">
                    {(provided) => (
                        <ul 
                            className="activity-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {activities.map((activity, index) => (
                                <Draggable key={activity.id} draggableId={String(activity.id)} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`activity-item ${activity.completed ? 'completed' : ''}`}
                                        >
                                            {editingId === activity.id ? (
                                                <input 
                                                    type="text" 
                                                    className="edit-input"
                                                    value={editingTitle} 
                                                    onChange={(e) => setEditingTitle(e.target.value)} 
                                                />
                                            ) : (
                                                <span onClick={() => handleToggleComplete(activity.id)}>{activity.title}</span>
                                            )}
                                            <div className="item-actions">
                                                {editingId === activity.id ? (
                                                    <button className="save-btn" onClick={() => handleSaveEdit(activity)}>Salvar</button>
                                                ) : (
                                                    <button className="edit-btn" onClick={() => handleEdit(activity)}>Editar</button>
                                                )}
                                                <button className="delete-btn" onClick={() => handleDelete(activity.id)}>Excluir</button>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ActivityList;