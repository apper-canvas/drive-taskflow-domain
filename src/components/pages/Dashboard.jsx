import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { isPast, parseISO, isToday } from 'date-fns'
import { taskService, categoryService } from '@/services'
import Header from '@/components/organisms/Header'
import TaskList from '@/components/organisms/TaskList'
import QuickAddBar from '@/components/molecules/QuickAddBar'
import FilterToolbar from '@/components/molecules/FilterToolbar'
import CategoryManager from '@/components/molecules/CategoryManager'

const Dashboard = () => {
  // Data state
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // UI state
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategoryManager, setShowCategoryManager] = useState(false)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      toast.success('Task created successfully!')
      
      // Update category task count
      if (newTask.categoryId) {
        updateCategoryTaskCount(newTask.categoryId)
      }
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed })
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      
      if (completed) {
        toast.success('Task completed! 🎉')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleEditTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates)
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      toast.success('Task updated')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      const deletedTask = tasks.find(t => t.Id === taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted')
      
      // Update category task count
      if (deletedTask?.categoryId) {
        updateCategoryTaskCount(deletedTask.categoryId)
      }
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  // Category operations
  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData)
      setCategories(prev => [...prev, newCategory])
      toast.success('Category created!')
    } catch (err) {
      toast.error('Failed to create category')
    }
  }

  const handleUpdateCategory = async (categoryId, updates) => {
    try {
      const updatedCategory = await categoryService.update(categoryId, updates)
      setCategories(prev => prev.map(cat => 
        cat.Id === categoryId ? updatedCategory : cat
      ))
      toast.success('Category updated')
    } catch (err) {
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Delete this category? Tasks will not be deleted.')) {
      try {
        await categoryService.delete(categoryId)
        setCategories(prev => prev.filter(cat => cat.Id !== categoryId))
        
        // Remove category from tasks
        setTasks(prev => prev.map(task => 
          task.categoryId === categoryId 
            ? { ...task, categoryId: null }
            : task
        ))
        
        toast.success('Category deleted')
      } catch (err) {
        toast.error('Failed to delete category')
      }
    }
  }

  const updateCategoryTaskCount = (categoryId) => {
    const count = tasks.filter(task => 
      parseInt(task.categoryId, 10) === parseInt(categoryId, 10) && !task.archived
    ).length
    
    categoryService.updateTaskCount(categoryId, count).catch(() => {
      // Silent fail for task count updates
    })
  }

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => 
        parseInt(task.categoryId, 10) === parseInt(selectedCategory, 10)
      )
    }

    // Priority filter
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority)
    }

    // Completed filter
    if (!showCompleted) {
      filtered = filtered.filter(task => !task.completed)
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Completed tasks go last
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // Priority order
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Due date order (overdue first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1

      // Creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [tasks, searchQuery, selectedCategory, selectedPriority, showCompleted])

  // Task statistics
  const taskStats = useMemo(() => {
    const activeTasks = tasks.filter(task => !task.archived)
    const completed = activeTasks.filter(task => task.completed)
    const overdue = activeTasks.filter(task => {
      if (!task.dueDate || task.completed) return false
      const dueDate = parseISO(task.dueDate)
      return isPast(dueDate) && !isToday(dueDate)
    })

    return {
      total: activeTasks.length,
      completed: completed.length,
      overdue: overdue.length
    }
  }, [tasks])

  // Update categories with current task counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => 
        parseInt(task.categoryId, 10) === category.Id && !task.archived
      ).length
    }))
  }, [categories, tasks])

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSelectedPriority(null)
    setSearchQuery('')
    setShowCompleted(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        taskStats={taskStats}
        onManageCategories={() => setShowCategoryManager(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Add Bar */}
          <QuickAddBar 
            onAddTask={handleAddTask}
            categories={categoriesWithCounts}
          />

          {/* Filter Toolbar */}
          <FilterToolbar
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onCategoryFilter={setSelectedCategory}
            selectedPriority={selectedPriority}
            onPriorityFilter={setSelectedPriority}
            showCompleted={showCompleted}
            onToggleCompleted={() => setShowCompleted(!showCompleted)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            categories={categoriesWithCounts}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            loading={loading}
          />
        </motion.div>
      </main>

      {/* Category Manager Modal */}
      <CategoryManager
        categories={categoriesWithCounts}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  )
}

export default Dashboard