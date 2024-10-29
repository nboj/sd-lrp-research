import FetchGenerations from '@/components/generation/list_generations/ListGenerationsServer';
import UploadAssets from '@/components/upload_assets/UploadAssets';

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main>
      <FetchGenerations />
      {/*<UploadAssets />*/}
    </main>
  );
}
