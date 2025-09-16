import React, { useState, useEffect } from 'react';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../api/activitiesApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './ActivityList.css';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ name: '', completed: false });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades!', error);
    }
  };

  const handleChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateActivity(editingId, newActivity);
        setEditingId(null);
      } else {
        await createActivity(newActivity);
      }
      setNewActivity({ name: '', completed: false });
      fetchActivities();
      window.dispatchEvent(new Event('localStorageUpdated'));
    } catch (error) {
      console.error('Erro ao salvar atividade!', error);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setNewActivity({ name: activity.name, completed: activity.completed });
  };

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      fetchActivities();
      window.dispatchEvent(new Event('localStorageUpdated'));
    } catch (error) {
      console.error('Erro ao deletar atividade!', error);
    }
  };

  const toggleCompleted = async (id) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      const updatedActivity = { ...activity, completed: !activity.completed };
      try {
        await updateActivity(id, updatedActivity);
        fetchActivities();
        window.dispatchEvent(new Event('localStorageUpdated'));
      } catch (error) {
        console.error('Erro ao atualizar atividade!', error);
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(activities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActivities(items);
    localStorage.setItem('activities', JSON.stringify(items));
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  return (
    <div className="activity-list">
      <h2>Lista de Atividades</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome da atividade"
          value={newActivity.name}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="activities-droppable">
          {(provided) => (
            <ul
              className="activities-ul"
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
                      className={activity.completed ? 'completed' : ''}
                    >
                      <span onClick={() => toggleCompleted(activity.id)}>{activity.name}</span>
                      <div>
                        <button onClick={() => handleEdit(activity)}>Editar</button>
                        <button onClick={() => handleDelete(activity.id)}>Deletar</button>
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