import React from 'react';

interface FormInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    minLength?: number;
    placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    id,
    label,
    type,
    value,
    onChange,
    disabled,
    required = true,
    minLength = 6,
    placeholder,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            minLength={minLength}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
    </div>
);

export default FormInput;
