import GenerationServer from "@/components/generation/generation_server/GenerationServer";

type Props = Readonly<{
  params: {
    generation_id: string;
  }
}>
export default function Home({ params }: Props) {
  return (
    <main>
      <GenerationServer generation_id={params.generation_id} />
    </main>
  );
}
