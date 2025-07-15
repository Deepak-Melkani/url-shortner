import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logger } from '../lib/logger';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          logger.info('User session restored', { username: userData.username });
        }
      } catch (error) {
        logger.error('Failed to restore user session', error);
        localStorage.removeItem('authUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validCredentials = [
        { username: 'admin', password: 'admin123', email: 'admin@urlshortener.com' },
        { username: 'user', password: 'user123', email: 'user@urlshortener.com' },
        { username: 'demo', password: 'demo123', email: 'demo@urlshortener.com' }
      ];

      const matchedUser = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );

      if (matchedUser) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: matchedUser.username,
          email: matchedUser.email
        };

        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        logger.success('User logged in successfully', { 
          username: userData.username,
          email: userData.email 
        });
        
        return true;
      } else {
        logger.warn('Login attempt failed', { username, reason: 'Invalid credentials' });
        return false;
      }
    } catch (error: any) {
      logger.error('Login error', { username, error: error.message });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      logger.info('User logged out', { username: user.username });
    }
    
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
