import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface VideoPlayerScreenProps {
  videoPath: string;
  title: string;
  onBack: () => void;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ videoPath, title, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-medium text-gray-700">{title}</h1>
      </div>

      {/* Video Player */}
      <div className="p-4">
        <div className="bg-black rounded-3xl overflow-hidden shadow-lg">
          <video
            src={videoPath}
            controls
            autoPlay
            className="w-full h-auto"
            onError={(e) => console.error('Video playback error:', e)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerScreen;