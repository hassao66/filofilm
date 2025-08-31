import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  subscribers: number;
  verified: boolean;
  joinDate: string;
  totalViews: number;
  totalVideos: number;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@vitimo.com' && password === 'admin') {
      setUser({
        id: '1',
        username: 'مدیر ویتیمو',
        email: 'admin@vitimo.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        isAdmin: true,
        subscribers: 0,
        verified: true,
        joinDate: '2023-01-01',
        totalViews: 0,
        totalVideos: 0,
        isPremium: true
      });
      return true;
    }
    
    if (email === 'user@vitimo.com' && password === 'user') {
      setUser({
        id: '2',
        username: 'کاربر ویتیمو',
        email: 'user@vitimo.com',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        isAdmin: false,
        subscribers: 1250,
        verified: false,
        joinDate: '2023-06-15',
        totalViews: 125000,
        totalVideos: 12,
        isPremium: false
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};