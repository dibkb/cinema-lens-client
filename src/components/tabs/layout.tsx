import React from "react";
import { cn } from "../../lib/utils";
const TabsLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("w-full", className)}>{children}</div>;
};

export default TabsLayout;
