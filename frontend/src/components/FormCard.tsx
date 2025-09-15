import React from 'react';

interface FormCardProps {
    title: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    children?: React.ReactNode;
}

const FormCard : React.FC<FormCardProps> = ({
    title,
    onSubmit,
    children
}) => (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
            {children}
        </form>

    </div>
);

export default FormCard;