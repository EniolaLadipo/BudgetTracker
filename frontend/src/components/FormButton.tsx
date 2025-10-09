import React from 'react';

interface FormButtonProps {
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
    children?: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({
    type = 'submit',
    disabled,
    children,
}) => (
    <button
        type={type}
        disabled={disabled}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

export default FormButton;
