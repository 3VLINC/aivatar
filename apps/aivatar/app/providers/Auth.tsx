import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  SignInButton,
  useProfile,
  type UseSignInData,
} from '@farcaster/auth-kit';
import axios from 'axios';

export type UserData = {
  fid: string;
  signer_uuid: string;
};

export type AuthContext = {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const Auth = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const profile = useProfile();

  const handleSuccess = ({ nonce, message, signature }: UseSignInData) => {
    if (!signature || !message) {
      throw new Error('Sign in failed');
    }

    axios
      .post('/api/getUserData', {
        nonce,
        message,
        signature,
      })
      .then((result) => {
        setUserData(result.data);
      });
  };
  if (!profile.isAuthenticated) {
    return <SignInButton onSuccess={handleSuccess} />;
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserData = (): UserData | null => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a AuthProvider');
  }
  return context.userData;
};

export const useSetUserData = (): ((val: UserData) => void | null) => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a AuthProvider');
  }
  return context.setUserData;
};
