import React, { useState, useEffect, useCallback } from 'react';

interface DebouncedInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    delay?: number;
    className?: string;
}

const DebouncedInput: React.FC<DebouncedInputProps> = React.memo(({
                                                                      value,
                                                                      onChange,
                                                                      placeholder,
                                                                      delay = 400,
                                                                      className = ""
                                                                  }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onChange(inputValue);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [inputValue, delay, onChange]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, []);

    return (
        <input
            type="text"
    placeholder={placeholder}
    value={inputValue}
    onChange={handleChange}
    className={className}
    />
);
});

export default DebouncedInput;