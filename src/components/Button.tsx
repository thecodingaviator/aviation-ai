import React from 'react';

// 1) Define the allowed button variants
type ButtonVariant = 'default' | 'close' | 'disabled';

// 2) Extend native button props with our own variant and onClick signature
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 3) Button component implementation
const Button: React.FC<ButtonProps> = ({
  variant = 'default',    // 3.1) Default to 'default' variant
  onClick,                // 3.2) User-provided click handler
  className = '',         // 3.3) Additional class names
  children,               // 3.4) Button contents
  ...props                // 3.5) Other native button props
}) => {
  // 4) Base styling shared by all variants
  const baseStyles =
    'font-mono uppercase tracking-wider px-4 py-2 rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ease-in-out cursor-pointer';

  // 5) Variant-specific styling
  const variantStyles: Record<ButtonVariant, string> = {
    default:
      'bg-gray-100 bg-opacity-90 text-gray-900 border border-gray-400 shadow-[0_0_10px_rgba(200,200,200,0.7)] hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(200,200,200,0.9)] focus:ring-gray-300',
    close:
      'bg-red-500 text-white shadow-[0_0_10px_rgba(255,100,100,0.7)] hover:bg-red-600 hover:shadow-[0_0_12px_rgba(255,100,100,0.9)] focus:ring-red-300',
    disabled:
      'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:bg-gray-300 hover:shadow-none focus:ring-gray-300',
  };

  // 6) Render the <button> element
  return (
    <button
      {...props}  // 6.1) Spread native props
      onClick={(event) => {
        // 6.2) Only invoke handler if not disabled
        if (variant !== 'disabled' && onClick) {
          onClick(event);
        }
      }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} // 6.3) Combine styles
    >
      {children}
    </button>
  );
};

// 7) Export the component for use elsewhere
export default Button;
