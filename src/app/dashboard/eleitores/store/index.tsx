import React, { createContext, useContext, ReactNode } from 'react';

interface EleitoresContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const EleitoresContext = createContext<EleitoresContextType | undefined>(undefined);

export function EleitoresProvider({ children }: { children: ReactNode }) {
  const value: EleitoresContextType = {
    // Implementar estado global se necessário
  };

  return (
    <EleitoresContext.Provider value={value}>
      {children}
    </EleitoresContext.Provider>
  );
}

export function useEleitores() {
  const context = useContext(EleitoresContext);
  if (context === undefined) {
    throw new Error('useEleitores must be used within a EleitoresProvider');
  }
  return context;
}
