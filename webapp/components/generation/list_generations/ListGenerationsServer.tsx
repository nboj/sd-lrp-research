import { get_generations } from "@/actions/generation_actions"
import ListGenerations from "@/components/generation/list_generations/ListGenerations"

const ListGenerationsServer = async () => {
    const generations = await get_generations();
    if (generations.generations && !generations.error) {
        return <ListGenerations generations={generations.generations} />
    } else {
        console.log("Error: ", generations.error)
        return <div>Server Error.</div>
    }
}

export default ListGenerationsServer
