import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const CategoryManager = ({ 
  categories = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isOpen,
  onClose
}) => {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#5B4EE9')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  const colorOptions = [
    '#5B4EE9', '#8B7FF0', '#FF6B6B', '#4ECDC4', 
    '#FFD93D', '#4D96FF', '#FF8C42', '#6BCF7F'
  ]

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return

    onCreateCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor
    })

    setNewCategoryName('')
    setNewCategoryColor('#5B4EE9')
  }

  const handleStartEdit = (category) => {
    setEditingId(category.Id)
    setEditName(category.name)
    setEditColor(category.color)
  }

  const handleSaveEdit = () => {
    if (!editName.trim()) return

    onUpdateCategory(editingId, {
      name: editName.trim(),
      color: editColor
    })

    setEditingId(null)
    setEditName('')
    setEditColor('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditColor('')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Manage Categories
            </h2>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
            />
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-96">
            {/* Create New Category */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Create New Category</h3>
              
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCategoryColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategoryColor === color
                          ? 'border-gray-400 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <Button
                variant="primary"
                size="sm"
                icon="Plus"
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim()}
              >
                Create Category
              </Button>
            </div>

            {/* Existing Categories */}
            {categories.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Existing Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <motion.div
                      key={category.Id}
                      layout
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      {editingId === category.Id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Category name"
                            size="sm"
                          />
                          
                          <div className="flex gap-1">
                            {colorOptions.map(color => (
                              <button
                                key={color}
                                onClick={() => setEditColor(color)}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${
                                  editColor === color
                                    ? 'border-gray-400 scale-110'
                                    : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSaveEdit}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                            <Badge size="sm" variant="default">
                              {category.taskCount} tasks
                            </Badge>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Edit"
                              onClick={() => handleStartEdit(category)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Trash2"
                              onClick={() => onDeleteCategory(category.Id)}
                              className="text-error hover:text-error hover:bg-error hover:bg-opacity-10"
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CategoryManager