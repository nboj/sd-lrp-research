import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/components/Providers";
import { Suspense } from "react";
import PageLoader from "@/components/ui/page_loader/PageLoader";

export const metadata: Metadata = {
    title: {
        default: "SD LRP",
        template: "%s - SD LRP"
    },
    description: "Stable Diffusion and LRP",
};

type Props = Readonly<{
    children: React.ReactNode
}>
const RootLayout = ({ children }: Props) => {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Suspense fallback={null}>
                        <PageLoader />
                    </Suspense>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html >
    );
}

export default RootLayout
