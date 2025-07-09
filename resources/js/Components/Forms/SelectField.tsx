import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, Loader2, Check } from 'lucide-react';

type SelectFieldProps = {
  label?: string;
  name: string;
  value: string | number;
  options: Array<{ value: string | number; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  withSearch?: boolean;
  placeholder?: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  className = '',
  required = false,
  disabled = false,
  loading = false,
  withSearch = false,
  placeholder = 'Sélectionner...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 text-sm md:text-base';
  const errorClasses = error ? 'border-red-500' : 'border-gray-300';

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOptionLabel = useMemo(() => {
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }, [options, value]);

  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={`${name}-hidden`} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {/* Champ de déclenchement */}
      <div
        className={`${baseClasses} ${errorClasses} ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
        } flex items-center justify-between p-2 pr-3`}
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!value ? 'text-gray-400' : ''}`}>
          {selectedOptionLabel || placeholder}
        </span>

        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : (
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
          {withSearch && (
            <div className="sticky top-0 px-2 pt-2 pb-1 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                    value === option.value ? 'bg-green-50' : ''
                  }`}
                  onClick={() => {
                    onChange({ target: { name, value: option.value } } as React.ChangeEvent<HTMLSelectElement>);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check className="h-4 w-4 text-green-600" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">Aucun résultat trouvé</div>
            )}
          </div>
        </div>
      )}

      {/* Select caché pour la soumission du formulaire */}
      <select
        id={`${name}-hidden`}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        className="hidden"
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
