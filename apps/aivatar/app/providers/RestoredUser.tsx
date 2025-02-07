import { createContext, useContext } from 'react';
import type { AppUser } from '~/interface';
import { useConfig } from './Config';
import { useLocalStorage } from '@neynar/react';

export type RestoredUserContext = {
  setUser: (user: AppUser | null) => void;
  user: AppUser | null;
};

export const RestoredUser = createContext<RestoredUserContext>({
  setUser: () => {
    /* noop */
  },
  user: null,
});

export function RestoredUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authStorageKey } = useConfig();
  const [user, setUser] = useLocalStorage<AppUser | null>(authStorageKey);

  return (
    <RestoredUser.Provider value={{ user, setUser }}>
      {children}
    </RestoredUser.Provider>
  );
}

export const useRestoredUser = () => {
  const context = useContext(RestoredUser);

  if (!context) {
    throw new Error(
      'useSetRestoredUser must be used within a RestoredUserProvider'
    );
  }

  return context;
};
