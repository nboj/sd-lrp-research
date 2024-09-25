'use server'
import { Asset, FullGeneration, FullIteration, Generation, Iteration } from "@/lib/types"
import { sql } from "@vercel/postgres"

export const get_full_generation = async (generation_id: string) => {
  const { rows: generation_rows }: { rows: Generation[] } = await sql`
    SELECT * FROM generations
    WHERE id = ${generation_id}
  `
  const full_generation: FullGeneration = {
    generation: generation_rows[0],
    iterations: []
  }
  const { rows: iteration_rows }: { rows: Iteration[] } = await sql`
    SELECT * FROM iterations
    WHERE generation_id = ${generation_id}
    ORDER BY index
  `
  for (let i = 0; i < iteration_rows.length; i++) {
    const full_iteration: FullIteration = {
      iteration: iteration_rows[i],
      assets: []
    }
    const { rows: asset_rows }: { rows: Asset[] } = await sql`
      SELECT * FROM assets
      WHERE iteration_id = ${full_iteration.iteration.id}
    `
    full_iteration.assets.push(...asset_rows)
    full_generation.iterations.push(full_iteration)
  }
  return full_generation
}
