import type { AppUser } from '~/interface';

export type AuthContextType = {
  user: AppUser | null;
  logout?: () => void;
};
