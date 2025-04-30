import React from "react";

// Define the allowed button variants
type ButtonVariant = "default" | "close" | "disabled";

// Extend native button props with our own variant and onClick signature
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Button component implementation
const Button = ({
  variant = "default", // Default to 'default' variant
  onClick, // User-provided click handler
  className = "", // Additional class names
  children, // Button contents
  ...props // Other native button props
}: ButtonProps) => {
  // Base styling shared by all variants
  const baseStyles =
    "font-mono uppercase tracking-wider px-4 py-2 rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ease-in-out cursor-pointer";

  // Variant-specific styling
  const variantStyles: Record<ButtonVariant, string> = {
    default:
      "bg-gray-100 bg-opacity-90 text-gray-900 border border-gray-400 shadow-[0_0_10px_rgba(200,200,200,0.7)] hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(200,200,200,0.9)] focus:ring-gray-300",
    close:
      "bg-red-500 text-white shadow-[0_0_10px_rgba(255,100,100,0.7)] hover:bg-red-600 hover:shadow-[0_0_12px_rgba(255,100,100,0.9)] focus:ring-red-300",
    disabled:
      "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:bg-gray-300 hover:shadow-none focus:ring-gray-300",
  };

  // Render the <button> element
  return (
    <button
      {...props} // Spread native props
      onClick={(event) => {
        // Only invoke handler if not disabled
        if (variant !== "disabled" && onClick) {
          onClick(event);
        }
      }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} // Combine styles
    >
      {children}
    </button>
  );
};

// Export the component for use elsewhere
export default Button;
