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
    const prompt: string = (formData.get('prompt') as any)?.split(' ').map((item: string) => item + " ");
    console.log(prompt)
    const noise_pred: File[] = formData.getAll('noise_pred') as any[]
    const noise: File[] = formData.getAll('noise') as any[]
    const lrp_noise1: File[] = formData.getAll('lrp_noise1') as any[]
    const lrp_noise2: File[] = formData.getAll('lrp_noise2') as any[]
    const text_key_scores: File[] = formData.getAll('text_key_scores') as any[]
    const text_value_scores: File[] = formData.getAll('text_value_scores') as any[]
    if (!prompt) {
        return {
            error: {
                message: "Invalid prompt provided."
            }
        }
    }
    if (noise.length != lrp_noise1.length
        || noise.length != lrp_noise2.length
        || noise.length != text_value_scores.length
        || noise.length != text_key_scores.length
        || noise.length != noise_pred.length) {
        console.log(noise.length)
        console.log(lrp_noise1.length)
        console.log(lrp_noise2.length)
        console.log(text_value_scores.length)
        console.log(text_key_scores.length)
        console.log(noise_pred.length)
        return {
            error: {
                message: "Image sets must have same length."
            }
        }
    }
    let text_keys_lrp: string[][] = []
    let text_values_lrp: string[][] = []
    for (let i = 0; i < text_key_scores.length; i++) {
        const keys_file = text_key_scores[i]
        const values_file = text_value_scores[i]
        const keys = await keys_file.text();
        const values = await values_file.text();
        const key_scores = keys.split('\n').slice(1, prompt.length + 1);
        const value_scores = values.split('\n').slice(1, prompt.length + 1);
        text_keys_lrp.push(key_scores);
        text_values_lrp.push(value_scores);
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
                tasks.push(put_path(iteration_id, lrp_noise1[i], `${parent_path}/lrp_noise/lrp_noise-${i}`, AssetType.NOISE_LRP1))
                tasks.push(put_path(iteration_id, lrp_noise2[i], `${parent_path}/lrp_noise/lrp_noise-${i}`, AssetType.NOISE_LRP2))
                tasks.push(put_scores(iteration_id, text_keys_lrp[i], AssetType.TEXT_KEY_SCORES))
                tasks.push(put_scores(iteration_id, text_values_lrp[i], AssetType.TEXT_VALUE_SCORES))
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
