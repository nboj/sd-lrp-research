'use server'
import { db } from '@vercel/postgres';
import { put, del } from '@vercel/blob';
import { AssetType } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const del_asset_list = async (paths: string[]) => {
  const tasks = []
  for (let i = 0; i < paths.length; i++) {
    console.log(`Deleting: ${paths[i]}`)
    tasks.push(del(paths[i]))
  }
  await Promise.all(tasks)
}

export const upload = async (_: any, formData: FormData) => {
  const start = Date.now()
  const prompt: string = (formData.get('prompt') as any)?.split(',').map((item: any) => item ? item : ',')
  const noise_pred: File[] = formData.getAll('noise_pred') as any[]
  const noise: File[] = formData.getAll('noise') as any[]
  const lrp_noise: File[] = formData.getAll('lrp_noise') as any[]
  const lrp_text_files: File[] = formData.getAll('lrp_text') as any[]
  if (noise.length != lrp_noise.length || noise.length != lrp_text_files.length || noise.length != noise_pred.length) {
    return {
      error: {
        message: "Image sets must have same length."
      }
    }
  }
  let lrp_text: string[][] = []
  for (let i = 0; i < lrp_text_files.length; i++) {
    const text_file = lrp_text_files[i]
    const text_scores = (await text_file.text()).trim().split('\n')
    lrp_text.push(text_scores)
  }
  if (!prompt) {
    return {
      error: {
        message: "Invalid prompt provided."
      }
    }
  }
  const client = await db.connect()
  const length = noise.length

  /**
   * Insert into postgres and blob
   **/
  const paths: any = []
  const tasks: any = []
  const gen_tasks: any = []
  try {
    await client.sql`BEGIN`
    const { id: generation_id } = (await client.sql`
      INSERT INTO generations (prompt)
      VALUES (ARRAY[${prompt}])
      RETURNING id
    `).rows[0]
    for (let i = 0; i < length; i++) {
      const gen_task = async () => {
        const { id: iteration_id } = (await client.sql`
          INSERT INTO iterations (index, generation_id)
          VALUES (${i}, ${generation_id})
          RETURNING id
        `).rows[0]
        const put_scores = async (iteration_id: any, scores: string[], type: string) => {
          await client.query(`
            INSERT INTO assets (iteration_id, text_relevance, asset_type)
            VALUES ($1, ARRAY[$2], $3)
          `, [iteration_id, scores, type])
          console.log(iteration_id)
        }
        const put_path = async (iteration_id: any, file: File, path: string, type: string) => {
          const noise_blob = await put(path, file, { access: 'public' })
          paths.push(noise_blob.url)
          await client.sql`
            INSERT INTO assets (iteration_id, pathname, asset_type)
            VALUES (${iteration_id}, ${noise_blob.url}, ${type})
          `
          console.log(iteration_id)
        }
        const parent_path = `generation-${generation_id}`
        tasks.push(put_path(iteration_id, noise[i], `${parent_path}/noise/noise-${i}`, AssetType.NOISE))
        tasks.push(put_path(iteration_id, noise_pred[i], `${parent_path}/noise_pred/noise_pred-${i}`, AssetType.NOISE_PRED))
        tasks.push(put_path(iteration_id, lrp_noise[i], `${parent_path}/lrp_noise/lrp_noise-${i}`, AssetType.NOISE_LRP))
        tasks.push(put_scores(iteration_id, lrp_text[i], AssetType.TEXT_SCORES))
      }
      gen_tasks.push(gen_task())
    }
    await Promise.all(gen_tasks)
    await Promise.all(tasks)
    // await del_asset_list(paths)
    // await client.sql`ROLLBACK`
    await client.sql`COMMIT`
    revalidatePath('/results')
    console.log("Success.")
  } catch (e) {
    console.log(e)
    await client.sql`ROLLBACK`
    await del_asset_list(paths)
  } finally {
    console.log((Date.now() - start) / 1000)
  }
}
