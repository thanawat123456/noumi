import React, { useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import Modal from "react-modal";
import { useFavorites } from "@/hooks/useFavoritesMoo";

export interface PlaceDetailProps {
  id: number;
  title: string;
  subtitle: string;
  openTime: string;
  description: string;
  image: string;
  videoPath: string;
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
    if (onBack) onBack();
    else window.history.back();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-120 object-cover rounded-bl-[50px] bg-white"
        />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Heart Button */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => toggleFavorite(id)}
            className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite(id)
                  ? "text-orange-500 fill-orange-500"
                  : "text-orange-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-4">
        {/* Title and Subtitle */}
        <div className="pb-3 mb-3 mt-5 space-y-2">
          {/* บรรทัดที่ 1: title และ ประติมากรรม */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-xl font-bold text-gray-900">ประติมากรรม</p>
          </div>
          <div className="border-b border-orange-300 pt-2" />

          {/* บรรทัดที่ 2: subtitle และ openTime */}
          <div className="flex justify-between items-center">
            <p className="font-medium text-gray-900">{subtitle}</p>
            <p className="text-md font-medium text-gray-900">{openTime}</p>
          </div>

          {/* เส้นขอบล่าง */}
          <div className="border-b border-orange-300 pt-2" />
        </div>

        {/* Description */}
        <div className="text-gray-700 text-sm mb-6 leading-relaxed text-justify">
          <p>{description}</p>
        </div>

        {/* AR Button */}
        <button
          onClick={openModal}
          className="w-80 fixed left-1/2 bottom-5 transform -translate-x-1/2 bg-orange-500 text-white py-2 px-6 rounded-full font-medium text-lg flex flex-col items-center justify-center z-50"
          style={{ boxShadow: "0 8px 10px rgba(255, 165, 0, 0.3)" }}
        >
          <span className="text-3xl font-bold">AR</span>
          <span className="text-sm font-normal">เรื่องเล่า</span>
        </button>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            padding: "0",
            borderRadius: "12px",
            overflow: "hidden",
            background: "black",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
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
              onError={(e) => console.error("Video playback error:", e)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-red-500 text-center p-4">
              ไม่พบวิดีโอสำหรับสถานที่นี้
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PlaceDetailScreen;
