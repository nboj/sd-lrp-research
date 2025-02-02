'use server'
import { Asset, AssetType, FullGeneration, FullIteration, Generation, Iteration } from "@/lib/types"
import { db } from "@vercel/postgres"

export const get_full_generation = async (generation_id: string) => {
  const client = await db.connect()
  const { rows: generation_rows }: { rows: Generation[] } = await client.sql`
    SELECT * FROM generations
    WHERE id = ${generation_id}
  `
  const full_generation: FullGeneration = {
    generation: generation_rows[0],
    iterations: []
  }
  const { rows: iteration_rows }: { rows: Iteration[] } = await client.sql`
    SELECT * FROM iterations
    WHERE generation_id = ${generation_id}
    ORDER BY index
  `
  for (let i = 0; i < iteration_rows.length; i++) {
    const full_iteration: FullIteration = {
      iteration: iteration_rows[i],
      assets: []
    }
    const { rows: asset_rows }: { rows: Asset[] } = await client.sql`
      SELECT * FROM assets
      WHERE iteration_id = ${full_iteration.iteration.id}
    `
    full_iteration.assets.push(...asset_rows)
    full_generation.iterations.push(full_iteration)
  }
  return full_generation
}

export const get_generations = async () => {
  try {
    const client = await db.connect()
    const { rows: generation_rows }: { rows: Generation[] } = await client.sql`
      SELECT * FROM generations
    `
    for (let i = 0; i < generation_rows.length; i++) {
      const { rows: iterations }: { rows: Iteration[] } = await client.sql`select * from iterations where generation_id = ${generation_rows[i].id} order by index desc limit 1`
      const { rows: assets }: { rows: Asset[] } = await client.sql`select * from assets where iteration_id = ${iterations[0].id}`
      generation_rows[i].display_image = assets.find((item) => item.asset_type === AssetType.NOISE)

      const { rows: iterations2 }: { rows: Iteration[] } = await client.sql`select * from iterations where generation_id = ${generation_rows[i].id} order by index asc limit 1`
      const { rows: assets2 }: { rows: Asset[] } = await client.sql`select * from assets where iteration_id = ${iterations2[0].id}`
      generation_rows[i].display_text = assets2.find((item) => item.asset_type === AssetType.TEXT_SCORES)
    }
    return { generations: generation_rows }
  } catch (e: any) {
    return { error: e }
  }
}
