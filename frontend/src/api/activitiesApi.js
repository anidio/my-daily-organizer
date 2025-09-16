const ACTIVITIES_STORAGE_KEY = 'activities';

export const getActivities = () => {
  const activities = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY)) || [];
  return Promise.resolve({ data: activities });
};

export const createActivity = (activity) => {
  const activities = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY)) || [];
  const newActivity = { ...activity, id: Date.now() };
  activities.push(newActivity);
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  return Promise.resolve({ data: newActivity });
};

export const updateActivity = (id, updatedActivity) => {
  const activities = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY)) || [];
  const index = activities.findIndex(a => a.id === id);
  if (index > -1) {
    activities[index] = { ...activities[index], ...updatedActivity };
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
    return Promise.resolve({ data: activities[index] });
  }
  return Promise.reject(new Error('Atividade não encontrada'));
};

export const deleteActivity = (id) => {
  const activities = JSON.parse(localStorage.getItem(ACTIVITIES_STORAGE_KEY)) || [];
  const filteredActivities = activities.filter(a => a.id !== id);
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(filteredActivities));
  return Promise.resolve({ status: 200 });
};