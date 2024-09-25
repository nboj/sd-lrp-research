import { sql } from "@vercel/postgres"
import ListGenerations from "../list_generations/ListGenerations"
import { Generation } from "@/lib/types"

const ListGenerationsServer = async () => {
    try {
        const { rows: generation_rows }: { rows: Generation[] } = await sql`
            SELECT * FROM generations
        `
        return <ListGenerations generations={generation_rows} />
    } catch {
        return (
            <div>Server Error.</div>
        )
    }
}

export default ListGenerationsServer
