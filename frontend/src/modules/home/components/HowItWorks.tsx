// HowItWorks.tsx
import React from 'react';

const steps = [
    {
        number: "1.",
        title: "Скористайтеся пошуковою системою",
        description: "Оберіть послугу, яка вас цікавить, або вкажіть місце, де ви хочете знайти автосервіс."
    },
    {
        number: "2.",
        title: "Оберіть найкращу СТО",
        description: "Перегляньте рекомендовані нами автосервіси та оберіть найкращу СТО за відгуками та ціновою пропозицією."
    },
    {
        number: "3.",
        title: "Домовляйтеся про візит",
        description: "Використовуйте онлайн-форму бронювання для запису на СТО."
    }
];

const HowItWorks = () => {
    return (
        <div className="bg-slate-800/90 backdrop-blur-sm text-white p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-lg">
            <div className="flex flex-col space-y-8">
                {steps.map((step, index) => (
                    <div key={index} className="group">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-blue-100 group-hover:text-white transition-colors duration-200">
                            <span className="text-blue-400">{step.number}</span> {step.title}
                        </h3>
                        <p className="text-lg text-slate-300 group-hover:text-slate-100 leading-relaxed transition-colors duration-200">
                            {step.description}
                        </p>
                        {index < steps.length - 1 && (
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mt-6"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;