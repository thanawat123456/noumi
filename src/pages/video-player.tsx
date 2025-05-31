import { useRouter } from 'next/router';
import VideoPlayerScreen from '@/components/VideoPlayerScreen';

export default function VideoPlayerPage() {
  const router = useRouter();
  const { videoPath, title } = router.query;

  return (
    <VideoPlayerScreen
      videoPath={videoPath as string}
      title={title as string}
      onBack={() => router.back()}
    />
  );
}