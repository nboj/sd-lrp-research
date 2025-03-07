'use client'

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type ThemeProviderProps = Readonly<{
    children: React.ReactNode;
}>
const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        setLoaded(true);
    }, []);
    if (loaded) {
        return (
            <NextThemeProvider attribute={'class'}>
                {children}
            </NextThemeProvider>
        );
    } else {
        return (<></>);
    }
}

export default ThemeProvider;
