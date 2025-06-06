import React, { useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavoritesMoo";

// Import QR Scanner component
import QRScanner from "@/components/QRScanner";

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
  onBack,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const openQRScanner = () => setIsQRScannerOpen(true);
  const closeQRScanner = () => setIsQRScannerOpen(false);

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

        {/* AR QR Scanner Button */}
        <button
          onClick={openQRScanner}
          className="w-80 fixed left-1/2 bottom-5 transform -translate-x-1/2 bg-orange-500 text-white py-2 px-6 rounded-full font-medium text-lg flex flex-col items-center justify-center z-50 hover:bg-orange-600 transition-colors"
          style={{ boxShadow: "0 8px 10px rgba(255, 165, 0, 0.3)" }}
        >
          <span className="text-3xl font-bold">AR</span>
          <span className="text-sm font-normal">สแกน QR</span>
        </button>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={closeQRScanner}
        title={title}
      />
    </div>
  );
};

export default PlaceDetailScreen;