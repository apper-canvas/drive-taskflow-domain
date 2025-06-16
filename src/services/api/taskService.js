import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

  async create(taskData) {
    await delay(250);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      archived: false
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      Id: tasks[index].Id, // Preserve ID
      completedAt: updates.completed && !tasks[index].completed ? new Date().toISOString() : 
                   !updates.completed && tasks[index].completed ? null : 
                   tasks[index].completedAt
    };
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = { ...tasks[index] };
    tasks.splice(index, 1);
    return deletedTask;
  },

  async bulkDelete(ids) {
    await delay(300);
    const intIds = ids.map(id => parseInt(id, 10));
    const deletedTasks = tasks.filter(t => intIds.includes(t.Id));
    tasks = tasks.filter(t => !intIds.includes(t.Id));
    return deletedTasks;
  },

  async getByCategory(categoryId) {
    await delay(200);
    return tasks.filter(t => t.categoryId === categoryId && !t.archived).map(t => ({ ...t }));
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return tasks.filter(t => 
      !t.archived && (
        t.title.toLowerCase().includes(searchTerm) ||
        (t.category && t.category.toLowerCase().includes(searchTerm))
      )
    ).map(t => ({ ...t }));
  }
};

export default taskService;