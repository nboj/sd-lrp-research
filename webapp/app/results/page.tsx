import ListGenerationServer from '@/components/generation/list_generations/ListGenerationsServer';
import Loading from './loading';
//import UploadAssets from '@/components/upload_assets/UploadAssets';

export const dynamic = 'force-static'

export default function Home() {
  return <Loading />
  return (
    <main>
      <ListGenerationServer />
      {/*<UploadAssets />*/}
    </main>
  );
}
