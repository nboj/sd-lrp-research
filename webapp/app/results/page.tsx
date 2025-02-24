import ListGenerationServer from '@/components/generation/list_generations/ListGenerationsServer';
//import UploadAssets from '@/components/upload_assets/UploadAssets';

export const dynamic = 'force-static'

export default function Home() {
    return (
        <main>
            <ListGenerationServer />
            {/*<UploadAssets />*/}
        </main>
    );
}
