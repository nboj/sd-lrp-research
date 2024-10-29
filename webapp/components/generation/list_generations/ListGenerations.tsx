'use client'

import { Generation } from "@/lib/types"
import Link from "next/link"
import styles from '@/components/generation/list_generations/ListGenerations.module.css'
import Image from "next/image"
import LRPText from "../LRPText"
import { strToArray } from "@/lib/utils"

type Props = Readonly<{
    generations: Generation[]
}>
const ListGenerations = ({ generations }: Props) => {
    return (
        <div className={styles.wrapper}>
            {
                generations.map((generation: Generation, index: number) => (
                    <Link key={`${index}-${generation.id}`} href={`/results/${generation.id}`} className={styles.link}>
                        {
                            generation.display_image && (
                                <div className={styles.display_image_container}>
                                    <Image className={styles.display_image} src={generation.display_image?.pathname} fill sizes={'100cqw'} alt='' />
                                </div>
                            )
                        }
                        <div className={styles.text_container}>
                            <LRPText generation={generation} values={strToArray(generation.display_text?.text_relevance[0])} />
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default ListGenerations
