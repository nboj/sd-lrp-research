'use client'
import GeneralProvider from "@/providers/GeneralProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { NextUIProvider } from "@nextui-org/react";

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>
const Providers = ({ children }: ProvidersProps) => {
    return (
        <>
            <NextUIProvider>
                <ThemeProvider>
                    <GeneralProvider>
                        {children}
                    </GeneralProvider>
                </ThemeProvider>
            </NextUIProvider>
        </>
    )
}

export default Providers;
