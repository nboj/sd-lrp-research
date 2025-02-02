'use client'
import { GeneralContext } from "@/providers/GeneralProvider"
import { Progress } from "@nextui-org/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useContext, useEffect } from "react"
import styles from '@/components/ui/page_loader/PageLoader.module.css'

const PageLoader = () => {
    const { loading, setLoading } = useContext(GeneralContext)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    useEffect(() => {
        setLoading(false)
    }, [pathname, searchParams, setLoading])
    if (loading) {
        return (
            <Progress
                isDisabled={!loading}
                aria-label={"Loading..."}
                size={'sm'}
                className={styles.progress}
                isIndeterminate
                color={"secondary"}
            />
        )
    } else { return <></> }
}

export default PageLoader;
