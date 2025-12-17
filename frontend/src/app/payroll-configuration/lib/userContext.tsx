'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'PayrollManager' | 'HRManager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Generate a valid MongoDB ObjectId format for mock user
const generateMockObjectId = () => {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const defaultUser: User = {
  id: generateMockObjectId(),
  name: 'John Doe',
  role: 'PayrollManager',
};

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<User>(defaultUser);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  const setRole = (role: UserRole) => {
    setUserState((prev) => ({ ...prev, role }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

