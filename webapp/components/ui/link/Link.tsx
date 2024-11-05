'use client'
import { GeneralContext } from '@/providers/GeneralProvider';
import NextLink from 'next/link'
import { usePathname } from 'next/navigation';
import { useCallback, useContext } from 'react';

type Props = Readonly<{
    children: React.ReactNode;
    href: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean;
    className?: any;
    style?: any;
    onClick?: any;
}>
const Link = ({ children, onClick, ...props }: Props) => {
    const { setLoading } = useContext(GeneralContext)
    const pathname = usePathname()
    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        const target = e.target as HTMLAnchorElement;
        if (target.pathname !== pathname) {
            setLoading(true)
        }
        onClick && onClick(e)
    }, [pathname])
    return (<NextLink onClick={handleClick} {...props}>{children}</NextLink>)
}

export default Link
