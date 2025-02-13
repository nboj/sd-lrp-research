'use client'
import styles from '@/components/navbar/Navbar.module.css';
import Link from "@/components/ui/link/Link";
import { FaInfoCircle } from "react-icons/fa";
//import { RiHammerFill } from "react-icons/ri";
import { BsClipboard2PulseFill } from "react-icons/bs";
import { usePathname } from 'next/navigation';
import { BsGridFill } from "react-icons/bs";
import { Ref, useEffect, useMemo, useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link as LinkType } from '@/lib/types';
import { motion } from 'framer-motion';

const links: LinkType[] = [
    {
        name: "About",
        href: "/",
        icon: <FaInfoCircle />
    },
    //{
    //    name: "Unet Architecture",
    //    href: "/unet",
    //    icon: <RiHammerFill />,
    //    disabled: true,
    //},
    {
        name: "Results",
        href: "/results",
        icon: <BsClipboard2PulseFill />
    }
]

type LinkProps = Readonly<{
    link: LinkType;
    onClick: () => void;
}>
const Navlink = ({ link, onClick }: LinkProps) => {
    const pathname = usePathname();
    const active = useMemo(() => {
        if (pathname === link.href) return true
        else if (link.href !== '/' && pathname.startsWith(link.href)) return true
        return false
    }, [pathname])
    const handle_click = (_: React.MouseEvent) => {
        onClick();
    }
    return (
        <li>
            <Link className={`${styles.link} ${active && styles.active} ${link.disabled && styles.disabled}`} href={link.href} onClick={handle_click}>
                {link.icon}{link.name}
            </Link>
        </li>
    )
}
Navlink.displayName = 'NavLink'

type MenuProps = Readonly<{
    onClose: () => void;
    open: boolean;
    ref: Ref<HTMLDivElement>;
}>
const variants = {
    init: {
        left: "-100%",
        width: "70%",
    },
    open: {
        left: "0%",
        width: "80%",
        transition: {
            type: 'inertia',
            velocity: 105,
            timeConstant: 30,
            bounceDamping: 20,
            bounceStiffness: 100,
            power: 1,
            max: 100,

            width: {
                type: 'inertia',
                velocity: 115,
                timeConstant: 30,
                bounceDamping: 10,
                bounceStiffness: 100,
                power: 1,
                max: 100,
            }
        }
    }
}
const Menu = ({ onClose, open, ref }: MenuProps) => {
    const handle_click = () => {
        onClose();
    }
    return (
        <div className={`${styles.menu_wrapper} ${open && styles.open_menu_wrapper}`}>
            <motion.div
                ref={ref}
                className={`${styles.menu}`}
                variants={variants}
                initial={'init'}
                animate={open ? 'open' : 'init'}
            >
                <div className={styles.menu_bar}>
                    <Link className={styles.nav_title} href='/'>SD LRP</Link>
                    <IoClose className={styles.close_button} onClick={handle_click} />
                </div>
                <ul className={styles.small_links_container}>
                    {
                        links.map((link: LinkType, index: number) => (
                            <Navlink link={{ ...link }} key={`link-${index}`} onClick={handle_click} />
                        ))
                    }
                </ul>
            </motion.div >
        </div>
    )
}
Menu.displayName = 'Menu'

const Navbar = () => {
    const menu = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        const on_click = (e: MouseEvent) => {
            if (open && !menu?.current?.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('click', on_click)
        return () => document.removeEventListener('click', on_click)
    }, [open, setOpen])
    const handle_click = (_: React.MouseEvent) => {
        setOpen(true)
    }
    const handle_close = () => {
        setOpen(false)
    }
    return (
        <nav className={styles.nav}>
            <Link href='/' className={styles.nav_title}>SD LRP</Link>
            <ul className={styles.links_container}>
                {
                    links.map((link: LinkType, index: number) => (
                        <Navlink link={{ ...link }} key={`link-${index}`} onClick={handle_close} />
                    ))
                }
            </ul>
            <div className={styles.menu_button} onClick={handle_click} ><BsGridFill /></div>
            <Menu ref={menu} onClose={handle_close} open={open} />
        </nav>
    )
}

export default Navbar;
