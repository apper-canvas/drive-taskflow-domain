import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ 
  taskStats = { total: 0, completed: 0, overdue: 0 },
  onManageCategories,
  className = '' 
}) => {
  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0

  return (
    <header className={`bg-white shadow-sm border-b border-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-heading font-bold text-gray-900">
                TaskFlow
              </h1>
              <p className="text-xs text-gray-500">Efficient Task Management</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {taskStats.total}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-success">
                  {taskStats.completed}
                </div>
                <div className="text-xs text-gray-500">Done</div>
              </div>
              
              {taskStats.overdue > 0 && (
                <div className="text-center">
                  <div className="text-lg font-bold text-error">
                    {taskStats.overdue}
                  </div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {completionRate}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-24">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
              onClick={onManageCategories}
            >
              <span className="hidden sm:inline">Categories</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header