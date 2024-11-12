import Link from "@/components/ui/link/Link"
import { Generation } from "@/lib/types"
import styles from '@/components/generation/generation_card/GenerationCard.module.css'
import Image from 'next/image'
import LRPText from "@/components/lrp_text/LRPText"
import { parseRelevanceScores } from "@/lib/utils"

type Props = Readonly<{
    generation: Generation
    selected: boolean
}>
const GenerationCard = ({ generation, selected }: Props) => {
    return (
        <Link href={`/results/${generation.id}`} className={`${styles.link} ${selected && styles.selected}`}>
            {
                generation.display_image && (
                    <div className={styles.display_image_container}>
                        <Image className={styles.display_image} src={generation.display_image?.pathname} fill sizes={'100cqw'} alt='' />
                    </div>
                )
            }
            <div className={styles.text_container}>
                <LRPText generation={generation} values={parseRelevanceScores(generation.display_text?.text_relevance[0])} />
            </div>
        </Link>
    )
}

export default GenerationCard
