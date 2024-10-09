'use client'

import { Generation } from "@/lib/types"
import Link from "next/link"

type Props = Readonly<{
    generations: Generation[]
}>
const ListGenerations = ({ generations }: Props) => {
    return (
        <div className='my-2'>
            {
                generations.map((generation: Generation, index: number) => (
                    <Link key={`${index}-${generation.id}`} href={`/gen${generation.id}`} className='bg-blue-400 w-fit rounded px-4 py-2'>{generation.prompt}</Link>
                ))
            }
        </div>
    )
}

export default ListGenerations
