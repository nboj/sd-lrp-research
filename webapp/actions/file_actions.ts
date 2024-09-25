'use server'
import { db } from '@vercel/postgres';
import { put, del } from '@vercel/blob';

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
  const prompt: string = formData.get('prompt') as any
  const noise: File[] = formData.getAll('noise') as any[]
  const lrp1: File[] = formData.getAll('lrp1') as any[]
  const lrp2: File[] = formData.getAll('lrp2') as any[]
  if (noise.length != lrp1.length || noise.length != lrp2.length) {
    return {
      error: {
        message: "Image sets must have same length."
      }
    }
  }
  if (!prompt) {
    return {
      error: {
        message: "Invalad prompt provided."
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
      VALUES (${prompt})
      RETURNING id
    `).rows[0]
    for (let i = 0; i < length; i++) {
      const gen_task = async () => {
        const { id: iteration_id } = (await client.sql`
          INSERT INTO iterations (index, generation_id)
          VALUES (${i}, ${generation_id})
          RETURNING id
        `).rows[0]
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
        tasks.push(put_path(iteration_id, noise[i], `${parent_path}/noise/noise-${i}`, 'noise'))
        tasks.push(put_path(iteration_id, lrp1[i], `${parent_path}/lrp2/lrp-${i}`, 'lrp1'))
        tasks.push(put_path(iteration_id, lrp2[i], `${parent_path}/lrp1/lrp-${i}`, 'lrp2'))
      }
      gen_tasks.push(gen_task())
    }
    await Promise.all(gen_tasks)
    await Promise.all(tasks)
    // await del_asset_list(paths)
    // await client.sql`ROLLBACK`
    await client.sql`COMMIT`
    console.log("Success.")
  } catch (e) {
    console.log(e)
    await client.sql`ROLLBACK`
    await del_asset_list(paths)
  } finally {
    console.log((Date.now() - start) / 1000)
  }
}
