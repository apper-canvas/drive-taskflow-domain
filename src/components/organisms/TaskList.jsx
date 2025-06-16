import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import TaskItem from "@/components/molecules/TaskItem";
import ApperIcon from "@/components/ApperIcon";

const TaskItemErrorBoundary = ({ children, taskId }) => (
  <ErrorBoundary
    fallback={
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="text-sm">Error loading task {taskId}. Please refresh the page.</p>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error('TaskItem Error:', error, errorInfo)
    }}
  >
    {children}
  </ErrorBoundary>
)
const TaskList = ({ 
  tasks = [], 
  categories = [],
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  loading = false,
  className = '' 
}) => {
  const getCategoryById = (categoryId) => {
    return categories.find(c => c.Id === parseInt(categoryId, 10))
  }

// Separate tasks into completed and incomplete
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-center py-12 ${className}`}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-700 mt-4">
          No tasks yet
        </h3>
        <p className="text-gray-500 mt-2">
          Create your first task to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {incompleteTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskItemErrorBoundary taskId={task.Id}>
                  <TaskItem
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </TaskItemErrorBoundary>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <ApperIcon name="Check" className="w-4 h-4" />
            Completed ({completedTasks.length})
          </div>
          
          <AnimatePresence>
            {completedTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskItemErrorBoundary taskId={task.Id}>
                  <TaskItem
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </TaskItemErrorBoundary>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default TaskList;