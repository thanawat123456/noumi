import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import Modal from 'react-modal';
import { useFavorites } from '@/hooks/useFavoritesMoo';

// Bind modal to app element for accessibility
Modal.setAppElement('#__next');

export interface PlaceDetailProps {
  id: number;
  title: string;
  subtitle: string;
  openTime: string;
  description: string;
  image: string;
  videoPath: string; // Video path prop
  onBack?: () => void;
}

const PlaceDetailScreen: React.FC<PlaceDetailProps> = ({
  id,
  title,
  subtitle,
  openTime,
  description,
  image,
  videoPath,
  onBack,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
  
      {/* Content Card */}
      <div className="p-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative">
            <img src={image} alt={title} className="w-full h-64 object-cover" />
         <div className="absolute top-4 left-4">
            <button
              onClick={handleBack}
              className="bg-orange-500 text-white px-3 py-1 rounded-full flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
          </div>
            <button
              onClick={() => toggleFavorite(id)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite(id) ? 'text-orange-500 fill-orange-500' : 'text-orange-500'
                }`}text-orange-600 font-bold text-lg
              />
            </button>
          </div>

          {/* Info Section */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-600 mt-1">{subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">ภาพจิตกรรม</p>
                <p className="text-lg font-medium text-gray-800">{openTime}</p>
              </div>
            </div>
            <div className="h-1 bg-orange-500 rounded-full mb-6"></div>
            <p className="text-gray-700 leading-relaxed text-justify">{description}</p>
            <button
              onClick={openModal}
              className="w-full bg-orange-500 text-white py-4 rounded-full font-medium text-lg mt-8 flex items-center justify-center"
            >
              AR
              <span className="ml-2 text-sm font-normal">เรื่องเล่า</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            padding: '0',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'black',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <div className="bg-black">
          {/* Modal Header */}
          <div className="flex items-center justify-between bg-white p-4">
            <h2 className="text-lg font-medium text-gray-700">{title}</h2>
            <button onClick={closeModal} className="p-2">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          {/* Video Player */}
          {videoPath ? (
            <video
              src={videoPath}
              controls
              autoPlay
              className="w-full h-auto"
              onError={(e) => console.error('Video playback error:', e)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-red-500 text-center p-4">ไม่พบวิดีโอสำหรับสถานที่นี้</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PlaceDetailScreen;