interface TextFieldProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'number' | 'date' | 'datetime';
    step?: string;
    placeholder?: string;
    className?: string;
    name?: string;
    autoComplete?: string;
    error?: string;
    
}

export function TextField({ label, value,placeholder, onChange, type = 'text', error, step }: TextFieldProps) {
    return (
        <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                step={step}
                onChange={onChange}
                placeholder={placeholder}
                className={`rounded-md shadow-sm border-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 ${
                    error ? 'border-red-500' : ''
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
