import { Generation } from "@/lib/types";

function getRelevanceColor(value: number, min = -1, max = 1) {
    value = Math.max(min, Math.min(max, value));
    const normalized = (value - min) / (max - min) * 2 - 1;
    let red, green, blue;
    if (normalized > 0) {
        // Positive relevance
        red = 120 + Math.round(120 * normalized);
        green = 120 - Math.round(100 * normalized);
        blue = 120 - Math.round(10 * normalized);
    } else {
        // Negative relevance
        red = 120 + Math.round(100 * normalized);
        green = 120 + Math.round(10 * normalized);
        blue = 120 - Math.round(120 * normalized);
    }
    return `rgb(${red}, ${green}, ${blue})`;
}
type Props = Readonly<{
    generation: Generation;
    values: number[];
}>
const LRPText = ({ generation, values }: Props) => {
    return (
        <p>
            {
                JSON.parse(generation.prompt[0].replace('{', '[').replace('}', ']')).map((item: string, prompt_idx: number) => {
                    return (
                        <span key={`lrp-${prompt_idx}`} style={{ color: getRelevanceColor(values[prompt_idx], -5, 5) }}>{item}</span>
                    )
                })
            }
        </p>
    )
}

export default LRPText
