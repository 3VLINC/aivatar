import { createContext } from 'react';
import type { AuthContextType } from './Auth.interface';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
