import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

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
      <body>
        <Navbar />
        {children}
      </body>
    </html >
  );
}

export default RootLayout
