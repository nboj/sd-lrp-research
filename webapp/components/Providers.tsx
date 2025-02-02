'use client'
import GeneralProvider from "@/providers/GeneralProvider";
import { NextUIProvider } from "@nextui-org/react";

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>
const Providers = ({ children }: ProvidersProps) => {
    return (
        <>
            <NextUIProvider>
                <GeneralProvider>
                    {children}
                </GeneralProvider>
            </NextUIProvider>
        </>
    )
}

export default Providers;
