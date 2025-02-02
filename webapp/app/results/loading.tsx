'use client'
import styles from "@/app/results/loading.module.css"
import { Skeleton } from "@nextui-org/react";

const Loading = () => {
  return (
    <main className={styles.main}>
      {
        Array.from(Array(10)).map((_: number, index: number) => {
          return (
            <Skeleton key={`${index}-skel`} className={styles.skeleton}></Skeleton>
          )
        })
      }
    </main>
  )
}
export default Loading;
