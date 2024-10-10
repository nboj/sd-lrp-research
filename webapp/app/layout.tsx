import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "SD LRP",
  description: "Stable Diffusion and LRP",
};

type Props = Readonly<{
  children: React.ReactNode
}>
const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body className="dark">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html >
  );
}

export default RootLayout
