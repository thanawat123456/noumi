/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import { useFavorites } from "@/hooks/useFavorites";

// Types
interface InformationProps {
  type: "temple" | "buddha";
  id: string | string[] | undefined;
}

interface SectionConfig {
  id: string;
  title: string;
  bgColor: string;
  contentBgColor: string;
  textColor: string;
  zIndex: number;
}

const InformationPage: React.FC<InformationProps> = ({ type, id }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionAnimation, setSectionAnimation] = useState<
    "entering" | "leaving" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [information, setInformation] = useState({
    id: 1,
    name: type === "temple" ? "วัดสุทัศน์เทพวราราม" : "พระพุทธรูปสำคัญ",
    image: "/api/placeholder/400/500",
    location:
      type === "temple"
        ? "แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร"
        : "วัดสุทัศน์เทพวราราม",
    openHours: "08.00 - 20.00 น.",
    type: type === "temple" ? "ภาพรวม / ทั่วไป" : "ภาพรวม / ทั่วไป",
    description: "ข้อมูลกำลังโหลด...",
    panorama: "/api/placeholder/100/100",
    map: "/api/placeholder/100/100",
    worshipGuide: {
      title: "ลำดับการไหว้",
      steps: ["กำลังโหลดข้อมูล..."],
    },
    chants: {
      title: "บทสวด",
      items: [
        {
          title: "กำลังโหลด...",
          text: "กำลังโหลดข้อมูล...",
          text2: "กำลังโหลดข้อมูล...",
          transliteration: "กำลังโหลด...",
        },
      ],
    },
    offerings: {
      title: "ของไหว้",
      items: [
        {
          name: "กำลังโหลด...",
          description: "กำลังโหลดข้อมูล...",
          description2: "กำลังโหลดข้อมูล...",
          image: "/api/placeholder/100/100",
        },
      ],
    },
    guidelines: {
      title: "ข้อห้าม / ข้อแนะนำ",
      dress: {
        title: "การแต่งกาย",
        description: "กำลังโหลดข้อมูล...",
        image: "/api/placeholder/300/200",
      },
      behavior: {
        title: "การวางตัว",
        description: "กำลังโหลดข้อมูล...",
        image: "/api/placeholder/300/200",
      },
      photography: {
        title: "การถ่ายรูป",
        description: "กำลังโหลดข้อมูล...",
        image: "/api/placeholder/300/200",
      },
    },
  });

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const fetchInformation = async () => {
      try {
        // ในแอพจริง นี่ควรเป็นการเรียก API
        // const response = await axios.get(`/api/${type}/${id}`);

        // ข้อมูลจำลอง
        if (type === "buddha") {
          // สร้างข้อมูลจำลองที่แตกต่างกันตาม ID
          const buddhaData = {
            1: {
              id: 1,
              name: "พระศรีศากยมุนี",
              image: "/images/temple-list/พระศรีศากยมุนี.jpg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "ภาพรวม / ทั่วไป",
              map: "/images/map/Map01พระพุทธศรีศากยมุนี.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/พระศรีศากยมุนี360.mov",
              description:
                "พระพุทธรูปประธานในพระอุโบสถ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชนทั่วประเทศ",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "พระพุทธศรีศากยมุนี",
                    text: "องค์พระประทานในยุคสุโขทัย",
                  },
                  {
                    title:
                      "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )",
                    text: "มะหาการุณิโก นาโถ หิตายะ สัพพะปาณินัง ปูเรตวา ปาระมี สัพพา ปัตโต สัมโพธิมุตตะมัง เอเตนะ สัจจะวัชเชนะ โหตุ เม ชะยะมังคะลัง ชะยันโต โพธิยา มูเล สักยานัง นันทิวัฑฒะโน เอวัง อะหัง วิชะโย โหมิ ชะยัสสุ ชะยะมังคะเล อะปะราชิตะปัลลังเก สีเส ปะฐะวิโปกขะเร อะภิเสเก สัพพะพุทธานัง อัคคัปปัตโต ปะโมทะติ สุนักขัตตัง สุมังคะลัง ปาภาตัง สุหุฏฐิตัง สุขะโณ สุมุหุตโต จะ สุยิฏฐัง พรัหมะจาริสุ ปะทักขิณัง กายะกัมมัง วาจากัมมัง ปะทักขิณัง ปะทักขิณัง มะโนกัมมัง ปะณิธี เต ปะทักขิณา ปะทักขิณานิ กัตวานะ ละภันตัตเถ ปะทักขิเณ ฯ",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "ถวายด้วยธูป / เทียน / ดอกบัว",
                    description: "และบริจากปัจจัยตามกำลังทรัพย์ ตามศรัทธา",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/srisakkaya/Icon_ภาพประกอบ-09.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "การแต่งกาย",
                  description:
                    "แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น",
                  image: "/images/srisakkaya/Icon_ภาพประกอบ-08.webp",
                },
              },
            },
            2: {
              id: 2,
              name: "พระสุนทรีวาณี (ลอยองค์)",
              image: "/images/temple-list/พระสุนทรีวาณี.jpeg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "การงาน / การเรียน",
              map: "/images/map/Map03พระสุนทรีวาณี.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/พระสุนทรีวาณี360.mov",
              description:
                "พระสุนทรีวาณีหรือลอยองค์ องค์นี้ประดิษฐานในพระวิหารหลวงวัดสุทัศน์เทพวราราม โดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวโปรดเกล้าฯ ให้เสด็จเป็นประธาน ประกอบพิธีเทกองและพุทธาภิเษก เมื่อวันที่ 7 ตุลาคม พ.ศ.๑๘๙๖ ซึ่งตรงกล่าวเป็นรูปแบบพิเศษครั้งแรก",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "พระสุนทรีวาณี",
                    text: "เทพนารีแห่งปัญญาในพระพุทธศาสนา",
                  },
                  {
                    title:
                      "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ ) มุนินทะ วะทะนัมพุชะ คัพภะสัมภะวะ สุนทะรี ปาณีนัง สะระณัง วาณี มัยหัง ปิณะยะตัง",
                    text: "ข้าพเจ้าขอน้อมบูชาพระบรมศาสดาสัมมาสัมพุทธเจ้า ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ ปราศจากโรคภัยไข้เจ็บทั้งปวง ขอให้มีสติปัญญาเฉียบแหลม และประสบความสำเร็จในการศึกษาและหน้าที่การงาน",
                  },
                  {
                    text: "“คาถาพระสุนทรีวาณี” หากบริกรรมสม่ำเสมอจะเกิดปัญญา พระเถระผู้ใหญ่มักแนะนำให้นวกภิกษุผู้เริ่มศึกษาพระธรรม บริกรรมคาถานี้เป็นนิตย์ ก่อให้เกิดสมาธิจิตตั้งมั่น",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "เครื่องประกอบแท่นบูชาประกอบด้วย กระถางธูป ๑ ชุด, เชิงเทียน ๑ คู่ แจกัน ๑ คู่",
                    description: "*จะเสริมด้วยเชิงกำยานก็ได้ตามสะดวก",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/sunthornvari/Icon_ภาพประกอบ-02.webp",
                  },
                  {
                    name: "ขนมกลิ่นหอม, สดนมและผลไม้",
                    description2: "**หลีกเลี่ยงเนื้อสัตว์",
                    image: "/images/sunthornvari/Icon_ภาพประกอบ-03.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "พระสุนทรีวาณี",
                  description: "เทพนารีแห่งปัญญาในพระพุทธศาสนา",
                  image: "/images/sunthornvari/Icon_ภาพประกอบ-01.webp",
                },
                description2:
                  "เหมาะแก่การขอให้ประทานพรในด้านสติปัญญาให้พ้นจากความขัดข้องหลงลืม มีความจำเป็นเลิศ",
              },
            },
            3: {
              id: 3,
              name: "พระพุทธรังสีมุทราภัย\n(หลวงพ่อเหลือ)",
              image: "/images/temple-list/พระพุทธรังสีมุทราภัย.jpeg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "โชคลาภ / วาสนา",
              map: "/images/map/Map06พระพุทธรังสีมุทราภัย.png",
              panorama: "",
              description:
                "พระพุทธรูปประจำวิหารด้านทิศใต้ เชื่อกันว่าหากมาขอพรด้านโชคลาภจะมีความสำเร็จ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชน",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน แปะแผ่นทอง",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "พระพุทธรังสีมุทราภัย",
                    text: "พระพุทธรูปปางประทานอภัยพระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัวทรงโปรดให้อัญเชิญมาประดิษฐานที่ศาลาการเปรียญวัดสุทัศนเทพวราราม และถวายพระนามว่า พระพุทธรังสีมุทราภัย โดยทั่วไปนิยมเรียกว่า หลวงพ่อเหลือ",
                  },
                  {
                    title:
                      "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )",
                  },
                  {
                    title: "บทสวดมนต์กราบพระรัตนตรัย",
                    text: "อะระหัง สัมมาสัมพุทโธ ภะคะวา พุทธัง ภะคะวันตัง อภิวาเทมิ สะวากขาโต ภะคะวะตา ธัมโม ธัมมัง นะมัสสามิ สุปะฏิปันโน ภะคะวะโต สาวะกะสังโฆ สังฆัง นะมามิ ",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "เครื่องประกอบแท่นบูชาประกอบด้วย ธูปเทียน ๑ ชุด, ดอกบัว, แผ่นทอง",
                    description: "*แผ่นทอง แปะเมื่อกราบไหว้เสร็จ",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/Icon_ภาพประกอบ-22.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "การแต่งกาย",
                  description:
                    "แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมหมวกเข้าภายในโบสถ์หรือเทวสถานด้านใน",
                  image: "/images/Icon_ภาพประกอบ-08.webp",
                },
              },
            },
            4: {
              id: 4,
              name: "ต้นพระศรีมหาโพธิ์",
              image: "/images/temple-list/ต้นพระศรีมหาโพธิ์.jpeg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "ภาพรวม / ทั่วไป",
              map: "/images/map/Map05ต้นพระศรีมหาโพธิ์.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/ลานต้นโพธิ์360.mov",
              description:
                "ต้นโพธิ์ศักดิ์สิทธิ์ภายในวัด ที่เชื่อกันว่าเป็นต้นโพธิ์ที่นำมาจากพุทธคยา สถานที่ตรัสรู้ของพระพุทธเจ้า",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: ["ท่องบทสวดและจึงตั้งจิตอธิฐาน", "หรือตั้งจิตอธิฐาน"],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "ต้นพระศรีมหาโพธิ์",
                    text: "มีความเชื่อว่าเมื่อมากราบไหว้ เคารพต้นพระศรีมหาโพธิ์จะทำให้ชีวิตสงบ",
                  },
                  {
                    title: "ไม่มีบทสวด",
                    text: "**แนะนำให้สวดและตั้งจิตอธิฐาน",
                    text2:
                      "คำบูชาพระรัตนตรัย อะระหัง สัมมาสัมพุทโธ ภะคะวา, พุทธัง ภะคะวันตัง อะภิวาเทมิ (กราบหนึ่งครั้ง) สวากขาโต ภะคะวะตา ธัมโม, ธัมมังนะมัสสามิ (กราบหนึ่งครั้ง) สุปะติปันโน ภะคะวะโต สาวะกะสังโฆ, สังฆัง นะมามิ (กราบหนึ่งครั้ง)",
                  },
                  {
                    title: "***หรือตั้งจิตอธิฐานขอพร",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "ต้นพระศรีมหาโพธิ์",
                  description:
                    "ต้นพระศรีมหาโพธิ์เป็นต้นโพธิ์ต้นที่เจ้าชายสิทธัตถะใช้นั่งบำเพ็ญเพียรเพื่อตรัสรู้เป็นพระพุทธเจ้า",
                  description2:
                    "มีความเชื่อว่าเมื่อมากราบไหว้เคารพต้นพระศรีมหาโพธิ์จะทำให้ชีวิตสงบ ชีวิตราบรื่นจิตใจร่มเย็น เป็นสุข ",
                  image: "/images/tonpho.png",
                },
              },
            },
            5: {
              id: 5,
              name: "พระพุทธตรีโลกเชษฐ์",
              image: "/images/temple-list/พระพุทธตรีโลกเชษฐ์.jpg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "โชคลาภ / วาสนา",
              map: "/images/map/Map07พระพุทธตรีโลกเชษฐ์.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/พระพุทธตรีโลกเชษฐ์360.mov",
              description:
                "พระพุทธรูปปางนาคปรก เชื่อกันว่าหากมาขอพรเรื่องสุขภาพจะหายจากโรคภัยไข้เจ็บ",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "พระพุทธตรีโลกเชษฐ์",
                    text: "พระพุทธตรีโลกเชษฐ์ พระพุทธรูปสมัยรัตนโกสินทร์  สร้างขึ้นเมื่อรัชกาลที่ 3 ผนังภายในเขียนภาพจิตรกรรมฝีมือช่างสมัยรัชกาลที่ 3 มีพระอสีติมหาสาวกจำนวน 80 องค์",
                  },
                  {
                    title:
                      "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "ถวายด้วยธูป / เทียน / ดอกบัว",
                    description: "และบริจากปัจจัยตามกำลังทรัพย์ ตามศรัทธา",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/Icon_ภาพประกอบ-09.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "การแต่งกาย",
                  description:
                    "แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมหมวกเข้าภายในโบสถ์หรือเทวสถานด้านใน",
                  image: "/images/Icon_ภาพประกอบ-08.webp",
                },
              },
            },
            6: {
              id: 6,
              name: "พระกริ่งใหญ่",
              image: "/images/temple-list/พระกริ่งใหญ่.jpeg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "สุขภาพ / โรคภัย",
              map: "/images/map/Map04พระกริ่งใหญ่.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/พระกริ่งใหญ่360.mov",
              description:
                "พระพุทธรูปปางลีลาศิลปะสุโขทัย เป็นพระพุทธรูปที่มีความงดงาม แสดงถึงการก้าวเดินอย่างสง่างาม เชื่อกันว่าหากสักการะแล้วจะประสบความสำเร็จในชีวิต",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "คาถาบูชาพระกริ่งใหญ่",
                    text: "สร้างเมื่อ พ.ศ. 2534 โดยคณะศิษยานุศิษย์ในเจ้าประคุณสมเด็จพระพุทธโฆษาจารย์",
                  },
                  {
                    title:
                      "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )",
                    text: "กิง กัมมัง กุสะลัง ยันตัง สัมพุทธะปฏิมยิทัง ปูชะนัง มะมะ อัชเชวัง กุสะลัง เอวะ สาธุกํ พุทโธ โย สัพพะปาณีนัง สะระณัง เขมะมุตตะมังติโลกะนาถะสัมพุทธัง วันทามิ ตัง สิเรนะหัง นัตถิ เม สะระณัง อัญญัง พุทโธ เม สะระณัง วะรัง อิมินา ปูชะเนเนวัง โหตุ เม ชะยะมังคะลัง ฯ",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "ถวายด้วยธูป / เทียน / ดอกบัว",
                    description: "และบริจากปัจจัยตามกำลังทรัพย์ ตามศรัทธา",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/gringyai/Icon_ภาพประกอบ-28.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "พระกริ่งใหญ่",
                  description:
                    "เชื่อกันว่า สามารถช่วยรักษาโรคภัยไข้เจ็บต่างๆได้ทุกโรค",
                  image: "/images/gringyai/Icon_ภาพประกอบ-27.webp",
                },
              },
            },
            7: {
              id: 7,
              name: "ท้าวเวสสุวรรณ",
              image: "/images/temple-list/ท้าวเวสุวรรณ.jpg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "การเงิน / ธุรกิจ",
              map: "/images/map/Map02ท้าวเวสสุวรรณ.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/ท้าวเวสุวรรณ360.mov",
              description:
                "พระพุทธรูปปางลีลาศิลปะสุโขทัย เป็นพระพุทธรูปที่มีความงดงาม แสดงถึงการก้าวเดินอย่างสง่างาม เชื่อกันว่าหากสักการะแล้วจะประสบความสำเร็จในชีวิต",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "ท้าวเวสสุวรรณ",
                    text: "เด่นเรื่อง บูชากราบไหว้ท้าวเวสสุวรรณจะมาขอพรเรื่องขอให้เจริญในหน้าที่การงาน",
                  },
                  {
                    title: "ตั้งคาถาบูชาท้าวเวสสุวรรณ",
                    text: "อิติปิโส ภะคะวา ยะมะราชาโน ท้าวเวสสุวรรณโณ มะระณัง สุขัง อะหัง สุคะโต นะโมพุทธายะ ท้าวเวสสุวรรณโณ จาตุมะหาราชิกา ยักขะพันตา ภัทภูริโต เวสสะ พุสะ พุทธัง อะระหัง พุทโธ ท้าวเวสสุวรรณโณ นะโม พุทธายะ (9 จบ) นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "ถวายด้วยธูป 9 ดอก / เทียน / ดอกกุหลาบ 9 ดอก",
                    description: "และบริจากปัจจัยตามกำลังทรัพย์ ตามศรัทธา",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/vessuwan/Icon_ภาพประกอบ-34.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "ท้าวเวสสุวรรณ",
                  description:
                    "ท้าวเวสสุวรรณ(ท้าวเวสสุวัน) ในภาษาพราหมณ์ เรียก ท้าวกุเวร ในพระพุทธศาสนาเรียก ท้าวไพสพ เป็นเจ้าแห่งอสูร ภูตผีปีศาจ ทรงอิทธิฤทธิ์",
                  description2:
                    "ขึ้นชื่อ เรื่องขอให้เจริญในหน้าที่การงาน ความเฮงความปัง รับทรัพย์ ขอโชคขอลาภ ป้องกันภยันตราย",
                  image: "/images/vessuwan/Icon_ภาพประกอบ-33.webp",
                },
              },
            },
            8: {
              id: 8,
              name: "หลวงพ่อกลักฝิ่น\nพระพุทธเสฏฐมุนี (จำลอง)",
              image: "/images/temple-list/พระพุทธเสฏฐมุนี.jpeg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "ความรัก / คู่ครอง",
              map: "/images/map/Map08หลวงพ่อกลักฝิ่น.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/หลวงพ่อกลักฝิ่น-พระพุทธเสฏฐมุนี(จำลอง)360.mov",
              description:
                "พระพุทธรูปปางลีลาศิลปะสุโขทัย เป็นพระพุทธรูปที่มีความงดงาม แสดงถึงการก้าวเดินอย่างสง่างาม เชื่อกันว่าหากสักการะแล้วจะประสบความสำเร็จในชีวิต",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "หลวงพ่อกลักฝิ่น",
                    text: "พระพุทธรูปปางมารวิชัยสร้างขึ้นในสมัย รัชกาลที่ 3 สร้างโดยการนำกลักสูบฝิ่นมาหลอมเป็นองค์พร เรียกกันว่าหลวงพ่อกลัดฝิ่นและในเวลาต่อมา",
                  },
                  {
                    title: "คาถาบูชาพระพุทธเสรฏฐมุนี (หลวงพ่อกลักฝิ่น)",
                    text: "อิมินา สักกาเรนะ พระพุทธเสรฏฐมุนี ปูเชมิ ทุติยัมปี อิมินา สักกาเรนะ พระพุทธเสรฏฐมุนี (หลวงพ่อกลักฝิ่น) ปูเชมิ ตติยัมปี อิมินา สักกาเรนะ พระพุทธเสรฏฐมุนี ปูเชมิ นะโมพุทธายะ ตะโม โชติปรายะโน ชะโย นิจจัง (ภาวนาเถิดกลับร้ายกลายเป็นดี ทุกประการแลฯ ) พุทธัง อาราธะนัง กะโรมิ ธัมมัง อาราธะนัง กะโรมิ สังฆัง อาราธะนัง กะโรมิ",
                  },
                  {
                    title: "บทสวดขอขมากรรม หลวงพ่อกลักฝิ่น",
                    text: "“นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ” (3 จบ) “อิมัง มิฉา อธิฐานัง ปันจะทะธาราปิ ทุติยัมปิ อิมัง มิฉา อธิฐานัง ปันจะทะธาราปิ ตะติยัมปิ อิมัง มิฉา อธิฐานัง ปันจะทะธาราปิ”",
                  },
                  {
                    text: "หลังกล่าวจบ ให้ตั้งจิตให้สงบแน่วแน่ และกล่าวคาถาบูชาต่อ “นะถอน โมถอน พุทถอน ธาถอน ยะถอน นะคลอน โมคลอน พุทคลอน ธาคลอน ยะคลอน ถอนด้วย นะโมพุทธายะ นะมามิยัง”",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "ถวายด้วยธูป / เทียน / ดอกบัว",
                    description: "และบริจากปัจจัย (ค่าครู) เหรียญ 5 บาท",
                    description2: "(ภายในวัดมีให้ ชุดละ 50 บาท)",
                    image: "/images/lakfhin/Icon_ภาพประกอบ-15.webp",
                  },
                  {
                    name: "คำกล่าวขอขมา / บทถอนคำสาบาน",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/lakfhin/Icon_ภาพประกอบ-16.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "แนะนำสำหรับ คนที่ดวงตก / ชีวิตติดขัด / หาคู่",
                  description:
                    "“พระพุทธเสรฏฐมุนี” ขึ้นชื่อในการขอขมากรรมแก้ไข ชีวิตติดขัด ปัญหาลุ่มเล้า หรือคนที่ไม่เจอคนคู่ที่แท้จริงสักที ลองมาตัดกรรม ถอนคำสาบาน",
                  image: "/images/lakfhin/Icon_ภาพประกอบ-14.webp",
                },
              },
            },
            9: {
              id: 9,
              name: "พระรูปสมเด็จพระสังฆราช\n(แพ ติสสเทโว ป.ธ.5)",
              image: "/images/temple-list/พระรูปสมเด็จพระสังฆราช.jpeg",
              location: "วัดสุทัศน์เทพวราราม",
              openHours: "08.00 - 20.00 น.",
              type: "การเรียน / การงาน",
              map: "/images/map/Map09พระรูปสมเด็จพระสังฆราช.png",
              panorama:
                "https://storage.googleapis.com/noumi-3d-models/พระรูปสมเด็จพระสังฆราช(แพติสสเทโวป.ธ.5)360.mov",
              description:
                "พระพุทธรูปปางลีลาศิลปะสุโขทัย เป็นพระพุทธรูปที่มีความงดงาม แสดงถึงการก้าวเดินอย่างสง่างาม เชื่อกันว่าหากสักการะแล้วจะประสบความสำเร็จในชีวิต",
              worshipGuide: {
                title: "ลำดับการไหว้",
                steps: [
                  "จุดธูปเทียน",
                  "กราบไหว้และท่องบทสวด",
                  "ปักธูปเทียน",
                  "กราบลา",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "พระรูปสมเด็จพระสังฆราช",
                    text: "อดีตเจ้าอาวาสวัดสุทัศนเทพวราราม พระองค์ที่ 4 ทรงได้รับการยกย่องเป็นพระคณาจารย์ที่โด่งดังในการสร้างพระกริ่งของเมืองไทย",
                  },
                  {
                    title:
                      "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "เครื่องประกอบแท่นบูชาประกอบด้วย ธูปเทียน ๑ ชุด, ดอกบัว, แผ่นทอง",
                    description: "*แผ่นทอง แปะเมื่อกราบไหว้เสร็จ",
                    description2: "(ภายในวัดมีให้)",
                    image: "/images/Icon_ภาพประกอบ-22.webp",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "การแต่งกาย",
                  description:
                    "แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมหมวกเข้าภายในโบสถ์หรือเทวสถานด้านใน",
                  image: "/images/Icon_ภาพประกอบ-08.webp",
                },
              },
            },
          } as const;

          if ((buddhaData as any)[Number(id)]) {
            setInformation((buddhaData as any)[Number(id)]);
          }
        } else if (type === "temple") {
          // ข้อมูลจำลองสำหรับวัด
          const templeData = {
            1: {
              id: 1,
              name: "วัดสุทัศน์เทพวราราม",
              image: "/api/placeholder/400/500",
              location: "แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร",
              openHours: "08.00 - 20.00 น.",
              type: "ภาพรวม / ทั่วไป",
              description:
                "วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร เป็นวัดที่พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช รัชกาลที่ 1 โปรดให้สร้างขึ้น",
              worshipGuide: {
                title: "ลำดับการเข้าวัด",
                steps: [
                  // "แต่งกายสุภาพเรียบร้อย",
                  // "เดินเข้าทางประตูวัดอย่างสงบสำรวม",
                  // "กราบพระประธานในพระอุโบสถ",
                  // "เวียนประทักษิณรอบพระอุโบสถ 3 รอบ",
                  "สักการะพระพุทธรูปสำคัญในวัด",
                ],
              },
              chants: {
                title: "บทสวด",
                items: [
                  {
                    title: "คำบูชาพระรัตนตรัย",
                    text: "อิมินา สักกาเรนะ, พุทธัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, ธัมมัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, สังฆัง ปูเชมิ ฯ",
                    transliteration:
                      "Iminā sakkārena, buddhaṃ pūjemi ฯ\nIminā sakkārena, dhammaṃ pūjemi ฯ\nIminā sakkārena, saṅghaṃ pūjemi ฯ",
                  },
                ],
              },
              offerings: {
                title: "ของไหว้",
                items: [
                  {
                    name: "ดอกไม้",
                    description: "ดอกบัว ดอกกุหลาบ ดอกดาวเรือง",
                    image: "/api/placeholder/100/100",
                  },
                  {
                    name: "ธูปเทียน",
                    description: "ธูป 3 ดอก เทียน 2 เล่ม",
                    image: "/api/placeholder/100/100",
                  },
                ],
              },
              guidelines: {
                title: "ข้อห้าม / ข้อแนะนำ",
                dress: {
                  title: "การแต่งกาย",
                  description:
                    "แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น",
                  image: "/api/placeholder/300/200",
                },
                behavior: {
                  title: "การวางตัว",
                  description:
                    "สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น",
                  image: "/api/placeholder/300/200",
                },
                photography: {
                  title: "การถ่ายรูป",
                  description:
                    "ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต",
                  image: "/api/placeholder/300/200",
                },
              },
            },
          };

          if ((templeData as any)[Number(id)]) {
            setInformation((templeData as any)[Number(id)]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch ${type} info:`, error);
        setLoading(false);
      }
    };

    fetchInformation();
  }, [id, isAuthenticated, type]);

  const { toggleFavorite, isFavorite } = useFavorites([
    { id: information.id, isFavorite: false },
  ]);

  const [showPanorama, setShowPanorama] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false);

  const handleFavoriteClick = () => {
    toggleFavorite(information.id);
  };

  // Handle section animations with cleanup
  useEffect(() => {
    if (sectionAnimation === "entering" || sectionAnimation === "leaving") {
      const timer = setTimeout(() => {
        if (sectionAnimation === "leaving") {
          setActiveSection(null);
        }
        setSectionAnimation(null);
      }, 300); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [sectionAnimation]);

  // Handle click outside to close section
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sectionRef.current &&
        !sectionRef.current.contains(event.target as Node) &&
        activeSection
      ) {
        handleCloseSection();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeSection]);

  const handleBackClick = () => {
    router.back();
  };

  const handleOpenSection = (section: string) => {
    setActiveSection(section);
    setSectionAnimation("entering");
    // Prevent scrolling of background content when overlay is active
    document.body.style.overflow = "hidden";
  };

  const handleCloseSection = () => {
    setSectionAnimation("leaving");
    // Re-enable scrolling when overlay is closed
    document.body.style.overflow = "auto";
  };

  const sectionConfigs: SectionConfig[] = [
    {
      id: "worshipGuide",
      title: "ลำดับการไหว้",
      bgColor: "bg-[#FFDCE6]",
      contentBgColor: "bg-[#FFDCE6]",
      textColor: "text-black",
      zIndex: 0,
    },
    {
      id: "chants",
      title: "บทสวด",
      bgColor: "bg-[#FFC800]",
      contentBgColor: "bg-[#FFC800]",
      textColor: "text-black",
      zIndex: 0,
    },
    {
      id: "offerings",
      title: "ของไหว้",
      bgColor: "bg-[#FF7A05]",
      contentBgColor: "bg-[#FF7A05]",
      textColor: "text-black",
      zIndex: 0,
    },
    {
      id: "guidelines",
      title: "ข้อห้าม / ข้อแนะนำ",
      bgColor: "bg-[#FFBB7E]",
      contentBgColor: "bg-[#FFBB7E]",
      textColor: "text-black",
      zIndex: 0,
    },
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "worshipGuide":
        return (
          <div>
            {/* Step-by-step guide with icons */}
            <div className="space-y-4 mb-6">
              {information.worshipGuide.steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-pink-100"
                >
                  <div className="flex items-center gap-3">
                    {/* Step number circle */}
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Step icon */}
                    <div className="flex-shrink-0 w-25 h-20 flex items-center justify-center">
                      {index === 0 && (
                        // จุดธูปเทียน - Incense and candle icon
                        <div className="w-20 h-20 mr-4">
                          <img
                            src="/images/Icon_ภาพประกอบ-10.webp"
                            alt="Icon_ภาพประกอบ-08"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {index === 1 && (
                        // กราบไหว้และท่องบทสวด - Praying hands and chanting icon
                        <div className="w-20 h-20 mr-4">
                          <img
                            src="/images/Icon_ภาพประกอบ-11.webp"
                            alt="Icon_ภาพประกอบ-08"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {index === 2 && (
                        // ปักธูปเทียน - Placing incense icon
                        <div className="w-20 h-20 mr-4">
                          <img
                            src="/images/Icon_ภาพประกอบ-12.webp"
                            alt="Icon_ภาพประกอบ-08"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {index === 3 && (
                        // กราบลา - Final prostration icon
                        <div className="w-20 h-20 mr-4">
                          <img
                            src="/images/Icon_ภาพประกอบ-13.webp"
                            alt="Icon_ภาพประกอบ-08"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Default icon for other steps */}
                      {index > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Step</span>
                        </div>
                      )}
                    </div>

                    {/* Step description */}
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium text-lg leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "chants":
        return (
          <div className="bg-[#FFC800] rounded-2xl p-6 text-black mb-6">
            <div className="space-y-6">
              {information.chants.items.map((chant, index) => (
                <div key={index}>
                  {/* Chant title */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-2 leading-tight">
                      {chant.title}
                    </h4>

                    {/* Main chant text */}
                    {chant.text && (
                      <div className="mb-4">
                        <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                          {chant.text}
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-line font-medium pt-4">
                          {chant.text2}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Separator line between chants (except last one) */}
                  {index < information.chants.items.length - 1 && (
                    <div className="border-b border-yellow-600 opacity-30 my-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "offerings":
        return (
          <div className="bg-[#FF7A05] rounded-2xl p-6 text-white">
            <div className="space-y-5">
              {information.offerings.items &&
              information.offerings.items.length > 0 ? (
                information.offerings.items.map((offering, index) => (
                  <div key={index}>
                    <div className="items-center gap-4">
                      {/* Icon/image */}
                      <div className="w-full h-auto rounded-lg flex items-center justify-center">
                        <Image
                          src={offering.image}
                          alt={offering.name}
                          width={300}
                          height={300}
                          className="rounded-lg object-cover mt-4 mb-8"
                        />
                      </div>

                      {/* Offering details */}
                      <div className="flex-1 mb-15">
                        <h4 className="font-bold text-2xl mb-2 leading-tight text-center">
                          {offering.name}
                        </h4>

                        {offering.description && (
                          <p className="text-sm leading-relaxed mb-1 text-white text-opacity-90 text-center">
                            {offering.description}
                          </p>
                        )}

                        {offering.description2 && (
                          <p className="text-sm mt-1 text-[#FFC800] text-center">
                            {offering.description2}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Line separator */}
                    {index < information.offerings.items.length - 1 && (
                      <div className="border-b border-white border-opacity-20 mt-4"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-[#FFBB7E] text-opacity-50 text-3xl py-50 font-bold">
                  ไม่มีของไหว้
                </p>
              )}
            </div>
          </div>
        );

      case "guidelines":
        return (
          <div className="bg-[#FDB97E] rounded-t-3xl p-6">
            <div className="bg-[#FDB97E] p-4 rounded-2xl text-center">
              {/* รูปภาพ */}
              <img
                src={information.guidelines.dress.image}
                alt="การแต่งกาย"
                className="w-80 h-auto rounded-xl mb-10 mt-4"
              />

              {/* หัวข้อ */}
              <h4 className="font-bold text-black text-2xl mb-2">
                {information.guidelines.dress.title}
              </h4>

              {/* เส้นใต้หัวข้อ */}
              <div className="border-t border-white border-opacity-30 w-full mx-auto mb-2"></div>

              {/* คำอธิบาย */}
              <p className="text-sm text-black leading-relaxed mb-8">
                {information.guidelines.dress.description}
              </p>
            </div>
          </div>
        );

      default:
        return <div>ไม่พบข้อมูลในส่วนนี้</div>;
    }
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

  return (
    <>
      <Head>
        <title>{information.name} - Nummu App</title>
        <meta
          name="description"
          content={`ข้อมูลเกี่ยวกับ${information.name}`}
        />
        <style jsx global>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          @keyframes slideDown {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(100%);
            }
          }

          .animate-slide-in {
            animation: fadeIn 0.2s ease-out;
          }

          .animate-slide-out {
            animation: fadeOut 0.2s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          .slide-up {
            animation: slideUp 0.3s ease-out forwards;
          }

          .slide-down {
            animation: slideDown 0.3s ease-out forwards;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-white pb-20">
        {/* Header Image */}
        <div className="relative">
          <img
            src={information.image}
            alt={information.name}
            className="w-full h-120 object-cover rounded-bl-[50px] bg-white"
          />

          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleBackClick}
              className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-md"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Heart Button */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={handleFavoriteClick}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                isFavorite(information.id)
                  ? "bg-red-500"
                  : "bg-white bg-opacity-70"
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-200 ${
                  isFavorite(information.id)
                    ? "text-white fill-white"
                    : "text-orange-500"
                }`}
              />
            </button>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-none"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-4">
          {/* Title and Schedule */}
          <div className="border-b border-orange-300 pb-3 mb-3">
            {information.id && (
              <div className="text-end bottom-4 right-0 z-10">
                {information.id !== 3 && (
                  <button
                    className="bg-none py-1 pb-8 rounded-full font-semibold text-[12px] text-[#aba6a6] hover:text-orange-600 transition mr-2"
                    onClick={() => setShowPanorama(true)}
                  >
                    View 360°
                  </button>
                )}
                {information.id !== 3 && (
                  <span className="text-[#aba6a6]">|</span>
                )}
                <button
                  className="bg-none py-1 pb-8 rounded-full font-semibold text-[12px] text-[#aba6a6] hover:text-orange-600 transition ml-2 mr-2"
                  onClick={() => setShowMapPopup(true)}
                >
                  View Map
                </button>
                <span className="text-[#aba6a6]">|</span>
                <button className="bg-none py-1 pb-8 rounded-full font-semibold text-[12px] text-[#aba6a6] hover:text-orange-600 transition ml-2">
                  Google Map
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-bold text-gray-900">
                {information.name.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </h2>
              <div className="text-md font-bold text-gray-900">
                {information.type.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {showPanorama && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md max-h-[90vh] bg-black rounded-lg shadow-lg overflow-hidden">
                {/* ปุ่มปิด */}
                <button
                  onClick={() => setShowPanorama(false)}
                  className="absolute top-2 right-2 text-white text-3xl z-50"
                >
                  ✕
                </button>

                {/* วิดีโอ */}
                <video
                  src={information.panorama}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </div>
          )}

          {showMapPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
              <div className="bg-white p-4 rounded-lg max-w-[90%] max-h-[90%] relative shadow-xl">
                <button
                  onClick={() => setShowMapPopup(false)}
                  className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-lg"
                >
                  ✕
                </button>
                <img
                  src={information.map}
                  alt="Map"
                  className="max-w-full max-h-[80vh] rounded pt-4"
                />
              </div>
            </div>
          )}

          <div className="border-b border-orange-300 pb-3 mb-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-700 font-medium text-md">
                ช่วงเวลา เปิด-ปิด
              </div>
              <div className="text-gray-700 font-medium text-md">
                {information.openHours}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-700 text-sm mb-6 leading-relaxed">
            <p>{information.description}</p>
          </div>

          {/* Expandable Sections */}
          <div className="mt-2 px-2">
            {sectionConfigs.map((section) => (
              <div
                key={section.id}
                className={`${section.bgColor} p-4 flex justify-between items-center cursor-pointer rounded-xl mb-2`}
                onClick={() => handleOpenSection(section.id)}
              >
                <h3 className={`${section.textColor} font-medium`}>
                  {section.title}
                </h3>

                <svg
                  className={`w-5 h-5 ${section.textColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Section Overlay */}
        {(activeSection || sectionAnimation) && (
          <div
            className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
              sectionAnimation === "entering"
                ? "opacity-100"
                : sectionAnimation === "leaving"
                ? "opacity-0"
                : "opacity-100"
            }`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              ref={sectionRef}
              className={`bg-white rounded-t-3xl w-full max-w-[414px] max-h-[85vh] overflow-y-auto ${
                sectionAnimation === "entering"
                  ? "slide-up"
                  : sectionAnimation === "leaving"
                  ? "slide-down"
                  : ""
              }`}
            >
              {/* Section Header */}

              <div
                className={`${
                  activeSection === "worshipGuide"
                    ? "bg-[#FFDCE6]"
                    : activeSection === "chants"
                    ? "bg-[#FFC800]"
                    : activeSection === "offerings"
                    ? "bg-[#FF7A05]"
                    : "bg-[#FFBB7E]"
                } p-4 rounded-t-3xl relative`}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleCloseSection}
                    className="w-8 h-8 rounded-full bg-opacity-70 flex items-center justify-center pt-8"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.2959 15.7957C20.1914 15.9006 20.0672 15.9838 19.9304 16.0406C19.7937 16.0974 19.6471 16.1266 19.499 16.1266C19.351 16.1266 19.2043 16.0974 19.0676 16.0406C18.9309 15.9838 18.8067 15.9006 18.7021 15.7957L12 9.09354L5.2959 15.7957C5.08455 16.0071 4.79791 16.1258 4.49902 16.1258C4.20014 16.1258 3.91349 16.0071 3.70215 15.7957C3.4908 15.5844 3.37207 15.2977 3.37207 14.9989C3.37207 14.7 3.4908 14.4133 3.70215 14.202L11.2021 6.70198C11.3067 6.5971 11.4309 6.51388 11.5676 6.4571C11.7043 6.40032 11.851 6.37109 11.999 6.37109C12.1471 6.37109 12.2937 6.40032 12.4304 6.4571C12.5672 6.51388 12.6914 6.5971 12.7959 6.70198L20.2959 14.202C20.4008 14.3065 20.484 14.4307 20.5408 14.5674C20.5976 14.7042 20.6268 14.8508 20.6268 14.9989C20.6268 15.1469 20.5976 15.2935 20.5408 15.4303C20.484 15.567 20.4008 15.6912 20.2959 15.7957Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                </div>

                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

                <h2
                  className={`text-xl font-medium ${
                    activeSection === "worshipGuide"
                      ? "text-black"
                      : activeSection === "chants"
                      ? "text-black"
                      : "text-black"
                  }`}
                >
                  {sectionConfigs.find((s) => s.id === activeSection)?.title}
                </h2>
              </div>

              {/* Section Content */}
              <div
                className={`${
                  activeSection === "worshipGuide"
                    ? "bg-[#FFDCE6]"
                    : activeSection === "chants"
                    ? "bg-[#FFC800]"
                    : activeSection === "offerings"
                    ? "bg-[#FF7A05]"
                    : "bg-[#FFBB7E]"
                } p-4 relative`}
              >
                {activeSection && renderSectionContent(activeSection)}
              </div>
            </div>
          </div>
        )}

        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
};

export default InformationPage;
