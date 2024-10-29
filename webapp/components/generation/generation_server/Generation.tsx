'use client'
import { Asset, AssetType, FullGeneration, FullIteration } from "@/lib/types";
import LRPText from '@/components/generation/LRPText'
import Image from "next/image";
import { strToArray } from "@/lib/utils";
import styles from '@/components/generation/generation_server/Generation.module.css'
const getPriority = (item: Asset) => {
    switch (item.asset_type) {
        case AssetType.NOISE: return 1
        case AssetType.NOISE_PRED: return 0
        case AssetType.NOISE_LRP: return -1
        default: return -2
    }
}
const sortAssets = (assets: Asset[]) => {
    return assets.sort((a: Asset, b: Asset) => {
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);
        return priorityB - priorityA;
    })
}
type Props = Readonly<{
    generation: FullGeneration;
}>
const Generation = ({ generation }: Props) => {
    return (
        <div>
            {generation.generation.prompt}
            {
                generation.iterations.map((iteration: FullIteration, index: number) => (
                    <div key={`${iteration.iteration.id}-${index}`} className="flex">
                        {
                            sortAssets(iteration.assets).map((asset: Asset, asset_index: number) => {
                                switch (asset.asset_type) {
                                    case AssetType.TEXT_SCORES:
                                        const values = strToArray(asset.text_relevance[0])
                                        return (
                                            <div key={`${asset.id}-${index}-${asset_index}`} className={styles.lrp_text_container}>
                                                <LRPText generation={generation.generation} values={values} />
                                            </div>
                                        )
                                    default:
                                        return (
                                            <Image key={`${asset.id}-${asset_index}`} src={asset.pathname} alt='' width={100} height={100} />
                                        )
                                }
                            })
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Generation
