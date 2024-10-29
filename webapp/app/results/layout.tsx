export const metadata = {
  title: 'Results',
  description: "Stable Diffusion and LRP",
}

export const dynamic = 'force-dynamic'

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
