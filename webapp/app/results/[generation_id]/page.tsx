import GenerationServer from "@/components/generation/generation/GenerationServer";

type Props = Readonly<{
  params: {
    generation_id: string;
  }
}>
export default async function Home(props: Props) {
  const params = await props.params;
  return (
    <main>
      <GenerationServer generation_id={params.generation_id} />
    </main>
  );
}
