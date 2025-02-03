import { createContext, useContext,type PropsWithChildren,type ReactNode } from 'react';

export interface ConfigContextProps {
    neynarClientId?: string
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export type ConfigProviderProps = PropsWithChildren<{
    value: ConfigContextProps
}>;

export const ConfigProvider = ({ children, value }: ConfigProviderProps) => {

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextProps => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};