import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  className = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 bg-white border-2 rounded-lg 
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error ? 'border-error' : 'border-gray-200 focus:border-primary'}
    ${icon ? 'pl-11' : ''}
    ${className}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input