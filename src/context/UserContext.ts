import React, { createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
}

const UserContext = createContext<User | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = { id: '1', name: 'John Doe' }; // Placeholder user object

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};