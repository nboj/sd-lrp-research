import { Asset, AssetType, FullGeneration, FullIteration } from "@/lib/types";
import Image from "next/image";
const sort_assets = (assets: Asset[]) => {
    return assets.sort((item) => item.asset_type == AssetType.NOISE ? 1 : item.asset_type == AssetType.LRP1 ? 0 : -1)
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
                            sort_assets(iteration.assets).map((asset: Asset, asset_index: number) => (
                                <Image key={`${asset.id}-${asset_index}`} src={asset.pathname} alt='' width={100} height={100} />
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Generation
