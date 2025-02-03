import { NeynarContextProvider, Theme } from "@neynar/react";
import { useConfig } from "./Config";
import { useState, type PropsWithChildren } from "react";
import type { INeynarAuthenticatedUser } from "@neynar/react/dist/types/common";

import { createContext, useContext } from "react";

interface NeynarUserContextType {
  user: INeynarAuthenticatedUser | undefined;
}

const NeynarUserContext = createContext<NeynarUserContextType | undefined>(
  undefined
);

export const NeynarUserProvider = ({
  children,
  user,
}: PropsWithChildren<{ user: INeynarAuthenticatedUser }>) => {
  return (
    <NeynarUserContext.Provider value={{ user }}>
      {children}
    </NeynarUserContext.Provider>
  );
};

export const useNeynarUser = (): NeynarUserContextType => {
  const context = useContext(NeynarUserContext);
  if (!context) {
    throw new Error("useNeynarUser must be used within a NeynarUserProvider");
  }
  return context;
};

export default function NeynarProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { neynarClientId: clientId } = useConfig();
  const [user, setUser] = useState<INeynarAuthenticatedUser>();
  if (!clientId) {
    return null;
  }

  return (
    <NeynarContextProvider
      settings={{
        clientId,
        defaultTheme: Theme.Light,
        eventsCallbacks: {
          onAuthSuccess: (data) => {
            
            setUser(data.user);
          },
          onSignout: () => {
            
            setUser(undefined);
          },
        },
      }}
    >
      <NeynarUserContext.Provider value={{ user }}>
        {children}
      </NeynarUserContext.Provider>
    </NeynarContextProvider>
  );
}
