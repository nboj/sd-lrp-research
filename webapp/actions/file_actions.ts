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
  const tasks = []
  try {
    await client.sql`BEGIN`
    const { id: generation_id } = (await client.sql`
      INSERT INTO generations (prompt)
      VALUES (${prompt})
      RETURNING id
    `).rows[0]
    for (let i = 0; i < length; i++) {
      const { id: iteration_id } = (await client.sql`
        INSERT INTO iterations (index, generation_id)
        VALUES (${i}, ${generation_id})
        RETURNING id
      `).rows[0]
      const put_paths = async () => {
        const parent_path = `generation-${generation_id}`
        const noise_blob = await put(`${parent_path}/noise/noise-${i}`, noise[i], { access: 'public' })
        paths.push(noise_blob.url)
        const lrp1_blob = await put(`${parent_path}/lrp2/lrp-${i}`, lrp2[i], { access: 'public' })
        paths.push(lrp1_blob.url)
        const lrp2_blob = await put(`${parent_path}/lrp1/lrp-${i}`, lrp1[i], { access: 'public' })
        paths.push(lrp2_blob.url)
        await client.sql`
          INSERT INTO assets (iteration_id, pathname, asset_type)
          VALUES (${iteration_id}, ${noise_blob.url}, 'noise')
        `
        await client.sql`
          INSERT INTO assets (iteration_id, pathname, asset_type)
          VALUES (${iteration_id}, ${lrp1_blob.url}, 'lrp1')
        `
        await client.sql`
          INSERT INTO assets (iteration_id, pathname, asset_type)
          VALUES (${iteration_id}, ${lrp2_blob.url}, 'lrp2')
        `
        console.log(iteration_id)
      }
      tasks.push(put_paths())
    }
    await Promise.all(tasks)
    console.log("Success.")
    await del_asset_list(paths)
    await client.sql`ROLLBACK`
  } catch (e) {
    console.log(e)
    await client.sql`ROLLBACK`
    await del_asset_list(paths)
  }
}
