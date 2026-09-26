"use client";

import { ReactNode } from "react";

interface InformationGridProps {
  children: ReactNode;
}

export default function InformationGrid({ children }: InformationGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 my-3 w-full">
      {children}
    </div>
  );
}
