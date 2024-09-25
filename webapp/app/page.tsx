import ListGenerationsServer from "@/components/list_generations_server/FetchGenerationsServer";
import UploadAssets from "@/components/upload_assets/UploadAssets";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <h1>Hello, World!</h1>
      <Suspense fallback={<p>loading...</p>}>
        <ListGenerationsServer />
      </Suspense>
      <UploadAssets />
    </main>
  );
}
