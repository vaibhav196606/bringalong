import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { searchCities, CityData } from '../data/cities'

interface CityAutocompleteProps {
  value: string
  countryValue: string
  placeholder: string
  onCityChange: (city: string) => void
  onCountryChange: (country: string) => void
  onCitySelect?: (cityData: CityData) => void
  className?: string
  required?: boolean
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  countryValue,
  placeholder,
  onCityChange,
  onCountryChange,
  onCitySelect,
  className = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<CityData[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length >= 2) {
      const results = searchCities(value)
      setSuggestions(results)
      setIsOpen(results.length > 0)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
    setHighlightedIndex(-1)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onCityChange(newValue)
    
    // Clear country when user types manually
    if (countryValue && newValue !== value) {
      onCountryChange('')
    }
  }

  const handleSuggestionClick = (cityData: CityData) => {
    onCityChange(cityData.city)
    onCountryChange(cityData.country)
    setIsOpen(false)
    setHighlightedIndex(-1)
    
    if (onCitySelect) {
      onCitySelect(cityData)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          autoComplete="off"
        />
        <ChevronDownIcon 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((cityData, index) => (
            <div
              key={`${cityData.city}-${cityData.country}`}
              onClick={() => handleSuggestionClick(cityData)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{cityData.city}</div>
              <div className="text-sm text-gray-500">{cityData.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CityAutocomplete
