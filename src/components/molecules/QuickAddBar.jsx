import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuickAddBar = ({ onAddTask, categories = [], className = '' }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [categoryId, setCategoryId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskData = {
      title: title.trim(),
      priority,
      categoryId: categoryId || null,
      dueDate: dueDate || null
    }

    onAddTask(taskData)
    
    // Reset form
    setTitle('')
    setPriority('medium')
    setCategoryId('')
    setDueDate('')
    setIsExpanded(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isExpanded) {
        handleSubmit(e)
      } else {
        setIsExpanded(true)
      }
    }
  }

  return (
    <motion.div
      layout
      className={`bg-white rounded-xl shadow-sm border-2 border-transparent focus-within:border-primary transition-all duration-200 ${className}`}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsExpanded(true)}
              placeholder="Add a new task..."
              className="w-full text-lg font-medium bg-transparent border-none outline-none placeholder-gray-400"
              autoFocus
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon="Plus"
            disabled={!title.trim()}
          >
            Add
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-100 mt-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
<option value="">No category</option>
                  {categories.map(category => (
                    <option key={category.Id} value={category.Id}>
                      {category.Name || category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!title.trim()}
              >
                Add Task
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default QuickAddBar