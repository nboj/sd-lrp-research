import GenerationServer from "@/components/generation/generation/GenerationServer";

type Props = Readonly<{
  params: Promise<{
    generation_id: string;
  }>
}>
export default async function Home({ params }: Props) {
  const { generation_id } = await params;
  return (
    <main>
      <GenerationServer generation_id={generation_id} />
    </main>
  );
}
