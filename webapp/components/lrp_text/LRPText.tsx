import { Generation } from "@/lib/types";
import { getRelevanceColor } from "@/lib/utils";

type Props = Readonly<{
    generation: Generation;
    values: number[];
    className?: any;
    min?: number;
    max?: number;
}>
const LRPText = ({ generation, values, className, min = -1, max = 1 }: Props) => {
    return (
        <p className={className}>
            {
                JSON.parse(generation.prompt[0].replace('{', '[').replace('}', ']')).map((item: string, prompt_idx: number) => {
                    return (
                        <span key={`lrp-${prompt_idx}`} style={{ color: getRelevanceColor(values[prompt_idx], min, max) }}>{item}</span>
                    )
                })
            }
        </p>
    )
}

export default LRPText
