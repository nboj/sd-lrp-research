import { get_full_generation } from "@/actions/generation_actions"
import Generation from "@/components/generation/generation/Generation"
import { FullGeneration } from "@/lib/types";
import { parseStringArray } from "@/lib/utils";
import styles from '@/components/generation/generation/Generation.module.css'
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "@/components/ui/link/Link";

type Props = Readonly<{
    generation_id: string;
}>
const GenerationServer = async ({ generation_id }: Props) => {
    const full_generation: FullGeneration = await get_full_generation(generation_id)
    const prompt = parseStringArray(full_generation.generation.prompt[0])
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <Link href='/results' className={styles.back_link}><FaArrowLeftLong /> Back</Link>
                <h1 className={styles.title}>{prompt}</h1>
            </div>
            <Generation generation={full_generation} />
        </div>
    )

}

export default GenerationServer
