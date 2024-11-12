import GenerationServer from "@/components/generation/generation/GenerationServer";
import { sql } from "@vercel/postgres";

type Props = Readonly<{
  params: Promise<{
    generation_id: string;
  }>
}>
export const generateStaticParams = async () => {
  const { rows } = await sql`
    SELECT id from generations
  `
  return [...rows.map(row => ({ generation_id: row.id + "" }))]
}

export default async function Home({ params }: Props) {
  const { generation_id } = await params;
  return (
    <>
      <GenerationServer generation_id={generation_id} />
    </>
  );
}
