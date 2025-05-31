import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import BottomNavigation from "@/components/BottomNavigation";
import HeaderProfile from "@/components/header-profile/header-profile";
import ProfileSlideMenu from '@/components/ProfileSlideMenu';

const images = [
  {
    src: "/images/home/วัดสุทัศน์.jpg",
    title: "วัดสุทัศน์เทพวราราม",
    subtitle: "สงกรานต์เยือนสายน้ำพระ",
  },
  {
    src: "/images/home/วัดโพธิ์.jpeg",
    title: "วัดโพธิ์",
    subtitle: "แหล่งเรียนรู้พระพุทธศาสนา",
  },
  {
    src: "/images/home/วัดมังกร.jpg",
    title: "วัดมังกร",
    subtitle: "ขอพรเสริมสิริมงคล",
  },
  {
    src: "/images/home/วัดอรุณ.JPEG",
    title: "วัดอรุณ",
    subtitle: "วัดสวยริมเจ้าพระยา",
  },
  {
    src: "/images/home/ศาลเจ้าพ่อเสือ.jpg",
    title: "ศาลเจ้าพ่อเสือ",
    subtitle: "ขอพรความมั่งคั่งร่ำรวย",
  },
];

const newsData = [
  {
    img: "/images/home/วัดโพธิ์.jpeg",
    title: "วัดโพธิ์",
    desc1: "อยากเจอเนื้อคู่",
    desc2: "ลองมาที่วัดโพธิ์ด่วน",
    date: "8 เมษายน 2567",
  },
  {
    img: "/images/home/วัดอรุณ.jpeg",
    title: "วัดอรุณราชวราราม",
    desc1: "แต่งชุดไทยสวยๆ",
    desc2: "มาถ่ายรูปกันเถอะ",
    date: "15 เมษายน 2567",
  },
];

const newsData2 = [
  {
    img: "/images/home/ศาลเจ้าพ่อเสือ.jpg",
    title: "ศาลเจ้าพ่อเสือ",
    desc1: "ปีชงนี้ จัดเต็ม!!",
    desc2: "แก้ชงสนั่นให้ชีวิตปังไปเลย",
    date: "01-31 มี.ค. 68",
  },
  {
    img: "/images/home/วัดมังกร.jpg",
    title: "วัดมังกร",
    desc1: "ปีชงนี้ จัดเต็ม!!",
    desc2: "แก้ชงสนั่นให้ชีวิตปังไปเลย",
    date: "01-31 มี.ค. 68",
  },
];

const benefit = [
  {
    src: "/images/home/พิเศษ.jpg",
    title: "วัดสุทัศน์เทพวราราม",
    subtitle: "สงกรานต์เยือนสายน้ำพระ",
  },
];

export default function Dashboard() {
  // state สำหรับ NewsSection
  const router = useRouter();
  const [newsCategory, setNewsCategory] = useState<string>("ALL");

  const [current, setCurrent] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // เช็คการล็อกอิน (ใช้โค้ดเดิมที่คุณมี)
  useEffect(() => {
    const slider = document.getElementById("scrollable");
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    if (!slider) return;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);

  // กำหนดประเภทข้อมูลให้ category เป็น string
  const handleCategoryClick = (category: string) => {
    if (category === "sacred") {
      router.push("/sacred-places");
    } else if (category === "wish") {
      router.push("/wish-places");
    } else if (category === "ceremony") {
      router.push("/ceremonies");
    } else if (category === "activity") {
      router.push("/activities");
    } else if (category === "ticket") {
      router.push("/tickets");
    }
  };

  // กำหนดประเภทข้อมูลให้ category เป็น string
  const handleNewsCategoryChange = (category: string) => {
    setNewsCategory(category);
  };

  const goTo = (index: number) => {
    setCurrent(index);
  };

  return (
    <>
    
      <Head>
        <title>หน้าแรก - Nummu App</title>
        <meta
          name="description"
          content="Nummu App - แอพพลิเคชั่นสำหรับการท่องเที่ยววัดและสถานที่ศักดิ์สิทธิ์"
        />
      </Head>
      

      <div className="min-h-screen bg-gray-100 pb-20">
        {/* ส่วนหัว */}
        <div className="bg-[#FF7A05] text-white p-4 rounded-br-[140px]">
          <HeaderProfile onProfileClick={() => setIsMenuOpen(true)} />
          <div className="mt-4">
            <h2 className="text-white text-lg">
              Nummu นำใจ นำพาคุณ
              <br />
              ตามหาแหล่งที่พึ่งพาทางจิตใจและเข้าถึง
              <br />
              การไหว้พระ ขอพร ที่สะดวก ง่าย ในที่เดียว
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <div className="flex items-center bg-white rounded-full px-4 py-2">
              <svg
                className="w-6 h-6 [#FF7A05]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <input
                type="text"
                placeholder="ค้นหา..."
                className="flex-1 bg-transparent border-none focus:outline-none px-3 text-gray-700"
              />
              <svg
                className="w-6 h-6 [#FF7A05]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-8 overflow-x-auto pb-4">
            <div className="flex gap-3 px-2">
              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
                onClick={() => handleCategoryClick("sacred")}
              >
                <div className="mb-2">
                  <svg
                    className="w-10 h-10 text-orange-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-[#FF7A05] text-center text-xs font-medium">
                  สถานที่ศักดิ์สิทธิ์
                </p>
              </button>

              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
                onClick={() => handleCategoryClick("wish")}
              >
                <div className="mb-2">
                  <svg
                    className="w-10 h-10 text-orange-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <p className="text-[#FF7A05] text-center text-xs font-medium">
                  สถานที่ขอดวงพร
                </p>
              </button>

              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
                onClick={() => handleCategoryClick("ceremony")}
              >
                <div className="mb-2">
                  <svg
                    className="w-10 h-10 text-orange-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#FF7A05] text-center text-xs font-medium">
                  สถานที่พิธีกรรม
                </p>
              </button>

              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
                onClick={() => handleCategoryClick("activity")}
              >
                <div className="mb-2">
                  <svg
                    className="w-10 h-10 text-orange-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21v-2a4 4 0 00-3-3.87"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13a4 4 0 010 7.75"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#FF7A05] text-center text-xs font-medium">
                  สถานที่กิจกรรม
                </p>
              </button>

              {/* เพิ่มปุ่มซื้อตั๋ว */}
              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
                onClick={() => handleCategoryClick("ticket")}
              >
                <div className="mb-2">
                  <svg
                    className="w-10 h-10 text-orange-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 10V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    /> 
                  </svg>
                </div>
                <p className="text-[#FF7A05] text-center text-xs font-medium">
                  ซื้อตั๋ว
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          {/* News Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-orange-500">ข่าวสาร</h2>
            <button className="text-pink-500 text-sm">View All</button>
          </div>

          {/* News Categories */}
          <div className="flex space-x-1 mb-6 overflow-x-hidden pb-2">
            <button
              className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === "ALL"
                  ? "bg-pink-400 text-white"
                  : "bg-pink-100 text-pink-500"
              }`}
              onClick={() => handleNewsCategoryChange("ALL")}
            >
              ALL
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === "FESTIVAL"
                  ? "bg-pink-400 text-white"
                  : "bg-pink-100 text-pink-500"
              }`}
              onClick={() => handleNewsCategoryChange("FESTIVAL")}
            >
              FESTIVAL
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === "TRIVIA"
                  ? "bg-pink-400 text-white"
                  : "bg-pink-100 text-pink-500"
              }`}
              onClick={() => handleNewsCategoryChange("TRIVIA")}
            >
              TRIVIA
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === "ABOUT"
                  ? "bg-pink-400 text-white"
                  : "bg-pink-100 text-pink-500"
              }`}
              onClick={() => handleNewsCategoryChange("ABOUT")}
            >
              เกี่ยวกับเรา
            </button>
          </div>

          {/* News Cards */}
          <div className="space-y-4">
            <div className="w-full max-w-xl mx-auto">
              <div className="relative rounded-[30px] overflow-hidden">
                <img
                  src={images[current].src}
                  alt={images[current].title}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 text-white flex flex-col justify-center px-6">
                  <h2 className="text-2xl font-bold">
                    {images[current].title}
                  </h2>
                  <p className="text-sm">{images[current].subtitle}</p>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-4 gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-3 w-6 rounded-full transition-all duration-300 ${
                      idx === current ? "bg-pink-400 w-6" : "bg-pink-200 w-3"
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* รวมสถานที่ยอดฮิต */}
            <div className="flex items-center justify-between mb-4 pt-4">
              <h2 className="text-2xl font-bold text-orange-500">
                รวมสถานที่ยอดฮิต
              </h2>
            </div>
            <div className="relative w-full overflow-hidden">
              <div
                id="scrollable-popular"
                className="overflow-x-auto cursor-grab scroll-smooth hide-scrollbar"
              >
                <div className="flex space-x-4 w-max snap-x snap-mandatory">
                  {newsData.map((item, index) => (
                    <div
                      key={index}
                      className="min-w-[250px] max-w-[280px] flex-shrink-0 snap-start"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-md h-70 flex flex-col">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-60 object-cover"
                        />
                        <div className="p-4 flex flex-col flex-grow bg-[#FFDCE6]">
                          <div className="flex justify-between items-center mt-auto">
                            <h3 className="font-bold text-lg text-orange-500 line-clamp-2">
                              {item.title}
                            </h3>
                            <span className="text-orange-500 text-xs">
                              {item.desc1}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-orange-500 text-xs">
                              {item.date}
                            </span>
                            <span className="text-orange-500 text-xs">
                              {item.desc2}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* รวมสถานที่แก้ปีชง */}
            <div className="flex items-center justify-between mb-4 pt-4">
              <h2 className="text-2xl font-bold text-orange-500">
                รวมสถานที่แก้ปีชง
              </h2>
            </div>
            <div className="relative w-full overflow-hidden">
              <div
                id="scrollable-chinese-zodiac"
                className="overflow-x-auto cursor-grab scroll-smooth hide-scrollbar"
              >
                <div className="flex space-x-4 w-max snap-x snap-mandatory">
                  {newsData2.map((item, index) => (
                    <div
                      key={index}
                      className="min-w-[250px] max-w-[280px] flex-shrink-0 snap-start"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-md h-70 flex flex-col">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-60 object-cover"
                        />
                        <div className="p-4 flex flex-col flex-grow bg-[#FFDCE6]">
                          <div className="flex justify-between items-center mt-auto">
                            <h3 className="font-bold text-lg text-orange-500 line-clamp-2">
                              {item.title}
                            </h3>
                            <span className="text-orange-500 text-xs">
                              {item.desc1}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-orange-500 text-xs">
                              {item.date}
                            </span>
                            <span className="text-orange-500 text-xs">
                              {item.desc2}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 pt-4">
              <h2 className="text-2xl font-bold text-orange-500">
                พิเศษสำหรับคุณ
              </h2>
            </div>
            <div className="relative rounded-[30px] overflow-hidden">
              <img
                src={benefit[current].src}
                alt={benefit[current].title}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Navbar ด้านล่าง */}
        <footer className="mt-5 pb-20 pt-3 bg-[#FFF3E9] text-center">
          <div className="text-orange-500">
            ติดต่อสอบถามเพิ่มเติมหรือลงโฆษณา <br />
            086-8514818, 082-7372904
          </div>
        </footer>
        <BottomNavigation activePage="home" />
        <ProfileSlideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </>
  );
}
