import React, { useState } from "react";

type InputProps = {
  type: "text" | "number" | "date" | "dropdown" | "checkbox";
  label: string;
  options?: { value: string; label: string }[];
  value: string | number | boolean;
  onChange: (newValue: string | number | boolean) => void;
};

const MultiInput: React.FC<InputProps> = ({
  type,
  label,
  options,
  value,
  onChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      onChange(value === "" ? "" : Number(value));
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChange(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const renderInput = () => {
    switch (type) {
      case "text":
        return (
          <input
            type="text"
            value={value as string}
            onChange={handleTextChange}
            className="rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 w-full"
          />
        );
      case "number":
        return (
          <input
            type="text"
            value={value as number}
            onChange={handleNumberChange}
            className="rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 w-full"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={value as string}
            onChange={handleDateChange}
            className="rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 w-full"
          />
        );
      case "dropdown":
        return (
          <>
            <div
              className="relative"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 w-full cursor-pointer">
                {options?.find((option) => option.value === value)?.label ||
                  "Select an option..."}
              </div>
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-full rounded-md shadow-lg bg-white z-10">
                  {options?.map((option) => (
                    <div
                      key={option.value}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        onChange(option.value);
                        setDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={handleCheckboxChange}
            className="rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 w-full"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="my-4">
      <label className="block font-medium">{label}</label>
      {renderInput()}
    </div>
  );
};

export default MultiInput;
