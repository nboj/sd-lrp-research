'use client'
import styles from '@/app/results/[generation_id]/components/Sidebar.module.css'
import GenerationCard from '@/components/generation/generation_card/GenerationCard';
import { Generation } from '@/lib/types'

type Props = Readonly<{
    generations: Generation[];
    selected?: string;
    className: any;
}>
const Sidebar = ({ generations, selected, className }: Props) => {
    return (
        <div className={`${styles.main} ${className}`}>
            {

                generations.map((generation: Generation, index: number) => (
                    <GenerationCard generation={generation} key={`${index}-generation-${generation.id}`} selected={selected == generation.id + ""} />
                ))
            }
        </div>
    )
}

export default Sidebar;
