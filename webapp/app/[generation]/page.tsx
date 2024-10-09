import GenerationServer from "@/components/generation/generation_server/GenerationServer";
import { Suspense } from "react";

type Props = Readonly<{
  params: {
    generation: string;
  }
}>
const GenerationPage = async ({ params }: Props) => {
  try {
    const generation_id = params.generation.substring(3)
    return (
      <Suspense fallback={<p>loading...</p>}>
        <GenerationServer generation_id={generation_id} />
      </Suspense>
    )
  } catch (e) {
    console.log(e)
    return (
      <div>Server Error.</div>
    )
  }
}

export default GenerationPage
