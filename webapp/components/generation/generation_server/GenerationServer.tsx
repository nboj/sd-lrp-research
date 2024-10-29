import { get_full_generation } from "@/actions/generation_actions"
import Generation from "@/components/generation/generation_server/Generation"
import { FullGeneration } from "@/lib/types";

type Props = Readonly<{
    generation_id: string;
}>
const GenerationServer = async ({ generation_id }: Props) => {
    const full_generation: FullGeneration = await get_full_generation(generation_id)
    return (
        <Generation generation={full_generation} />
    )

}

export default GenerationServer
