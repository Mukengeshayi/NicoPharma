import React from "react";
import { Link } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  title?: string;
  href?: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
};

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-5 py-2.5",
};

const AppButton: React.FC<ButtonProps> = ({
  icon,
  title,
  href,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const classes =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" +
    " " +
    (variantClasses[variant] || "") +
    " " +
    (sizeClasses[size] || "") +
    (className ? " " + className : "");

  const content = (
    <>
      {loading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        icon && <span className="w-4 h-4">{icon}</span>
      )}
      {title && <span>{title}</span>}
    </>
  );

  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <button
      type={type}
      onClick={(e) => {
        if (!loading && onClick) onClick(e);
      }}
      className={classes}
      disabled={loading || props.disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default AppButton;
