import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
// import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
// import HeaderProfile from "@/components/header-profile/header-profile";

// Declare model-viewer for TypeScript
// declare module 'react' {
//     namespace JSX {
//         interface IntrinsicElements {
//             'model-viewer': any;
//         }
//     }
// }

// Types
interface BuddhaStatueDetail {
  id: number;
  name: string;
  templeId: number;
  templeName: string;
  image: string;
  glbModel: string;
  benefits: string[];
  description: string;
  category: string;
  subcategory: string;
  openingHours: string;
  location: string;
  history: string;
  popular: boolean;
  views360Available: boolean;
}

const ARViewer = ({
  statue,
  onClose,
}: {
  statue: BuddhaStatueDetail;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load model-viewer script
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.async = true;
    script.onload = () => {
      console.log("Model Viewer script loaded");
      setModelReady(true);
    };
    script.onerror = () => setError("ไม่สามารถโหลดสคริปต์ Model Viewer ได้");
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          setError("กรุณาเข้าใช้งานผ่าน HTTPS เพื่อใช้งานกล้อง");
          setIsLoading(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
              videoRef.current!.play();
              resolve();
            };
          });
        }

        // Wait for model-viewer to be ready
        const waitForModel = () => {
          if (modelReady) {
            setTimeout(() => {
              setIsLoading(false);
            }, 1000); // Give extra time for model to load
          } else {
            setTimeout(waitForModel, 100);
          }
        };
        waitForModel();
      } catch (err) {
        console.error("Error starting camera:", err);
        if (err instanceof Error && err.name === "NotAllowedError") {
          setError("กรุณาอนุญาตการเข้าถึงกล้องในการตั้งค่า Browser");
        } else if (err instanceof Error && err.name === "NotFoundError") {
          setError("ไม่พบกล้องในอุปกรณ์นี้ กรุณาตรวจสอบการตั้งค่ากล้อง");
        } else {
          setError(
            "ไม่สามารถเริ่มกล้องได้: " +
              (err instanceof Error ? err.message : "Unknown error")
          );
        }
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [modelReady]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleModelError = (e: any) => {
    console.error("Model viewer error:", e);
    setError(
      "ไม่สามารถเรนเดอร์โมเดล 3D ได้: " + (e.message || "Unknown error")
    );
  };

  const handleModelLoad = () => {
    console.log("Model loaded successfully");
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-red-500 text-white p-6 rounded-lg max-w-sm text-center mx-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={handleRetry}
              className="w-full bg-white text-red-500 px-4 py-2 rounded font-medium"
            >
              ลองใหม่
            </button>
            <button
              onClick={onClose}
              className="w-full bg-red-400 text-white px-4 py-2 rounded font-medium"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4"
        style={{ zIndex: 3 }}
      >
        <div className="max-w-[414px] mx-auto flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">AR Model Viewer</h2>
          <button
            onClick={onClose}
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            ปิด
          </button>
        </div>
      </div>

      {/* Camera Video */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />

        {/* 3D Model Overlay */}
        {!isLoading && modelReady && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 2 }}
          >
            <div className="w-full max-w-[414px] h-[600px] relative">
              <model-viewer
                src={statue.glbModel}
                alt={statue.name}
                camera-controls
                auto-rotate
                shadow-intensity="0"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                }}
                environment-image="neutral"
                camera-orbit="0deg 75deg 105%"
                field-of-view="30deg"
                onError={handleModelError}
                onLoad={handleModelLoad}
              >
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 p-3 rounded-lg">
                  <p className="text-white text-sm text-center">
                    ลากเพื่อหมุน • บีบนิ้วเพื่อซูม
                  </p>
                </div>
              </model-viewer>
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          style={{ zIndex: 3 }}
        >
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">กำลังโหลด AR Model...</p>
            <p className="text-sm mt-2 opacity-75">{statue.name}</p>
            <p className="text-xs mt-4 opacity-60">
              Model Ready: {modelReady ? "Yes" : "Loading..."}
            </p>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6"
        style={{ zIndex: 3 }}
      >
        <div className="max-w-[414px] mx-auto text-center">
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold text-lg">{statue.name}</h3>
            <p className="text-white text-sm mt-1">{statue.templeName}</p>
            <div className="flex justify-center mt-2">
              {statue.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="bg-yellow-400 text-orange-600 font-bold text-xs px-2 py-1 rounded-full mr-1"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Buddha Statue Detail Page
export default function BuddhaStatueInfo() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading } = useAuth();
  const [statue, setStatue] = useState<BuddhaStatueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  // const [isLiked, setIsLiked] = useState(false);
  const [showAR, setShowAR] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch Buddha statue data
  useEffect(() => {
    const fetchStatueData = async () => {
      if (!id || !isAuthenticated) return;

      try {
        // Simulated data based on ID
        const statueData = getStatueById(Number(id));
        setStatue(statueData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch statue data:", error);
        setLoading(false);
      }
    };

    fetchStatueData();
  }, [id, isAuthenticated]);

  // Simulated data function
  const getStatueById = (statueId: number): BuddhaStatueDetail | null => {
    const statues: BuddhaStatueDetail[] = [
      {
        id: 1,
        name: "พระศรีศากยมุนี",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/พระศรีศากยมุนี.jpeg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระกริ่งใหญ่.glb", // ใช้ไฟล์ที่มี
        benefits: ["ภาพรวมทั่วไป"],
        description: "พระพุทธรูปประธานในพระอุโบสถ",
        category: "พระสุขกรวัตตี์",
        subcategory: "ภาพรวม/ทั่วไป",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "พระพุทธศรีศากยมุนี พระประธานในพระวิหารหลวง วัดสุทัศนเทพวราราม เป็นพระหล่อด้วยโลหะ หน้าตักกว้าง 3 วา 1 คืบ ใหญ่กว่าพระพุทธรูปหล่อองค์อื่นเดิมที พระศรีศากยมุนี เป็นพระประธานอยู่ในพระวิหารหลวงวัดมหาธาตุเมืองสุโขทัย หล่อขึ้นในสมัยกรุงสุโขทัย แต่เมื่อได้เกิดการชำรุด พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกฯ จึงดำรัสสั่งให้เชิญย้ายลงมากรุงเทพฯ ประดิษฐานไว้กลางพระนคร",
        popular: true,
        views360Available: true,
      },
      {
        id: 2,
        name: "พระสุนทรีวาณี (ลอยองค์)",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/พระสุนทรีวาณี.jpeg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระสุนทรีวารี.glb", // ใช้ไฟล์ที่มี
        benefits: ["การงานการเรียน"],
        description: "พระพุทธรูปประจำวิหารด้านทิศตะวันออก",
        category: "พระพุทธรักษาวนมี",
        subcategory: "การเรียน / การงาน",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "พระสุนทรีวาณี มีหน้าที่คุ้มครองดูแลรักษาพระธรรมและพระไตรปิฎก  มีความเชื่อว่า ผู้ใดได้สวดพระคาถาบูชาพระสุนทรีวาณี จะทำให้เกิดสติปัญญาอย่างหลักแหลม นำมาสู่ความเจริญรุ่งเรืองในชีวิต โดยปรากฏขึ้นเป็นครั้งแรกในสมัยรัชกาลที่ 5 ที่วัดสุทัศน์ พุทธลักษณะเป็นเทพธิดามีพระวรกายสีขาวบริสุทธิ์ ฉลองพระองค์เปรียบดั่งนางกษัตรีย์ในศิลปะไทย",
        popular: true,
        views360Available: true,
      },
      {
        id: 3,
        name: "พระพุทธรังสีมุทราภัย",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/พระพุทธรังสีมุทราภัย.jpeg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระพุทธรังสีมุทราภัย.glb",
        benefits: ["การเรียนการงาน"],
        description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
        category: "พระพุทธรังสีมุทราภัย",
        subcategory: "การเรียน / การงาน",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "พระบาทสมเด็จพระนั่งเกล้าเจ้าอยู่หัวทรงโปรดให้นำกลักฝิ่นที่เหลือจากการหล่อพระพุทธรูปมาซ่อมแปลงพระพุทธรูปองค์นี้ที่ชำรุดอยู่ ต่อมาพระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัวทรงโปรดให้อัญเชิญมาประดิษฐานที่ศาลาการเปรียญ วัดสุทัศนเทพวราราม",
        popular: false,
        views360Available: true,
      },
      {
        id: 4,
        name: "พระพุทธเสฏฐมุนี",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/พระพุทธเสฏฐมุนี.jpeg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระพุทธเสฏฐมุนี.glb",
        benefits: ["คู่รักคู่ครอง"],
        description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
        category: "พระพุทธรังสีมุทราภัย",
        subcategory: "คู่รัก/คู่ครอง",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "พระพุทธรูปปางมารวิชัยสร้างขึ้นในสมัยพระบาทสมเด็จพระนั่งเกล้าเจ้าอยู่หัว รัชกาลที่ 3 ปี พ.ศ.2382 สร้างโดยการนำกลักสูบฝิ่นมาหลอมเป็นองค์พร เรียกกันว่าหลวงพ่อกลัดฝิ่นและในเวลาต่อมา พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว รัชกาลที่ 4 ทรงพระราชทาน นามว่า 'พระพุทธเสรฏฐมุนี' ขึ้นชื่อในการขอขมากรรม",
        popular: false,
        views360Available: true,
      },
      {
        id: 5,
        name: "พระพุทธตรีโลกเชษฐ์",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/พระพุทธตรีโลกเชษฐ์.jpg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระพุทธตรีโลกเชษฐ์.glb",
        benefits: ["การเรียนการงาน"],
        description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
        category: "พระพุทธรังสีมุทราภัย",
        subcategory: "การเรียน / การงาน",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "เป็นพระพุทธรูปสมัยรัตนโกสินทร์ พระบาทสมเด็จพระนั่งเกล้าเจ้าอยู่หัว รัชกาลที่ 3 ทรงโปรดให้สร้างขึ้นเป็นพระประธานประดิษฐาน ณ พระอุโบสถ และทรงโปรดอัญเชิญพระบรมสารีริกธาตุประดิษฐานไว้ภายในองค์พระผนังภายในเขียนภาพจิตรกรรมฝีมือช่างสมัยรัชกาลที่ 3 มีพระอสีติมหาสาวกจำนวน 80 องค์",
        popular: false,
        views360Available: true,
      },
      {
        id: 6,
        name: "พระกริ่งใหญ่",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/พระกริ่งใหญ่.jpeg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระกริ่งใหญ่.glb",
        benefits: ["สุขภาพโรคภัย"],
        description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
        category: "พระพุทธรังสีมุทราภัย",
        subcategory: "สุขภาพ / โรคภัย",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "หล่อด้วยสัมฤทธิ์ปิดทอง สร้างเมื่อ พ.ศ. 2534 โดยคณะศิษยานุศิษย์ในเจ้าประคุณสมเด็จพระพุทธโฆษาจารย์ (วีระ ภทฺทจารี) เจ้าอาวาสวัดสุทัศนเทพวรารามราชวรมหาวิหาร มีวัตถุประสงค์จัดสร้างเพื่อถวายสักการบูชาพระคุณในวาระที่เจ้าประคุณมีอายุวัฒนมงคลครบ 5 รอบ 60 ปี และยังเชื่อกันอย่างแน่วแน่ว่า สามารถช่วยรักษาโรคภัยไข้เจ็บต่างๆได้ทุกโรค",
        popular: false,
        views360Available: true,
      },
      {
        id: 7,
        name: "ท้าวเวสสุวรรณ",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/ท้าวเวสุวรรณ.jpg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/ท้าวเวสสุวรรณ.glb",
        benefits: ["การเงินธุรกิจ"],
        description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
        category: "พระพุทธรังสีมุทราภัย",
        subcategory: "การเงิน / ธุรกิจ",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "ท้าวเวสสุวรรณ เด่นเรื่อง บูชากราบไหว้ท้าวเวสสุวรรณจะมาขอพรเรื่องขอให้เจริญในหน้าที่การงาน ความเฮงความปัง รับทรัพย์ ขอโชคขอลาภ ป้องกันภยันตราย",
        popular: false,
        views360Available: true,
      },
      {
        id: 8,
        name: "พระรูปสมเด็จพระสังฆราช",
        templeId: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        image: "/images/temple-list/ท้าวเวสุวรรณ.jpg",
        glbModel:
          "https://storage.googleapis.com/noumi-3d-models/พระรูปสมเด็จพระสังฆราช.glb",
        benefits: ["การเรียนการงาน"],
        description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
        category: "พระพุทธรังสีมุทราภัย",
        subcategory: "การเรียน / การงาน",
        openingHours: "08.00 - 20.00 น.",
        location: "ช่วงเวลา เปิด-ปิด",
        history:
          "สมเด็จพระสังฆราช พระองค์ที่ 12 แห่งกรุงรัตนโกสินทร์ พ.ศ 2481-2487 อดีตเจ้าอาวาสวัดสุทัศนเทพวราราม พระองค์ที่ 4 ทรงได้รับการยกย่องเป็นพระคณาจารย์ที่โด่งดังในการสร้างพระกริ่งของเมืองไทย ส่งเริ่มสร้างมาตั้งแต่ปีพ.ศ 2441 ถึง 2486",
        popular: false,
        views360Available: true,
      },
    ];

    return statues.find((s) => s.id === statueId) || null;
  };

  // const handleLikeToggle = () => {
  //     setIsLiked(!isLiked);
  // };

  const handleARClick = () => {
    setShowAR(true);
  };

  const handleCloseAR = () => {
    setShowAR(false);
  };

  const handleView360Click = () => {
    console.log("Opening 360° view for", statue?.name);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!statue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">ไม่พบข้อมูลพระพุทธรูป</p>
          <Link
            href="/sacred-places-moo"
            className="text-orange-500 mt-4 inline-block"
          >
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  // AR Viewer
  if (showAR) {
    return <ARViewer statue={statue} onClose={handleCloseAR} />;
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section with Background Image */}
        <div className="relative h-[50vh]">
          {/* Background Image with Opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${statue.image})`,
              opacity: 0.3, // ปรับ opacity ให้ตรงกับ UI
              zIndex: 1,
            }}
          />

          {/* Dark overlay for better contrast */}
          <div
            className="absolute inset-0 bg-black"
            style={{
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.2)", // ลดความทึบเหลือ 20% (จาก 40%)
            }}
          />
          {/* Header */}
          {/* Header */}
          <div className="absolute top-0 left-0 right-0" style={{ zIndex: 20 }}>
            <div className="flex items-center justify-between relative pt-8 pb-4 px-5">
              <button
                onClick={() => router.back()}
                className="bg-[#FF8CB7] rounded-full w-8 h-8 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-white text-lg font-bold">AR มูใกล้ฉัน</h2>
              <div className="w-8 h-8"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Center AR Button Section */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="text-center text-white z-10 w-full max-w-sm">
              <button
                onClick={handleARClick}
                className="bg-[#FF8CB7] hover:bg-pink-600 mt-40 text-white py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 w-full"
              >
                <div className="text-xl font-bold mb-1">AR มูใกล้ฉัน</div>
                <div className="text-sm opacity-90">
                  การไหว้อยู่ที่ใจทำจิตใจให้ &quot;สงบและขอพร&quot;
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="flex-1">
          <div className="bg-white rounded-t-3xl -mt-8 relative z-10 p-6 h-full flex flex-col">
            {/* View 360° Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleView360Click}
                className="text-gray-400 text-base font-medium"
              >
                View 360°
              </button>
            </div>
            {/* Title and Subcategory */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {statue.name}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-gray-800 font-bold text-base">
                  {statue.subcategory}
                </p>
              </div>
            </div>

            {/* Pink line separator */}
            <div className="border-t-2 border-pink-300 mb-4"></div>

            {/* Location and Hours */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-gray-800 font-medium text-base">
                  {statue.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-800 font-bold text-base">
                  {statue.openingHours}
                </p>
              </div>
            </div>

            {/* Pink line separator */}
            <div className="border-t-2 border-pink-300 mb-4"></div>

            {/* Description/History */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-sm">
                {statue.history}
              </p>
            </div>

            {/* Temple Information */}
            {/* <div className="mb-6">
                        <h4 className="text-base font-bold text-gray-800 mb-2">ข้อมูลวัด</h4>
                        <p className="text-orange-600 font-bold text-base">{statue.templeName}</p>
                        <p className="text-gray-600 text-sm mt-1">{statue.description}</p>
                    </div> */}

            {/* Action Buttons */}
            {/* <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleARClick}
                            className="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
                        >
                            เปิด AR
                        </button>
                        <button
                            onClick={() => router.push(`/sacred-places-moo/${statue.templeId}`)}
                            className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
                        >
                            ดูวัดนี้
                        </button>
                    </div> */}
          </div>
        </div>

        <BottomNavigation activePage="ar" />
      </div>
    </>
  );
}
