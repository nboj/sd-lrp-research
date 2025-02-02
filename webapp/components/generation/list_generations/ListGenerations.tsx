'use client'

import { Generation } from "@/lib/types"
import styles from '@/components/generation/list_generations/ListGenerations.module.css'
import GenerationCard from "@/components/generation/generation_card/GenerationCard";

type Props = Readonly<{
    generations: Generation[]
}>
const ListGenerations = ({ generations }: Props) => {
    return (
        <div className={styles.wrapper}>
            {
                generations.map((generation: Generation, index: number) => (
                    <GenerationCard generation={generation} key={`${index}-generation-${generation.id}`} />
                ))
            }
        </div>
    )
}

export default ListGenerations
