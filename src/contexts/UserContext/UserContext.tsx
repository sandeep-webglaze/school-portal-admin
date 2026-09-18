import { IUser } from 'api/user';
import { createContext } from 'react';

export interface UserContextType {
  user?: IUser | null;
  isAuthenticated: boolean;
}

const DEFAULT_VALUE: UserContextType = {
  isAuthenticated: false
};

export const UserContext = createContext(DEFAULT_VALUE);
