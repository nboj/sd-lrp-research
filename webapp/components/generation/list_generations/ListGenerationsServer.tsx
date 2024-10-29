import { sql } from "@vercel/postgres"
import ListGenerations from "@/components/generation/list_generations/ListGenerations"
import { Asset, AssetType, Generation, Iteration } from "@/lib/types"

export const dynamic = 'force-dynamic'

const ListGenerationsServer = async () => {
    try {
        const { rows: generation_rows }: { rows: Generation[] } = await sql`
            SELECT * FROM generations
        `
        for (let i = 0; i < generation_rows.length; i++) {
            const { rows: iterations }: { rows: Iteration[] } = await sql`select * from iterations where generation_id = ${generation_rows[i].id} order by index desc limit 1`
            const { rows: assets }: { rows: Asset[] } = await sql`select * from assets where iteration_id = ${iterations[0].id}`
            generation_rows[i].display_image = assets.find((item) => item.asset_type === AssetType.NOISE)

            const { rows: iterations2 }: { rows: Iteration[] } = await sql`select * from iterations where generation_id = ${generation_rows[i].id} order by index asc limit 1`
            const { rows: assets2 }: { rows: Asset[] } = await sql`select * from assets where iteration_id = ${iterations2[0].id}`
            generation_rows[i].display_text = assets2.find((item) => item.asset_type === AssetType.TEXT_SCORES)
        }
        return <ListGenerations generations={generation_rows} />
    } catch {
        return (
            <div>Server Error.</div>
        )
    }
}

export default ListGenerationsServer