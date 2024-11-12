import { get_generations } from "@/actions/generation_actions"
import styles from '@/app/results/[generation_id]/page.module.css'
import Sidebar from "@/app/results/[generation_id]/components/Sidebar";

export const dynamic = 'force-static'

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ generation_id: string }>
}>
export default async function RootLayout({ children, params }: Props) {
  const { generation_id } = await params
  const generations = await get_generations();
  if (generations.generations && !generations.error) {
    return (
      <main className={styles.main}>
        <Sidebar generations={generations.generations} selected={generation_id} className={styles.sidebar} />
        {children}
      </main>
    )
  } else {
    console.log("Error: ", generations.error)
    return <div>Server Error.</div>
  }
}
