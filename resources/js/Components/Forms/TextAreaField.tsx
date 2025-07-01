import React from "react";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  autoComplete?: string;
  error?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  name,
  autoComplete,
  error,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        autoComplete={autoComplete}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-md shadow-sm border-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 resize-none ${
          error ? "border-red-500" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
