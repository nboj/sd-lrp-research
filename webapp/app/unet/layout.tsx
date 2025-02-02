export const metadata = {
  title: 'Unet',
  description: "Stable Diffusion and LRP",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
