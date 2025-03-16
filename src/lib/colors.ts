export type AccentColor = "blue" | "cyan" | "green" | "purple" | "orange";

export interface AccentColorVariants {
  light: string; // 50 variant
  medium: string; // 500 variant
  dark: string; // 600 variant
  hover: string; // hover state
}

export const getAccentColors = (color: AccentColor): AccentColorVariants => {
  const colorMap: Record<AccentColor, AccentColorVariants> = {
    blue: {
      light: "bg-blue-50",
      medium: "bg-blue-500",
      dark: "text-blue-600",
      hover: "hover:bg-blue-50 hover:text-blue-600",
    },
    cyan: {
      light: "bg-cyan-50",
      medium: "bg-cyan-500",
      dark: "text-cyan-600",
      hover: "hover:bg-cyan-50 hover:text-cyan-600",
    },
    green: {
      light: "bg-green-50",
      medium: "bg-green-500",
      dark: "text-green-600",
      hover: "hover:bg-green-50 hover:text-green-600",
    },
    purple: {
      light: "bg-purple-50",
      medium: "bg-purple-500",
      dark: "text-purple-600",
      hover: "hover:bg-purple-50 hover:text-purple-600",
    },
    orange: {
      light: "bg-orange-50",
      medium: "bg-orange-500",
      dark: "text-orange-600",
      hover: "hover:bg-orange-50 hover:text-orange-600",
    },
  };

  return colorMap[color];
};

// Helper function to get individual color classes
export const getAccentColorClass = (
  color: AccentColor,
  variant: keyof AccentColorVariants
): string => {
  return getAccentColors(color)[variant];
};
