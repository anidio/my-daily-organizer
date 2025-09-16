const NUTRITION_STORAGE_KEY = 'nutrition';

export const getNutrition = () => {
  const nutrition = JSON.parse(localStorage.getItem(NUTRITION_STORAGE_KEY)) || [];
  return Promise.resolve({ data: nutrition });
};

export const createNutrition = (nutritionItem) => {
  const nutrition = JSON.parse(localStorage.getItem(NUTRITION_STORAGE_KEY)) || [];
  const newNutritionItem = { ...nutritionItem, id: Date.now() };
  nutrition.push(newNutritionItem);
  localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(nutrition));
  return Promise.resolve({ data: newNutritionItem });
};

export const updateNutrition = (id, updatedNutritionItem) => {
  const nutrition = JSON.parse(localStorage.getItem(NUTRITION_STORAGE_KEY)) || [];
  const index = nutrition.findIndex(n => n.id === id);
  if (index > -1) {
    nutrition[index] = { ...nutrition[index], ...updatedNutritionItem };
    localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(nutrition));
    return Promise.resolve({ data: nutrition[index] });
  }
  return Promise.reject(new Error('Item de nutrição não encontrado'));
};

export const deleteNutrition = (id) => {
  const nutrition = JSON.parse(localStorage.getItem(NUTRITION_STORAGE_KEY)) || [];
  const filteredNutrition = nutrition.filter(n => n.id !== id);
  localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(filteredNutrition));
  return Promise.resolve({ status: 200 });
};