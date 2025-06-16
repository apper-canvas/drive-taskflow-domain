import { motion } from 'framer-motion'
import { useState } from 'react'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'

const TaskItem = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit(task.Id, { title: editTitle.trim() })
    } else {
      setEditTitle(task.title)
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

const formatDueDate = (dateString) => {
    if (!dateString) return null
    
    try {
      const date = parseISO(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      
      const now = new Date()
      
      if (isToday(date)) return 'Today'
      if (isTomorrow(date)) return 'Tomorrow'
      if (isPast(date) && !isToday(date)) return `Overdue - ${format(date, 'MMM d')}`
      
      return format(date, 'MMM d')
    } catch (error) {
      console.error('Date parsing error:', error, 'for date:', dateString)
      return 'Invalid date'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B'
      case 'medium': return '#FFD93D' 
      case 'low': return '#4ECDC4'
      default: return '#CBD5E1'
    }
  }

const isOverdue = (() => {
    if (!task?.dueDate || task?.completed) return false
    try {
      const date = parseISO(task.dueDate)
      if (isNaN(date.getTime())) return false
      return isPast(date) && !isToday(date)
    } catch (error) {
      console.error('Date parsing error in isOverdue:', error)
      return false
    }
  })()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed ? 0.6 : 1, 
        y: 0,
        scale: task.completed ? 0.98 : 1
      }}
      exit={{ opacity: 0, x: -300 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
      }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-xl p-4 shadow-sm border-l-4 cursor-pointer
        ${isOverdue ? 'animate-pulse-border' : ''}
        ${className}
      `}
      style={{ 
        borderLeftColor: getPriorityColor(task.priority)
      }}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={(checked) => onToggleComplete(task.Id, checked)}
            size="md"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyPress}
                  className="w-full font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className={`font-medium text-gray-900 break-words ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
              )}
              
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {category && (
                  <Badge
                    size="sm"
                    color={category.color}
                  >
                    {category.name}
                  </Badge>
                )}
                
                <Badge
                  size="sm"
                  color={getPriorityColor(task.priority)}
                >
                  {task.priority}
                </Badge>
                
                {task.dueDate && (
                  <div className={`flex items-center gap-1 text-xs ${
                    isOverdue ? 'text-error font-medium' : 'text-gray-500'
                  }`}>
                    <ApperIcon name="Calendar" className="w-3 h-3" />
                    {formatDueDate(task.dueDate)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.Id)
                }}
                className="p-1 text-gray-400 hover:text-error transition-colors rounded"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem