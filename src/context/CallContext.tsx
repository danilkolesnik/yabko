'use client';
import { createContext, useContext, useState, ReactNode } from "react";

interface CallContextType {
  isCallOpen: boolean;
  openCall: () => void;
  closeCall: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall должен использоваться внутри CallProvider");
  }
  return context;
}

export function CallProvider({ children }: { children: ReactNode }) {
  const [isCallOpen, setCallOpen] = useState(false);

  const openCall = () => setCallOpen(true);
  const closeCall = () => setCallOpen(false);

  return (
    <CallContext.Provider value={{ isCallOpen, openCall, closeCall }}>
      {children}
    </CallContext.Provider>
  );
}
