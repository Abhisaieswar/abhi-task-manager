import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  type?: "submit" | "button";
  float?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled,
  loading,
  variant = "primary",
  size = "medium",
  type,
  float = "left",
  ...rest
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-indigo-500 hover:bg-blue-700";
      case "secondary":
        return "bg-gray-500 hover:bg-gray-700";
      case "danger":
        return "bg-red-500 hover:bg-red-700";
      default:
        return "";
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case "small":
        return "py-1 px-3 text-xs";
      case "medium":
        return "py-2 px-4 text-sm";
      case "large":
        return "py-3 px-5 text-lg";
      default:
        return "";
    }
  };

  return (
    <button
      className={`text-white font-bold flex justify-center rounded ${getButtonStyle()} ${getButtonSize()} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } float-${float} w-fit`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zm10-5.291a7.962 7.962 0 01-2 5.291l3 2.647A8.01 8.01 0 0120 12h-4zm-6-7.938A7.962 7.962 0 0112 4v4c-2.206 0-4.209.895-5.657 2.343l2.647 3zM12 20a8 8 0 008-8h-4c0 2.206-.895 4.209-2.343 5.657l-2.647-3z"
          ></path>
        </svg>
      ) : null}
      {text}
    </button>
  );
};

export default Button;
