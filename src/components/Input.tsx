import React, { ChangeEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface Option {
  label: string;
  value: string;
}

interface InputProps
  extends React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > {
  label?: string;
  type?:
    | "text"
    | "search"
    | "file"
    | "number"
    | "dropdown"
    | "checkbox"
    | "textarea"
    | "email"
    | "password";
  options?: Option[];
  error?: string;
  required?: boolean;
  size?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  options,
  error,
  required,
  size = 1,
  ...rest
}) => {
  const [value, setValue] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.checked.toString());
  };

  const getSizeClass = () => {
    switch (size) {
      case 1:
        return "py-2 px-2 text-sm outline-blue-400";
      case 2:
        return "py-4 px-4 text-lg outline-blue-400";
      default:
        return "py-2 px-3 outline-blue-400";
    }
  };

  return (
    <div className="my-2">
      {label && <label className="block font-bold mb-2">{label}</label>}
      {type === "text" ? (
        <div>
          <input
            type="text"
            className={`border rounded w-full ${getSizeClass()}`}
            value={value}
            onChange={handleInputChange}
            required={required}
            {...rest}
          />
          {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
      ) : type === "email" || type === "password" ? (
        <div>
          <input
            type={type}
            className={`border rounded w-full ${getSizeClass()}`}
            value={value}
            onChange={handleInputChange}
            required={required}
            {...rest}
          />
          {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
      ) : null}
      {type === "textarea" && (
        <textarea
          className={`border rounded w-full ${getSizeClass()}`}
          value={value}
          onChange={handleInputChange}
          required={required}
          {...rest}
        />
      )}
      {type === "search" && (
        <div className="relative">
          <input
            type="search"
            className={`border rounded py-2 px-3 pl-10 ${getSizeClass()}`}
            value={value}
            onChange={handleInputChange}
            required={required}
            {...rest}
          />
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2" />
        </div>
      )}
      {type === "file" && (
        <input
          type="file"
          className={`mt-2 ${getSizeClass()}`}
          onChange={handleInputChange}
        />
      )}
      {type === "number" && (
        <input
          type="number"
          className={`border rounded ${getSizeClass()}`}
          value={value}
          onChange={handleInputChange}
          required={required}
          {...rest}
        />
      )}
      {type === "dropdown" && (
        <select
          className={`border rounded ${getSizeClass()}`}
          value={value}
          onChange={handleSelectChange}
          required={required}
          {...rest}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {type === "checkbox" && (
        <label className="block mt-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={value === "true"}
            onChange={handleCheckboxChange}
            required={required}
            {...rest}
          />
          {label}
        </label>
      )}
    </div>
  );
};

export default Input;
