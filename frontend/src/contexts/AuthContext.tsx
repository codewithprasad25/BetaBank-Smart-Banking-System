import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Account, AuthResponse } from '@/types/banking';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  accounts: Account[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_ACCOUNTS'; payload: Account[] };

const initialState: AuthState = {
  user: null,
  accounts: [],
  token: localStorage.getItem('banking_token'),
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accounts: action.payload.accounts,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accounts: [],
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: User) => void;
  updateAccounts: (accounts: Account[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('banking_token');
      if (token) {
        try {
          const response = await authService.verifyToken();
          dispatch({ type: 'LOGIN_SUCCESS', payload: response });
        } catch (error) {
          localStorage.removeItem('banking_token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('banking_token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('banking_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const updateAccounts = (accounts: Account[]) => {
    dispatch({ type: 'UPDATE_ACCOUNTS', payload: accounts });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, updateUser, updateAccounts }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}