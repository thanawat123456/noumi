import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import BottomNavigation from "@/components/BottomNavigation";
import HeaderProfile from "@/components/header-profile/header-profile";
import ProfileSlideMenu from "@/components/ProfileSlideMenu";

const images = [
  {
    src: "/images/home/วัดสุทัศน์.jpg",
    title: "วัดสุทัศน์เทพวราราม",
    subtitle: "สงกรานต์เยือนสายน้ำพระ",
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

  const [current] = useState(0);
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

  // const goTo = (index: number) => {
  //   setCurrent(index);
  // };

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
          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="text-white max-w-md text-sm">
              <h5>
                Nummu นำใจ นำพาคุณ
                <br />
                ตามหาแหล่งที่พึ่งพาทางจิตใจและเข้าถึง
                <br />
                การไหว้พระ ขอพร ที่สะดวก ง่าย ในที่เดียว
              </h5>
            </div>
            <div className="w-30">
              <img
                src="/images/home-car.png"
                alt="รถนำทาง"
                className="w-full h-auto object-contain"
              />
            </div>
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
          <div
            className="mt-8 grid grid-cols-5 overflow-x-auto scrollbar-hide gap-3 pb-4"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div
              className="flex gap-4 min-w-max"
              style={{
                overflow: "hidden",
              }}
            >
              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2 w-[70px]"
                onClick={() => handleCategoryClick("sacred")}
              >
                <div className="mb-2">
                  <svg
                    width="42"
                    height="51"
                    viewBox="0 0 42 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2486_299)">
                      <path
                        d="M22.4807 0.986328C23.2816 1.10715 24.0961 1.18099 24.8836 1.35551C33.3105 3.19468 38.7893 8.25576 41.273 16.4783C42.5855 20.8413 42.0403 25.0835 40.2634 29.2317C38.3788 33.6283 35.9557 37.7228 33.2836 41.6764C32.0653 43.482 30.8807 45.3346 29.4874 46.9992C24.9172 52.4765 16.4768 52.2751 12.1893 46.5831C8.78356 42.0522 5.68068 37.3201 3.13645 32.2388C1.88452 29.7352 0.787407 27.1576 0.269138 24.3922C-0.262593 21.5193 0.0133689 18.6666 0.915292 15.9212C3.58068 7.85302 9.12683 2.97988 17.4797 1.28838C18.1595 1.14742 18.8595 1.08701 19.5461 0.986328C20.522 0.986328 21.5047 0.986328 22.4807 0.986328ZM20.9999 5.497C20.2057 5.56412 19.398 5.57084 18.6172 5.70508C12.3509 6.81261 7.97587 10.303 5.63356 16.2031C4.61048 18.7807 4.2201 21.479 4.88645 24.2311C5.47202 26.6274 6.50183 28.8558 7.63933 31.0373C9.97491 35.501 12.7547 39.6828 15.7364 43.737C18.3884 47.3415 23.6922 47.3013 26.3441 43.6766C27.5153 42.0724 28.6461 40.4413 29.7432 38.7901C32.2336 35.0513 34.5557 31.2186 36.2451 27.0301C37.2076 24.6405 37.672 22.2107 37.3018 19.6063C36.1576 11.5918 29.1643 5.50371 20.9999 5.49029V5.497Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M12.674 21.8215C12.6471 17.2437 16.3692 13.5116 20.9933 13.4848C25.5702 13.4579 29.326 17.1564 29.3596 21.7275C29.3933 26.359 25.6846 30.1246 21.0673 30.1447C16.4433 30.1649 12.701 26.4597 12.6808 21.8282L12.674 21.8215ZM21 25.9764C23.3154 25.9764 25.2 24.0969 25.1933 21.7879C25.1865 19.5057 23.2952 17.6464 21 17.6598C18.6981 17.6732 16.8269 19.5326 16.8336 21.8147C16.8336 24.0969 18.7183 25.9764 21.0067 25.9764H21Z"
                        fill="#FFBB7E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2486_299">
                        <rect
                          width="42"
                          height="50"
                          fill="white"
                          transform="translate(0 0.986328)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[#FFBB7E] text-center text-xs font-medium">
                  สถานที่
                  <br />
                  ศักดิ์สิทธิ์
                </p>
              </button>

              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2 w-[70px]"
                onClick={() => handleCategoryClick("wish")}
              >
                <div className="mb-2">
                  <svg
                    width="48"
                    height="49"
                    viewBox="0 0 48 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2486_303)">
                      <path
                        d="M-9.69507e-07 22.17C0.0638713 21.9657 0.127744 21.7613 0.198003 21.5569C0.683432 20.1966 1.62235 19.3153 3.002 18.8938C6.16367 17.9295 9.32535 16.9587 12.4934 16.0072C12.8192 15.9114 12.9725 15.7517 13.0747 15.4388C14.1349 12.2392 15.208 9.04602 16.281 5.85283C16.9006 4.01994 18.3441 2.94703 20.1581 2.97896C22.0423 3.00451 23.5114 4.11574 24.0798 5.95502C25.0443 9.09711 26.0152 12.2456 26.9541 15.4005C27.0691 15.7836 27.2607 15.9497 27.6184 16.0647C30.7417 17.0545 33.8587 18.0508 36.9757 19.0535C38.8088 19.6474 39.9329 21.1163 39.9457 22.93C39.9585 24.7821 38.8663 26.2956 37.0267 26.8959C33.8715 27.9241 30.7034 28.9332 27.5353 29.9295C27.1904 30.038 27.0435 30.2169 26.9349 30.5426C25.9321 33.723 24.9166 36.9034 23.8882 40.0774C23.3389 41.7762 22.1573 42.7852 20.3816 42.9513C18.6571 43.111 17.3094 42.3957 16.4343 40.8821C16.2555 40.5756 16.1405 40.2243 16.0319 39.8858C15.0228 36.7501 14.02 33.6208 13.0299 30.4787C12.9277 30.1594 12.7681 30.0061 12.4551 29.9039C9.35729 28.8821 6.27864 27.822 3.17445 26.8193C1.52016 26.2829 0.427943 25.2738 0.0510968 23.5431C0.0510968 23.5175 0.0127735 23.4984 -0.0127754 23.4792C-0.0127754 23.045 -0.0127754 22.6043 -0.0127754 22.17H-9.69507e-07ZM35.9601 23.045C35.711 22.9428 35.5832 22.8853 35.4555 22.847C32.0064 21.7166 28.5573 20.5798 25.1018 19.4622C24.2715 19.194 23.7733 18.6703 23.5178 17.8337C22.5022 14.4617 21.4675 11.0897 20.4327 7.72404C20.3752 7.53245 20.305 7.34725 20.222 7.07902C20.1453 7.28977 20.0942 7.4175 20.0495 7.54522C18.8615 10.9811 17.6671 14.4106 16.4982 17.8464C16.2044 18.7022 15.6806 19.2259 14.8056 19.4814C12.2635 20.2286 9.73413 21.0205 7.1984 21.7932C6.18922 22.0998 5.18004 22.4127 4.08144 22.7512C4.36247 22.8598 4.5477 22.93 4.73293 22.9939C8.10539 24.1626 11.4778 25.3377 14.8567 26.4808C15.7126 26.7746 16.2363 27.3047 16.5046 28.1732C17.1433 30.2616 17.8204 32.3371 18.491 34.4127C18.9573 35.8752 19.4299 37.3377 19.9281 38.8896C20.024 38.6405 20.0878 38.4872 20.1389 38.3276C21.2695 34.9236 22.4064 31.5261 23.5114 28.1157C23.786 27.2664 24.3034 26.7363 25.1593 26.4872C26.0727 26.219 26.9733 25.9188 27.8802 25.6251C30.5373 24.7757 33.1944 23.9263 35.9601 23.0386V23.045Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M41.4403 0.986367C42.4239 1.33123 42.9094 2.05928 43.0946 3.06194C43.2096 3.70696 43.4204 4.33283 43.5545 4.97147C43.6184 5.26524 43.7589 5.38019 44.0335 5.43767C44.8383 5.62288 45.6367 5.82724 46.4351 6.03799C47.3804 6.28706 47.9872 7.04704 47.9936 7.96029C48.0064 8.87993 47.4251 9.65268 46.4798 9.91452C45.6559 10.1444 44.8128 10.3232 43.9888 10.5595C43.8228 10.6042 43.6311 10.7958 43.58 10.9619C43.3437 11.7666 43.1585 12.5904 42.9413 13.4079C42.6794 14.385 41.9385 14.9789 40.9868 14.9725C40.0607 14.9725 39.3134 14.385 39.0515 13.4334C38.8279 12.6223 38.6236 11.8049 38.4383 10.981C38.3744 10.6937 38.2403 10.5659 37.9657 10.4957C37.18 10.3041 36.3944 10.087 35.6152 9.8762C34.5868 9.5952 33.9864 8.82884 34.0056 7.84533C34.0247 6.88738 34.6507 6.17849 35.679 5.92942C36.4391 5.7506 37.1928 5.55263 37.9593 5.39935C38.2467 5.34188 38.3808 5.22053 38.4447 4.93315C38.5852 4.27535 38.796 3.63671 38.9237 2.97892C39.109 1.98903 39.62 1.2993 40.5908 0.97998H41.4339L41.4403 0.986367Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M38.9749 48.9863C38.0934 48.916 37.4547 48.4881 37.1162 47.6515C36.6116 46.3934 36.1198 45.1289 35.596 43.8772C35.5066 43.6664 35.2894 43.4493 35.0786 43.3535C33.8842 42.8234 32.6707 42.3253 31.4635 41.8144C30.5118 41.412 30.0008 40.6968 30.0263 39.8282C30.0519 38.9341 30.5756 38.2763 31.5529 37.9059C32.7345 37.4589 33.9226 37.0246 35.0914 36.552C35.3022 36.469 35.5257 36.2518 35.6152 36.0411C36.1134 34.866 36.5733 33.6717 37.0523 32.4839C37.4355 31.5195 38.1253 31.0022 39.0004 30.9958C39.8755 30.9958 40.578 31.5131 40.9613 32.4647C41.4467 33.6654 41.9066 34.8724 42.4112 36.0666C42.4942 36.2646 42.6986 36.4754 42.903 36.5584C44.0974 37.0629 45.2982 37.5291 46.5054 38.0081C47.4571 38.3913 47.9872 39.081 47.9936 39.9623C47.9936 40.8373 47.4635 41.5525 46.5182 41.9293C45.3429 42.3955 44.1804 42.8809 42.9988 43.3279C42.6794 43.4493 42.4942 43.6217 42.3729 43.941C41.8938 45.1928 41.3892 46.4381 40.8782 47.6771C40.5333 48.5137 39.8882 48.9288 38.9812 48.9799L38.9749 48.9863Z"
                        fill="#FFBB7E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2486_303">
                        <rect
                          width="48"
                          height="48"
                          fill="white"
                          transform="translate(0 0.986328)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[#FFBB7E] text-center text-xs font-medium">
                  ขอตามพร
                </p>
              </button>

              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2 w-[70px]"
                onClick={() => handleCategoryClick("ceremony")}
              >
                <div className="mb-2">
                  <svg
                    width="48"
                    height="49"
                    viewBox="0 0 48 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2486_321)">
                      <path
                        d="M48 43.454C48 43.454 47.9466 43.4941 47.9332 43.5209C47.5858 44.9507 45.608 45.6322 44.3252 44.1489C42.8419 42.4384 42.0267 40.4874 42.0134 38.2157C42 34.6478 42 31.0932 42.0134 27.5253C42.0267 24.2781 41.078 21.3516 39.1403 18.7458C36 14.4964 32.8864 10.2469 29.7595 5.99746C29.1448 5.16896 28.343 4.83488 27.4878 5.06205C26.1114 5.43622 25.5635 7.02642 26.4321 8.21573C27.7016 9.95292 28.9978 11.6768 30.2806 13.4006C31.804 15.4585 33.314 17.5298 34.8508 19.5743C35.6258 20.6166 36.0134 21.7391 36 23.0487C35.9733 26.3494 36 29.6367 36 32.9373C36 33.8327 35.4922 34.5543 34.6904 34.8482C33.902 35.1422 33.0334 34.9017 32.4855 34.2603C32.1114 33.8193 32.0045 33.2981 32.0045 32.7369C32.0045 29.5832 32.0045 26.4295 32.0045 23.2759C32.0045 22.9952 32.0045 22.7013 31.9243 22.4474C31.6704 21.4986 30.735 20.8839 29.7862 21.0041C28.7706 21.1378 28.0356 21.8995 28.0223 22.9284C28.0089 25.4407 28.0223 27.9529 28.0223 30.4785C28.0223 32.6834 27.9822 34.8883 28.0624 37.0799C28.1425 39.5119 28.6904 41.8505 30.0267 43.9217C30.3742 44.4696 30.8285 44.9641 31.2829 45.4184C32.1247 46.2469 32.2316 47.4362 31.51 48.2781C30.7617 49.1333 29.5724 49.2269 28.6637 48.4384C27.0334 47.022 25.9911 45.2046 25.2428 43.2001C24.6013 41.5164 24.2405 39.7525 24.1069 37.9618C24.1069 37.8549 24.0802 37.748 23.9866 37.6411C23.9065 38.2959 23.8396 38.9373 23.7327 39.5788C23.2517 42.5988 22.196 45.3649 20.1381 47.6768C19.8307 48.0242 19.4833 48.3583 19.1091 48.6255C18.2539 49.2269 17.118 49.0264 16.4633 48.2246C15.8352 47.4496 15.8619 46.2603 16.6102 45.5788C18.4276 43.9351 19.2695 41.797 19.6971 39.4719C19.8976 38.336 19.9911 37.1734 20.0045 36.0242C20.0445 31.7347 20.0178 27.4318 20.0178 23.1422C20.0178 22.0732 19.4566 21.2848 18.5612 21.0576C17.2918 20.7235 16.0891 21.6055 16.049 22.9151C16.0223 24.0242 16.049 25.1333 16.049 26.2425C16.049 28.4474 16.049 30.6523 16.049 32.8438C16.049 34.2736 14.8864 35.2224 13.5635 34.9151C12.7082 34.7146 12.0535 33.9529 12.0535 33.0576C12.0535 29.4897 12.0401 25.9351 12.0535 22.3672C12.0535 21.3115 12.5479 20.4162 13.1626 19.5877C15.7684 16.0866 18.3742 12.5721 20.98 9.0576C21.1938 8.76361 21.4076 8.48299 21.6214 8.189C22.2762 7.26695 22.1158 6.05092 21.2606 5.38276C20.3653 4.70125 19.1359 4.86161 18.4276 5.78366C17.0646 7.60103 15.7416 9.43176 14.392 11.2491C12.588 13.7079 10.7973 16.1667 8.97996 18.5988C6.98886 21.258 6.01336 24.2246 6.02673 27.5387C6.05345 31.1066 6.05345 34.6612 6.02673 38.2291C6.01336 40.5409 5.17149 42.5587 3.56793 44.2291C2.72606 45.1111 1.51002 45.1779 0.681514 44.4028C-0.17372 43.6144 -0.200446 42.385 0.668151 41.4897C1.61693 40.4874 2.07127 39.3516 2.04454 37.9351C1.99109 34.4474 2.03118 30.973 2.03118 27.4852C2.03118 23.356 3.23385 19.6278 5.70601 16.3004C8.84633 12.0643 11.9733 7.80147 15.0869 3.55203C16.0757 2.17564 17.412 1.3204 19.1492 1.05314C19.2027 1.05314 19.2561 1.01305 19.3229 0.986328C19.7906 0.986328 20.2584 0.986328 20.7261 0.986328C20.9265 1.03978 21.1136 1.09323 21.314 1.13332C22.343 1.36049 23.2383 1.8282 23.9599 2.48299C24.4944 2.14891 24.9621 1.78811 25.4699 1.56094C26.0445 1.30704 26.6726 1.17341 27.2873 0.986328C27.755 0.986328 28.2227 0.986328 28.6904 0.986328C28.7439 1.01305 28.7973 1.05314 28.8641 1.05314C30.6013 1.30704 31.9376 2.17564 32.9666 3.57876C36.0668 7.80147 39.167 12.0376 42.294 16.2469C44.8062 19.6411 46.049 23.4229 46.0223 27.6456C46.0089 31.1868 46.0223 34.728 46.0223 38.2825C46.0223 39.405 46.3964 40.3405 47.0913 41.1957C47.4388 41.6099 47.7194 42.0776 48.0267 42.5186V43.454H48ZM19.8441 17.2625C22.1826 18.1445 23.5323 19.8015 24 22.1935C24.4677 19.7614 25.8441 18.1445 28.1425 17.2625C26.7528 15.3917 25.3898 13.5476 23.9866 11.6634C22.5702 13.5609 21.2205 15.3917 19.8307 17.2625H19.8441Z"
                        fill="#FFBB7E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2486_321">
                        <rect
                          width="48"
                          height="48"
                          fill="white"
                          transform="translate(0 0.986328)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[#FFBB7E] text-center text-xs font-medium">
                  สถานที่
                  <br />
                  พิธีกรรม
                </p>
              </button>

              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2 w-[70px]"
                onClick={() => handleCategoryClick("activity")}
              >
                <div className="mb-2">
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 54 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2486_308)">
                      <path
                        d="M34.5786 0.986328C35.4769 1.31036 36.4474 1.52301 37.2528 1.99894C39.3694 3.24445 40.4432 5.15828 40.4845 7.58854C40.5155 9.81629 40.5052 12.0339 40.4845 14.2616C40.4639 17.8463 37.5935 20.7221 33.9281 20.874C33.7113 20.874 33.4532 20.9854 33.2776 21.1271C32.0386 22.1499 30.8203 23.1929 29.6019 24.2359C27.9293 25.6535 26.1946 25.6535 24.5426 24.2156C23.3656 23.203 22.1989 22.1803 21.0115 21.1778C20.805 21.0056 20.4952 20.8841 20.2268 20.874C16.4065 20.8132 13.4742 17.907 13.4535 14.1604C13.4535 12.0542 13.4535 9.94793 13.4535 7.85182C13.4535 4.34819 15.6734 1.73566 19.1736 1.07746C19.2356 1.06734 19.2975 1.02683 19.3595 0.996454C24.4291 0.996454 29.4883 0.996454 34.5579 0.996454L34.5786 0.986328ZM27.0929 20.5094C28.2906 19.4968 29.4677 18.5754 30.5621 17.5526C31.4398 16.7324 32.3794 16.3679 33.5977 16.4185C35.0535 16.4793 35.9621 15.5375 35.9725 14.1098C35.9828 11.9934 35.9828 9.86692 35.9725 7.75056C35.9725 6.32278 35.0535 5.43169 33.5977 5.42156C31.9664 5.42156 30.3247 5.42156 28.6933 5.42156C25.8952 5.42156 23.0971 5.42156 20.299 5.42156C18.9981 5.42156 18.0069 6.28228 17.9966 7.48728C17.9656 9.77578 17.9759 12.0744 17.9966 14.373C17.9966 15.335 18.7296 16.1755 19.6795 16.378C20.0306 16.459 20.4126 16.4691 20.7843 16.4388C21.8994 16.3375 22.7771 16.7223 23.5927 17.4716C24.7078 18.5146 25.9055 19.4867 27.1033 20.5196L27.0929 20.5094Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M54 52.2144C53.9587 52.2954 53.9174 52.3663 53.8864 52.4473C53.5354 53.3687 52.7713 53.9459 51.8317 53.9763C50.8818 54.0067 50.0558 53.5105 49.6738 52.6093C49.1885 51.4853 48.5484 50.4727 47.6294 49.6322C43.2 45.6122 35.8073 47.1311 33.6287 52.427C33.1744 53.5409 32.2141 54.108 31.161 53.9561C30.1285 53.8042 29.3335 53.0245 29.2509 51.9815C29.2199 51.5866 29.3128 51.1511 29.4677 50.7866C31.2952 46.5539 34.5889 43.9819 39.1526 43.2021C44.5939 42.2705 49.0956 44.0122 52.4203 48.3968C53.0811 49.2677 53.4734 50.3208 53.9897 51.2929V52.2245L54 52.2144Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M12.3901 25.2891C16.7472 25.3093 20.2474 28.7826 20.2268 33.0659C20.2061 37.3189 16.6336 40.7617 12.2765 40.7415C7.96061 40.7111 4.46042 37.2379 4.47074 32.9849C4.48107 28.7016 8.02256 25.2688 12.3901 25.2992V25.2891ZM15.7147 33.0153C15.7147 31.1723 14.1969 29.6737 12.3384 29.6838C10.5006 29.6939 8.98279 31.1825 8.97246 32.9849C8.97246 34.8076 10.5006 36.3063 12.3694 36.2961C14.2279 36.2961 15.7147 34.8278 15.725 33.0052L15.7147 33.0153Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M41.6616 25.289C46.0291 25.3194 49.5189 28.7825 49.488 33.0659C49.457 37.3391 45.9155 40.7617 41.548 40.7313C37.2115 40.7009 33.7113 37.1973 33.7423 32.914C33.7732 28.6813 37.3354 25.2586 41.6719 25.2789L41.6616 25.289ZM41.6306 36.3062C43.4891 36.3062 44.9862 34.8379 45.0069 33.0254C45.0172 31.2128 43.4581 29.6838 41.6099 29.6939C39.7618 29.6939 38.2646 31.1723 38.2543 32.995C38.2543 34.8481 39.7411 36.3163 41.6306 36.3163V36.3062Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M12.3384 42.8679C17.7384 42.9287 22.6738 46.1285 24.522 50.8169C24.904 51.789 24.7182 52.7409 24.0057 53.3788C23.3346 53.9864 22.395 54.1383 21.5484 53.7636C20.9495 53.5003 20.5778 53.0446 20.33 52.4675C19.1323 49.6625 16.9331 48.0423 13.9388 47.4854C9.90173 46.7462 5.79236 48.8322 4.33653 52.4573C3.92353 53.5003 3.02525 54.037 2.00307 53.9459C1.01186 53.8547 0.154883 53.156 0.0206574 52.1637C-0.0412929 51.6979 0.0309825 51.1511 0.227158 50.7156C2.00307 46.6146 5.20383 44.1843 9.57133 43.2122C10.4696 43.0097 11.4092 42.9692 12.3384 42.8477V42.8679Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M15.7044 33.0153C15.7044 34.838 14.2176 36.2961 12.3488 36.3062C10.4799 36.3062 8.94149 34.8177 8.95182 32.995C8.95182 31.1926 10.4799 29.704 12.3178 29.6939C14.1866 29.6838 15.7044 31.1824 15.6941 33.0254L15.7044 33.0153Z"
                        fill="white"
                      />
                      <path
                        d="M41.6306 36.3061C39.7411 36.3061 38.244 34.8378 38.2543 32.9847C38.2543 31.162 39.7618 29.6937 41.6099 29.6836C43.4581 29.6836 45.0172 31.2025 45.0069 33.0151C44.9966 34.8277 43.4891 36.2959 41.6306 36.2959V36.3061Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2486_308">
                        <rect
                          width="54"
                          height="53"
                          fill="white"
                          transform="translate(0 0.986328)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[#FFBB7E] text-center text-xs font-medium">
                  สถานที่
                  <br />
                  กิจกรรม
                </p>
              </button>

              {/* เพิ่มปุ่มซื้อตั๋ว */}
              <button
                className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2 w-[70px]"
                onClick={() => handleCategoryClick("ticket")}
              >
                <div className="mb-2">
                  <svg
                    width="36"
                    height="46"
                    viewBox="0 0 36 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2754_1536)">
                      <path
                        d="M6.81722e-05 23.8071C-0.0106909 18.0485 0.365878 12.6425 1.16205 7.2793C1.5709 4.55494 3.48602 2.54639 6.20808 2.02288C8.19851 1.63827 10.1997 1.32844 12.2009 1.01861C13.4274 0.826304 14.2882 1.42459 14.6325 2.61049C15.0198 3.95665 15.9343 4.75793 17.3007 5.00365C18.6564 5.24938 19.8722 4.9075 20.7652 3.80707C21.0449 3.45451 21.2386 3.00579 21.3784 2.57844C21.7442 1.44596 22.605 0.836988 23.7885 1.01861C25.7574 1.31776 27.7263 1.6169 29.6845 2.00152C32.6647 2.59981 34.4938 4.60836 34.9026 7.58912C35.7849 13.9246 36.1399 20.2814 35.9678 26.6596C35.8494 31.1041 35.4729 35.5272 34.8058 39.9289C34.4292 42.4182 32.4173 44.4374 29.749 44.9502C27.7586 45.3349 25.7574 45.634 23.7562 45.9545C22.6372 46.1255 21.6689 45.5272 21.4107 44.4374C20.905 42.3113 18.5703 41.3925 16.6229 42.1404C15.6115 42.525 14.9552 43.2515 14.6432 44.2878C14.2559 45.5806 13.4705 46.1361 12.1256 45.9331C10.1244 45.634 8.11244 45.3349 6.13276 44.9182C3.30312 44.3306 1.50634 42.3007 1.10826 39.4267C0.376637 34.1383 -0.0322092 28.8178 6.81722e-05 23.8071ZM31.7717 27.4396C31.7933 27.3327 31.8148 27.29 31.8148 27.2366C32.0407 20.8156 31.6964 14.4267 30.7819 8.06989C30.599 6.81989 30.0933 6.27502 28.856 6.00793C27.8016 5.78357 26.7365 5.62331 25.6928 5.37759C25.0365 5.21733 24.5524 5.28143 24.2834 5.97588C24.2296 6.11477 24.1005 6.23229 24.0037 6.36049C20.7329 10.4203 14.2021 10.025 11.4693 5.59126C11.3509 5.38827 11.2541 5.22801 10.9636 5.29212C9.64024 5.55921 8.30611 5.77288 6.98273 6.05066C5.96062 6.26434 5.37963 6.92673 5.23976 7.96306C5.06761 9.29853 4.89547 10.6233 4.74484 11.9588C4.26068 16.3284 4.08853 20.7195 4.13157 25.1212C4.13157 25.8797 4.13157 26.649 4.13157 27.4182C4.33599 27.4289 4.43282 27.4396 4.52966 27.4502C5.63785 27.4502 6.75679 27.4289 7.86498 27.4502C9.07 27.4823 9.96301 28.3904 9.94149 29.5229C9.91997 30.666 9.01621 31.5314 7.81119 31.5421C7.1226 31.5421 6.42326 31.5421 5.73468 31.5421C5.30431 31.5421 4.88471 31.5421 4.35751 31.5421C4.65877 34.0849 4.9385 36.5421 5.23976 38.9994C5.37963 40.0998 5.98214 40.7302 7.05805 40.9438C8.33838 41.2002 9.61872 41.4139 10.8991 41.6703C11.2003 41.7344 11.3187 41.6276 11.4693 41.3925C12.911 39.1062 15.0306 37.899 17.7203 37.8135C20.6576 37.7173 22.9815 38.9246 24.5847 41.4139C24.6707 41.5421 24.8859 41.7024 25.0043 41.6703C26.3922 41.4246 27.7909 41.1896 29.168 40.8797C30.1041 40.666 30.642 40.025 30.7711 39.0635C30.9218 37.9096 31.0939 36.7558 31.223 35.5913C31.3737 34.2665 31.4812 32.931 31.6104 31.5421C31.3952 31.5421 31.2445 31.5421 31.0832 31.5421C30.1041 31.5421 29.1142 31.5528 28.1352 31.5421C27.1238 31.5314 26.2846 30.8263 26.1232 29.8754C25.8973 28.5507 26.8333 27.4609 28.2427 27.4502C29.4155 27.4396 30.5882 27.4502 31.7933 27.4502L31.7717 27.4396Z"
                        fill="#FFBB7E"
                      />
                      <path
                        d="M18 31.542C17.5158 31.542 17.0317 31.5526 16.5475 31.542C15.3963 31.5099 14.5248 30.6445 14.514 29.5334C14.5033 28.4116 15.321 27.5035 16.4722 27.4608C17.4835 27.418 18.4949 27.418 19.5062 27.4608C20.6575 27.5035 21.4859 28.4116 21.4752 29.5334C21.4644 30.6338 20.5822 31.5099 19.4417 31.542C18.9575 31.5526 18.4734 31.542 17.9892 31.542H18Z"
                        fill="#FFBB7E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2754_1536">
                        <rect
                          width="36"
                          height="45"
                          fill="white"
                          transform="translate(0 0.986328)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[#FFBB7E] text-center text-xs font-medium">
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
              {images[current] && (
                <a
                  href="https://www.facebook.com/WatSuthatBangkok/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative rounded-[30px] overflow-hidden cursor-pointer">
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
                </a>
              )}
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
                  {newsData.map((item, index) => {
                    const link =
                      item.title === "วัดโพธิ์"
                        ? "https://www.lemon8-app.com/jearakor/7323963209566700033?region=th"
                        : item.title === "วัดอรุณราชวราราม"
                        ? "https://www.lemon8-app.com/@dicexpatta/7407345939633029648?region=th"
                        : "#";

                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
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
                      </a>
                    );
                  })}
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
                  {newsData2.map((item, index) => {
                    const link =
                      item.title === "ศาลเจ้าพ่อเสือ"
                        ? "https://www.lemon8-app.com/@mugantai/7448460556933317121?region=th"
                        : item.title === "วัดมังกร"
                        ? "https://www.lemon8-app.com/@mintnyw/7457489921977106945?region=th"
                        : "#";

                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
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
                      </a>
                    );
                  })}
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
