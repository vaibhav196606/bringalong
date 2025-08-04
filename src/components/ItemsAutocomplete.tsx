import React, { useState, useRef, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ItemsAutocompleteProps {
  selectedItems: string[]
  onItemsChange: (items: string[]) => void
  placeholder?: string
}

const predefinedItems = [
  'Electronics',
  'Mobile Phones',
  'Laptops',
  'Tablets',
  'Headphones',
  'Phone Cases',
  'Chargers',
  'Power Banks',
  'Clothes',
  'Shoes',
  'Accessories',
  'Jewelry',
  'Watches',
  'Bags',
  'Backpacks',
  'Cosmetics',
  'Perfumes',
  'Skincare Products',
  'Books',
  'Magazines',
  'Toys',
  'Games',
  'Sports Equipment',
  'Musical Instruments',
  'Art Supplies',
  'Gifts',
  'Souvenirs',
  'Food Items',
  'Spices',
  'Tea/Coffee',
  'Alcohol/Liquor',
  'Medicines',
  'Vitamins',
  'Baby Products',
  'Pet Accessories',
  'Home Decor',
  'Kitchen Items',
  'Tools',
  'Stationery',
  'Camera Equipment',
  'Documents',
  'Currency/Cash'
]

const ItemsAutocomplete: React.FC<ItemsAutocompleteProps> = ({
  selectedItems,
  onItemsChange,
  placeholder = "Type to search items..."
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputValue) {
      const filtered = predefinedItems.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedItems.includes(item)
      )
      setFilteredItems(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredItems([])
      setIsOpen(false)
    }
  }, [inputValue, selectedItems])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      onItemsChange([...selectedItems, item])
    }
    setInputValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleRemoveItem = (itemToRemove: string) => {
    onItemsChange(selectedItems.filter(item => item !== itemToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim() && filteredItems.length > 0) {
        handleAddItem(filteredItems[0])
      } else if (inputValue.trim() && !selectedItems.includes(inputValue.trim())) {
        handleAddItem(inputValue.trim())
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedItems.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="hover:text-blue-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue && setIsOpen(filteredItems.length > 0)}
        placeholder={placeholder}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      />

      {/* Dropdown */}
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredItems.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAddItem(item)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
            >
              {item}
            </button>
          ))}
        </div>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Start typing to see suggestions or add custom items. Press Enter to add.
      </p>
    </div>
  )
}

export default ItemsAutocomplete
