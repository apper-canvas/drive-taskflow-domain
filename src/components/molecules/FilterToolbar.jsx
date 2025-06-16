import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterToolbar = ({ 
  categories = [],
  selectedCategory,
  onCategoryFilter,
  selectedPriority,
  onPriorityFilter,
  showCompleted,
  onToggleCompleted,
  searchQuery,
  onSearchChange,
  onClearFilters,
  className = ''
}) => {
  const priorities = [
    { value: 'high', label: 'High', color: '#FF6B6B' },
    { value: 'medium', label: 'Medium', color: '#FFD93D' },
    { value: 'low', label: 'Low', color: '#4ECDC4' }
  ]

  const hasActiveFilters = selectedCategory || selectedPriority || searchQuery || showCompleted

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <ApperIcon name="X" className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Categories:</span>
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <motion.div key={category.Id} whileHover={{ scale: 1.05 }}>
                <Badge
                  color={category.color}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category.Id 
                      ? 'ring-2 ring-offset-1' 
                      : 'hover:opacity-80'
                  }`}
                  style={selectedCategory === category.Id ? { 
                    ringColor: category.color 
                  } : {}}
                  onClick={() => onCategoryFilter(
                    selectedCategory === category.Id ? null : category.Id
                  )}
                >
                  {category.name} ({category.taskCount})
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Priority:</span>
          <div className="flex gap-1">
            {priorities.map(priority => (
              <motion.div key={priority.value} whileHover={{ scale: 1.05 }}>
                <Badge
                  color={priority.color}
                  className={`cursor-pointer transition-all ${
                    selectedPriority === priority.value
                      ? 'ring-2 ring-offset-1'
                      : 'hover:opacity-80'
                  }`}
                  style={selectedPriority === priority.value ? { 
                    ringColor: priority.color 
                  } : {}}
                  onClick={() => onPriorityFilter(
                    selectedPriority === priority.value ? null : priority.value
                  )}
                >
                  {priority.label}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Show Completed Toggle */}
        <Button
          variant={showCompleted ? 'primary' : 'ghost'}
          size="sm"
          icon={showCompleted ? 'EyeOff' : 'Eye'}
          onClick={onToggleCompleted}
        >
          {showCompleted ? 'Hide' : 'Show'} Completed
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-error"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}

export default FilterToolbar