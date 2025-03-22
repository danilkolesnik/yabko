'use client';
import { createContext, useContext, useState, ReactNode } from "react";

interface OverlayContextType {
  isOverlayed: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | null>(null);

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay должен использоваться внутри OverlayProvider");
  }
  return context;
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [isOverlayed, setIsOverlayed] = useState(false); //false

  const showOverlay = () => setIsOverlayed(true);
  const hideOverlay = () => setIsOverlayed(false);

  return (
    <OverlayContext.Provider value={{ isOverlayed, showOverlay, hideOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
}
