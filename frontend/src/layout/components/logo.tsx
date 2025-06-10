import { cn } from "@/lib/utils";
import { useState } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  };

  if (imageError) {
    // Fallback en caso de error
    return <div className={cn("font-bold text-lg", className)}>Logipsum</div>;
  }

  return (
    <img
      src="/logo-icon.svg"
      alt="Logipsum"
      className={cn(sizeClasses[size], className)}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};
