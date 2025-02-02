'use client'

import { createContext, useState } from "react"

export const GeneralContext = createContext<any>(null)

const GeneralProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false)
    return (
        <GeneralContext.Provider value={{ loading, setLoading }}>
            {children}
        </GeneralContext.Provider>
    )
}
export default GeneralProvider
