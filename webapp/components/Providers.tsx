'use client'
import { NextUIProvider } from "@nextui-org/react";

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>
const Providers = ({ children }: ProvidersProps) => {
    return (
        <>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </>
    )
}

export default Providers;
