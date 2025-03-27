'use client';
import { createContext, useContext, useState, ReactNode } from "react";

interface MobileCategoriesContextType {
  isCategoriesOpen: boolean;
  setCategoriesOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  openCategories: () => void;
  closeCategories: () => void;
}

const MobileCategoriesContext = createContext<MobileCategoriesContextType | null>(null);

export function useMobileCategories() {
  const context = useContext(MobileCategoriesContext);
  if (!context) {
    throw new Error("useCategories должен использоваться внутри MobileCategoriesProvider");
  }
  return context;
}

export function MobileCategoriesProvider({ children }: { children: ReactNode }) {
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);

  const openCategories = () => setCategoriesOpen(true);
  const closeCategories = () => setCategoriesOpen(false);

  return (
    <MobileCategoriesContext.Provider value={{ isCategoriesOpen, setCategoriesOpen, openCategories, closeCategories }}>
      {children}
    </MobileCategoriesContext.Provider>
  );
}
