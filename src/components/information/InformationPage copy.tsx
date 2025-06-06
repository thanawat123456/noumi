// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import { useAuth } from '@/contexts/AuthContext';
// import BottomNavigation from '@/components/BottomNavigation';

// // Types
// interface InformationProps {
//   type: 'temple' | 'buddha';
//   id: string | string[] | undefined;
// }

// interface SectionConfig {
//   id: string;
//   title: string;
//   bgColor: string;
//   contentBgColor: string;
//   textColor: string;
// }

// const InformationPage: React.FC<InformationProps> = ({ type, id }) => {
//   const router = useRouter();
//   const { isAuthenticated, isLoading } = useAuth();
//   const [activeSection, setActiveSection] = useState<string | null>(null);
//   const [sectionAnimation, setSectionAnimation] = useState<'entering' | 'leaving' | null>(null);
//   const [loading, setLoading] = useState(true);
//   const sectionRef = useRef<HTMLDivElement>(null);
  
  
//   const [information, setInformation] = useState({
//     id: 1,
//     name: type === 'temple' ? 'วัดสุทัศน์เทพวราราม' : 'พระพุทธรูปสำคัญ',
//     image: '/api/placeholder/400/500',
//     location: type === 'temple' ? 'แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร' : 'วัดสุทัศน์เทพวราราม',
//     openHours: '08.00 - 20.00 น.',
//     type: type === 'temple' ? 'ภาพรวม / ทั่วไป' : 'ภาพรวม / ทั่วไป',
//     description: 'ข้อมูลกำลังโหลด...',
//     worshipGuide: {
//       title: 'ลำดับการไหว้',
//       steps: ['กำลังโหลดข้อมูล...']
//     },
//     chants: {
//       title: 'บทสวด',
//       items: [{ title: 'กำลังโหลด...', text: 'กำลังโหลดข้อมูล...' }]
//     },
//     offerings: {
//       title: 'ของไหว้',
//       items: [{ name: 'กำลังโหลด...', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/100/100' }]
//     },
//     guidelines: {
//       title: 'ข้อห้าม / ข้อแนะนำ',
//       dress: { title: 'การแต่งกาย', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/300/200' },
//       behavior: { title: 'การวางตัว', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/300/200' },
//       photography: { title: 'การถ่ายรูป', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/300/200' }
//     }
//   });


//   interface ChantItem {
//     title: string;
//     text: string;
//     transliteration?: string; // Make it optional with the ? symbol
//   }
  
//   // 2. Define proper interfaces for your Buddha and Temple information
//   interface BuddhaInfo {
//     id: number;
//     name: string;
//     image: string;
//     location: string;
//     openHours: string;
//     type: string;
//     description: string;
//     worshipGuide: {
//       title: string;
//       steps: string[];
//     };
//     chants: {
//       title: string;
//       items: ChantItem[]; // Use the ChantItem interface we defined
//     };
//     offerings: {
//       title: string;
//       items: {
//         name: string;
//         description: string;
//         image: string;
//       }[];
//     };
//     guidelines: {
//       title: string;
//       dress: {
//         title: string;
//         description: string;
//         image: string;
//       };
//       behavior: {
//         title: string;
//         description: string;
//         image: string;
//       };
//       photography: {
//         title: string;
//         description: string;
//         image: string;
//       };
//     };
//   }
  
//   interface TempleInfo {
//     id: number;
//     name: string;
//     image: string;
//     location: string;
//     openHours: string;
//     type: string;
//     description: string;
//     worshipGuide: {
//       title: string;
//       steps: string[];
//     };
//     chants: {
//       title: string;
//       items: ChantItem[];
//     };
//     offerings: {
//       title: string;
//       items: {
//         name: string;
//         description: string;
//         image: string;
//       }[];
//     };
//     guidelines: {
//       title: string;
//       dress: {
//         title: string;
//         description: string;
//         image: string;
//       };
//       behavior: {
//         title: string;
//         description: string;
//         image: string;
//       };
//       photography: {
//         title: string;
//         description: string;
//         image: string;
//       };
//     };
//   }
  
//   // แก้ไขส่วน useEffect สำหรับการโหลดข้อมูล
//   useEffect(() => {
//     if (!id || !isAuthenticated) return;
    
//     const fetchInformation = async () => {
//       try {
//         // ในแอพจริง นี่ควรเป็นการเรียก API
//         // const response = await axios.get(`/api/${type}/${id}`);
        
//         // ข้อมูลจำลอง
//         if (type === 'buddha') {
//           // สร้างข้อมูลจำลองที่แตกต่างกันตาม ID
//           const buddhaData: Record<number, BuddhaInfo> = {
//             1: {
//               id: 1,
//               name: 'พระศรีศากยมุนี',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'ภาพรวม / ทั่วไป',
//               description: 'พระพุทธรูปประธานในพระอุโบสถ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชนทั่วประเทศ',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 3 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระศรีศากยมุนี ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 9 ดอก เทียน 2 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 9 อย่าง',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             2: {
//               id: 2,
//               name: 'พระสุนทรีวาณี',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'การเรียน / การงาน',
//               description: 'พระสุนทรีวาณีหรือลอยองค์ องค์นี้ประดิษฐานในพระวิหารหลวงวัดสุทัศน์เทพวราราม โดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวโปรดเกล้าฯ ให้เสด็จเป็นประธาน ประกอบพิธีเทกองและพุทธาภิเษก เมื่อวันที่ 7 ตุลาคม พ.ศ.๑๘๙๖ ซึ่งตรงกล่าวเป็นรูปแบบพิเศษครั้งแรก',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 3 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระบรมศาสดาสัมมาสัมพุทธเจ้า ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ ปราศจากโรคภัยไข้เจ็บทั้งปวง ขอให้มีสติปัญญาเฉียบแหลม และประสบความสำเร็จในการศึกษาและหน้าที่การงาน'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 3 ดอก เทียน 2 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 9 อย่าง (นิยมใช้กล้วย, ส้ม, แอปเปิ้ล)',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             3: {
//               id: 3,
//               name: 'พระพุทธรังสีมุนราชัย',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'โชคลาภ / วาสนา',
//               description: 'พระพุทธรูปประจำวิหารด้านทิศใต้ เชื่อกันว่าหากมาขอพรด้านโชคลาภจะมีความสำเร็จ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชน',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 5 ดอก เทียน 1 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระพุทธรังสีมุนราชัย ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ มีโชคลาภวาสนา'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 5 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 5 ดอก เทียน 1 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 5 อย่าง',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             4: {
//               id: 4,
//               name: 'ต้นพระศรีมหาโพธิ์',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'ภาพรวม / ทั่วไป',
//               description: 'ต้นโพธิ์ศักดิ์สิทธิ์ภายในวัด ที่เชื่อกันว่าเป็นต้นโพธิ์ที่นำมาจากพุทธคยา สถานที่ตรัสรู้ของพระพุทธเจ้า',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 3 ดอก',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'เดินประทักษิณรอบต้นโพธิ์ 3 รอบ',
//                   'ปักธูปบริเวณโคนต้น',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาต้นพระศรีมหาโพธิ์',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอนอบน้อมบูชาต้นพระศรีมหาโพธิ์อันศักดิ์สิทธิ์ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ ปราศจากเภทภัยทั้งปวง'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกไม้สีขาว',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 3 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผ้าแพร',
//                     description: 'ผ้าแพรสีเหลืองหรือสีขาวพันรอบต้นโพธิ์',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             5: {
//               id: 5,
//               name: 'พระศรีอริยเมตไตรย',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'สุขภาพ / โรคภัย',
//               description: 'พระพุทธรูปปางนาคปรก เชื่อกันว่าหากมาขอพรเรื่องสุขภาพจะหายจากโรคภัยไข้เจ็บ',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 9 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระศรีอริยเมตไตรย ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงหายจากโรคภัยไข้เจ็บทั้งปวง มีสุขภาพแข็งแรงสมบูรณ์'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 9 ดอก เทียน 2 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 9 อย่าง',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             6: {
//               id: 6,
//               name: 'พระพุทธรูปปางลีลา',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'ความมงคล / ความสำเร็จ',
//               description: 'พระพุทธรูปปางลีลาศิลปะสุโขทัย เป็นพระพุทธรูปที่มีความงดงาม แสดงถึงการก้าวเดินอย่างสง่างาม เชื่อกันว่าหากสักการะแล้วจะประสบความสำเร็จในชีวิต',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   // 'จุดธูปเทียน 5 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระพุทธรูปปางลีลา ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบความสำเร็จในหน้าที่การงานและก้าวหน้าในชีวิต'
//                 }
//               ]
//             },
//             offerings: {
//               title: 'ของไหว้',
//               items: [
//                 {
//                   name: 'ดอกไม้',
//                   description: 'ดอกบัว หรือดอกไม้สีขาว 5 ดอก',
//                   image: '/api/placeholder/100/100'
//                 },
//                 {
//                   name: 'ธูปเทียน',
//                   description: 'ธูป 5 ดอก เทียน 2 เล่ม',
//                   image: '/api/placeholder/100/100'
//                 },
//                 {
//                   name: 'ผลไม้',
//                   description: 'ผลไม้ 5 อย่าง',
//                   image: '/api/placeholder/100/100'
//                 }
//               ]
//             },
//             guidelines: {
//               title: 'ข้อห้าม / ข้อแนะนำ',
//               dress: {
//                 title: 'การแต่งกาย',
//                 description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                 image: '/api/placeholder/300/200'
//               },
//               behavior: {
//                 title: 'การวางตัว',
//                 description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                 image: '/api/placeholder/300/200'
//               },
//               photography: {
//                 title: 'การถ่ายรูป',
//                 description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                 image: '/api/placeholder/300/200'
//               }
//             }
//           }
//         };
        
//         // ตรวจสอบว่ามีข้อมูลพระพุทธรูปที่ ID นี้หรือไม่
//         const buddhaId = Number(id);
//         if (Object.prototype.hasOwnProperty.call(buddhaData, buddhaId)) {
//           setInformation(buddhaData[buddhaId]);
//         } else {
//           // กรณีไม่พบข้อมูล ให้ใช้ข้อมูลเริ่มต้น
//           setInformation({
//             id: Number(id),
//             name: `พระพุทธรูปสำคัญ #${id}`,
//             image: '/api/placeholder/400/500',
//             location: 'วัดสุทัศน์เทพวราราม',
//             openHours: '08.00 - 20.00 น.',
//             type: 'ภาพรวม / ทั่วไป',
//             description: 'พระพุทธรูปสำคัญประจำวัด ที่มีความเก่าแก่และศักดิ์สิทธิ์',
//             worshipGuide: {
//               title: 'ลำดับการไหว้',
//               steps: [
//                 'จุดธูปเทียน 3 ดอก เทียน 2 เล่ม',
//                 'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                 'กราบ 3 ครั้ง',
//                 'ปักธูปเทียนในที่ที่จัดไว้',
//                 'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//               ]
//             },
//             chants: {
//               title: 'บทสวด',
//               items: [
//                 {
//                   title: 'คำบูชาพระพุทธรูป',
//                   text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                   transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                 }as ChantItem ,
//                 {
//                   title: 'คำขอพรเฉพาะ',
//                   text: 'ข้าพเจ้าขอน้อมบูชาพระพุทธรูปศักดิ์สิทธิ์องค์นี้ ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ'
//                 }
//               ]
//             },
//             offerings: {
//               title: 'ของไหว้',
//               items: [
//                 {
//                   name: 'ดอกไม้',
//                   description: 'ดอกบัว หรือดอกไม้สีขาว',
//                   image: '/api/placeholder/100/100'
//                 },
//                 {
//                   name: 'ธูปเทียน',
//                   description: 'ธูป 3 ดอก เทียน 2 เล่ม',
//                   image: '/api/placeholder/100/100'
//                 },
//                 {
//                   name: 'ผลไม้',
//                   description: 'ผลไม้ตามความเหมาะสม',
//                   image: '/api/placeholder/100/100'
//                 }
//               ]
//             },
//             guidelines: {
//               title: 'ข้อห้าม / ข้อแนะนำ',
//               dress: {
//                 title: 'การแต่งกาย',
//                 description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                 image: '/api/placeholder/300/200'
//               },
//               behavior: {
//                 title: 'การวางตัว',
//                 description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                 image: '/api/placeholder/300/200'
//               },
//               photography: {
//                 title: 'การถ่ายรูป',
//                 description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                 image: '/api/placeholder/300/200'
//               }
//             }
//           });
//         }
//       } else if (type === 'temple') {
//         // ข้อมูลจำลองสำหรับวัด
//         const templeData: Record<number, TempleInfo> = {
//           1: {
//             id: 1,
//             name: 'วัดสุทัศน์เทพวราราม',
//             image: '/api/placeholder/400/500',
//             location: 'แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร',
//             openHours: '08.00 - 20.00 น.',
//             type: 'ภาพรวม / ทั่วไป',
//             description: 'วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร เป็นวัดที่พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช รัชกาลที่ 1 โปรดให้สร้างขึ้น',
//             worshipGuide: {
//               title: 'ลำดับการเข้าวัด',
//               steps: [
//                 'แต่งกายสุภาพเรียบร้อย',
//                 'เดินเข้าทางประตูวัดอย่างสงบสำรวม',
//                 'กราบพระประธานในพระอุโบสถ',
//                 'เวียนประทักษิณรอบพระอุโบสถ 3 รอบ',
//                 'สักการะพระพุทธรูปสำคัญในวัด'
//               ]
//             },
//             chants: {
//               title: 'บทสวด',
//               items: [
//                 {
//                   title: 'คำบูชาพระรัตนตรัย',
//                   text: 'อิมินา สักกาเรนะ, พุทธัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, ธัมมัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, สังฆัง ปูเชมิ ฯ',
//                   transliteration: 'Iminā sakkārena, buddhaṃ pūjemi ฯ\nIminā sakkārena, dhammaṃ pūjemi ฯ\nIminā sakkārena, saṅghaṃ pūjemi ฯ'
//                 }
//               ]
//             },
//             offerings: {
//               title: 'ของไหว้',
//               items: [
//                 {
//                   name: 'ดอกไม้',
//                   description: 'ดอกบัว ดอกกุหลาบ ดอกดาวเรือง',
//                   image: '/api/placeholder/100/100'
//                 },
//                 {
//                   name: 'ธูปเทียน',
//                   description: 'ธูป 3 ดอก เทียน 2 เล่ม',
//                   image: '/api/placeholder/100/100'
//                 }
//               ]
//             },
//             guidelines: {
//               title: 'ข้อห้าม / ข้อแนะนำ',
//               dress: {
//                 title: 'การแต่งกาย',
//                 description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                 image: '/api/placeholder/300/200'
//               },
//               behavior: {
//                 title: 'การวางตัว',
//                 description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                 image: '/api/placeholder/300/200'
//               },
//               photography: {
//                 title: 'การถ่ายรูป',
//                 description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                 image: '/api/placeholder/300/200'
//               }
//             }
//           }
//         };
        
//         // ตรวจสอบว่ามีข้อมูลวัดที่ ID นี้หรือไม่
//         const templeId = Number(id);
//         if (Object.prototype.hasOwnProperty.call(templeData, templeId)) {
//           setInformation(templeData[templeId]);
//         } else {
//           // กรณีไม่พบข้อมูล ใช้ข้อมูลเริ่มต้น
//           setInformation({
//             id: Number(id),
//             name: `วัด #${id}`,
//             image: '/api/placeholder/400/500',
//             location: 'กรุงเทพมหานคร',
//             openHours: '08.00 - 20.00 น.',
//             type: 'ภาพรวม / ทั่วไป',
//             description: 'วัดที่มีความสำคัญทางประวัติศาสตร์และศิลปวัฒนธรรม',
//             worshipGuide: {
//               title: 'ลำดับการไหว้',
//               steps: [
//                 'แต่งกายสุภาพเรียบร้อย',
//                 'เดินเข้าทางประตูวัดอย่างสงบสำรวม',
//                 'กราบพระประธานในพระอุโบสถ',
//                 'เวียนประทักษิณรอบพระอุโบสถ 3 รอบ',
//                 'สักการะพระพุทธรูปสำคัญในวัด'
//               ]
//             },
//             chants: {
//               title: 'บทสวด',
//               items: [
//                 {
//                   title: 'คำบูชาพระรัตนตรัย',
//                   text: 'อิมินา สักกาเรนะ, พุทธัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, ธัมมัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, สังฆัง ปูเชมิ ฯ',
//                   transliteration: 'Iminā sakkārena, buddhaṃ pūjemi ฯ\nIminā sakkārena, dhammaṃ pūjemi ฯ\nIminā sakkārena, saṅghaṃ pūjemi ฯ'
//                 }as ChantItem
//               ]
//             },
//             offerings: {
//               title: 'ของไหว้',
//               items: [
//                 {
//                   name: 'ดอกไม้',
//                   description: 'ดอกบัว ดอกกุหลาบ ดอกดาวเรือง',
//                   image: '/api/placeholder/100/100'
//                 },
//                 {
//                   name: 'ธูปเทียน',
//                   description: 'ธูป 3 ดอก เทียน 2 เล่ม',
//                   image: '/api/placeholder/100/100'
//                 }
//               ]
//             },
//             guidelines: {
//               title: 'ข้อห้าม / ข้อแนะนำ',
//               dress: {
//                 title: 'การแต่งกาย',
//                 description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                 image: '/api/placeholder/300/200'
//               },
//               behavior: {
//                 title: 'การวางตัว',
//                 description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                 image: '/api/placeholder/300/200'
//               },
//               photography: {
//                 title: 'การถ่ายรูป',
//                 description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                 image: '/api/placeholder/300/200'
//               }
//             }
//           });
//         }
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error(`Failed to fetch ${type} info:`, error);
//       setLoading(false);
//     }
//   };
  
//   fetchInformation();
// }, [id, isAuthenticated, type]);

//   // Fetch information data
//   useEffect(() => {
//     if (!id || !isAuthenticated) return;
    
//     const fetchInformation = async () => {
//       try {
//         // ในแอพจริง นี่ควรเป็นการเรียก API
//         // const response = await axios.get(`/api/${type}/${id}`);
        
//         // ข้อมูลจำลอง
//         if (type === 'buddha') {
//           // สร้างข้อมูลจำลองที่แตกต่างกันตาม ID
//           const buddhaData = {
//             1: {
//               id: 1,
//               name: 'พระศรีศากยมุนี',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'ภาพรวม / ทั่วไป',
//               description: 'พระพุทธรูปประธานในพระอุโบสถ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชนทั่วประเทศ',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 3 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระศรีศากยมุนี ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 9 ดอก เทียน 2 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 9 อย่าง',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             2: {
//               id: 2,
//               name: 'พระสุนทรีวาณี',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'การเรียน / การงาน',
//               description: 'พระสุนทรีวาณีหรือลอยองค์ องค์นี้ประดิษฐานในพระวิหารหลวงวัดสุทัศน์เทพวราราม โดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวโปรดเกล้าฯ ให้เสด็จเป็นประธาน ประกอบพิธีเทกองและพุทธาภิเษก เมื่อวันที่ 7 ตุลาคม พ.ศ.๑๘๙๖ ซึ่งตรงกล่าวเป็นรูปแบบพิเศษครั้งแรก',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 3 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระบรมศาสดาสัมมาสัมพุทธเจ้า ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ ปราศจากโรคภัยไข้เจ็บทั้งปวง ขอให้มีสติปัญญาเฉียบแหลม และประสบความสำเร็จในการศึกษาและหน้าที่การงาน'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 3 ดอก เทียน 2 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 9 อย่าง (นิยมใช้กล้วย, ส้ม, แอปเปิ้ล)',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             3: {
//               id: 3,
//               name: 'พระพุทธรังสีมุนราชัย',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'โชคลาภ / วาสนา',
//               description: 'พระพุทธรูปประจำวิหารด้านทิศใต้ เชื่อกันว่าหากมาขอพรด้านโชคลาภจะมีความสำเร็จ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชน',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 5 ดอก เทียน 1 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระพุทธรังสีมุนราชัย ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ มีโชคลาภวาสนา'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 5 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 5 ดอก เทียน 1 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 5 อย่าง',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             4: {
//               id: 4,
//               name: 'ต้นพระศรีมหาโพธิ์',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'ภาพรวม / ทั่วไป',
//               description: 'ต้นโพธิ์ศักดิ์สิทธิ์ภายในวัด ที่เชื่อกันว่าเป็นต้นโพธิ์ที่นำมาจากพุทธคยา สถานที่ตรัสรู้ของพระพุทธเจ้า',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 3 ดอก',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'เดินประทักษิณรอบต้นโพธิ์ 3 รอบ',
//                   'ปักธูปบริเวณโคนต้น',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาต้นพระศรีมหาโพธิ์',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอนอบน้อมบูชาต้นพระศรีมหาโพธิ์อันศักดิ์สิทธิ์ ขอให้ข้าพเจ้าและครอบครัว จงประสบแต่ความสุข ความเจริญ ปราศจากเภทภัยทั้งปวง'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกไม้สีขาว',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 3 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผ้าแพร',
//                     description: 'ผ้าแพรสีเหลืองหรือสีขาวพันรอบต้นโพธิ์',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             5: {
//               id: 5,
//               name: 'พระศรีอริยเมตไตรย',
//               image: '/api/placeholder/400/500',
//               location: 'วัดสุทัศน์เทพวราราม',
//               openHours: '08.00 - 20.00 น.',
//               type: 'สุขภาพ / โรคภัย',
//               description: 'พระพุทธรูปปางนาคปรก เชื่อกันว่าหากมาขอพรเรื่องสุขภาพจะหายจากโรคภัยไข้เจ็บ',
//               worshipGuide: {
//                 title: 'ลำดับการไหว้',
//                 steps: [
//                   'จุดธูปเทียน 9 ดอก เทียน 2 เล่ม',
//                   'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                   'กราบ 3 ครั้ง',
//                   'ปักธูปเทียนในที่ที่จัดไว้',
//                   'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                 ]
//               },
//               chants: {
//                 title: 'บทสวด',
//                 items: [
//                   {
//                     title: 'คำบูชาพระพุทธรูป',
//                     text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                     transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                   },
//                   {
//                     title: 'คำขอพรเฉพาะ',
//                     text: 'ข้าพเจ้าขอน้อมบูชาพระศรีอริยเมตไตรย ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงหายจากโรคภัยไข้เจ็บทั้งปวง มีสุขภาพแข็งแรงสมบูรณ์'
//                   }
//                 ]
//               },
//               offerings: {
//                 title: 'ของไหว้',
//                 items: [
//                   {
//                     name: 'ดอกไม้',
//                     description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ธูปเทียน',
//                     description: 'ธูป 9 ดอก เทียน 2 เล่ม',
//                     image: '/api/placeholder/100/100'
//                   },
//                   {
//                     name: 'ผลไม้',
//                     description: 'ผลไม้ 9 อย่าง',
//                     image: '/api/placeholder/100/100'
//                   }
//                 ]
//               },
//               guidelines: {
//                 title: 'ข้อห้าม / ข้อแนะนำ',
//                 dress: {
//                   title: 'การแต่งกาย',
//                   description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 behavior: {
//                   title: 'การวางตัว',
//                   description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                   image: '/api/placeholder/300/200'
//                 },
//                 photography: {
//                   title: 'การถ่ายรูป',
//                   description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                   image: '/api/placeholder/300/200'
//                 }
//               }
//             },
//             6: {
//                 id: 6,
//                 name: 'พระพุทธรูปปางลีลา',
//                 image: '/api/placeholder/400/500',
//                 location: 'วัดสุทัศน์เทพวราราม',
//                 openHours: '08.00 - 20.00 น.',
//                 type: 'ความมงคล / ความสำเร็จ',
//                 description: 'พระพุทธรูปปางลีลาศิลปะสุโขทัย เป็นพระพุทธรูปที่มีความงดงาม แสดงถึงการก้าวเดินอย่างสง่างาม เชื่อกันว่าหากสักการะแล้วจะประสบความสำเร็จในชีวิต',
//                 worshipGuide: {
//                   title: 'ลำดับการไหว้',
//                   steps: [
//                     'จุดธูปเทียน 5 ดอก เทียน 2 เล่ม',
//                     'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
//                     'กราบ 3 ครั้ง',
//                     'ปักธูปเทียนในที่ที่จัดไว้',
//                     'นั่งสมาธิสักครู่ก่อนลุกออกไป'
//                   ]
//                 },
//                 chants: {
//                   title: 'บทสวด',
//                   items: [
//                     {
//                       title: 'คำบูชาพระพุทธรูป',
//                       text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)',
//                       transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
//                     },
//                     {
//                       title: 'คำขอพรเฉพาะ',
//                       text: 'ข้าพเจ้าขอน้อมบูชาพระพุทธรูปปางลีลา ด้วยเครื่องสักการะทั้งหลายเหล่านี้ ขอให้ข้าพเจ้าและครอบครัว จงประสบความสำเร็จในหน้าที่การงานและก้าวหน้าในชีวิต'
//                     }
//                   ]
//                 },
//                 offerings: {
//                   title: 'ของไหว้',
//                   items: [
//                     {
//                       name: 'ดอกไม้',
//                       description: 'ดอกบัว หรือดอกไม้สีขาว 5 ดอก',
//                       image: '/api/placeholder/100/100'
//                     },
//                     {
//                       name: 'ธูปเทียน',
//                       description: 'ธูป 5 ดอก เทียน 2 เล่ม',
//                       image: '/api/placeholder/100/100'
//                     },
//                     {
//                       name: 'ผลไม้',
//                       description: 'ผลไม้ 5 อย่าง',
//                       image: '/api/placeholder/100/100'
//                     }
//                   ]
//                 },
//                 guidelines: {
//                   title: 'ข้อห้าม / ข้อแนะนำ',
//                   dress: {
//                     title: 'การแต่งกาย',
//                     description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
//                     image: '/api/placeholder/300/200'
//                   },
//                   behavior: {
//                     title: 'การวางตัว',
//                     description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
//                     image: '/api/placeholder/300/200'
//                   },
//                   photography: {
//                     title: 'การถ่ายรูป',
//                     description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
//                     image: '/api/placeholder/300/200'
//                   }
//                 }
//               }
//             };
            
//           }
          
//           setLoading(false);
//         } catch (error) {
//           console.error(`Failed to fetch ${type} info:`, error);
//           setLoading(false);
//         }
//       };
      
//       fetchInformation();
//     }, [id, isAuthenticated, type]);
    
//     // Handle section animations with cleanup
//     useEffect(() => {
//       if (sectionAnimation === 'entering' || sectionAnimation === 'leaving') {
//         const timer = setTimeout(() => {
//           if (sectionAnimation === 'leaving') {
//             setActiveSection(null);
//           }
//           setSectionAnimation(null);
//         }, 300); // Animation duration
        
//         return () => clearTimeout(timer);
//       }
//     }, [sectionAnimation]);
    
//     // Handle click outside to close section
//     useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//         if (sectionRef.current && !sectionRef.current.contains(event.target as Node) && activeSection) {
//           handleCloseSection();
//         }
//       };
      
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, [activeSection]);
    
//     const handleBackClick = () => {
//       router.back();
//     };
    
//     const handleOpenSection = (section: string) => {
//       setActiveSection(section);
//       setSectionAnimation('entering');
//       // Prevent scrolling of background content when overlay is active
//       document.body.style.overflow = 'hidden';
//     };
    
//     const handleCloseSection = () => {
//       setSectionAnimation('leaving');
//       // Re-enable scrolling when overlay is closed
//       document.body.style.overflow = 'auto';
//     };
    
//     const sectionConfigs: SectionConfig[] = [
//       { 
//         id: 'worshipGuide', 
//         title: 'ลำดับการไหว้', 
//         bgColor: 'bg-pink-200', 
//         contentBgColor: 'bg-pink-100',
//         textColor: 'text-pink-800' 
//       },
//       { 
//         id: 'chants', 
//         title: 'บทสวด', 
//         bgColor: 'bg-yellow-200', 
//         contentBgColor: 'bg-yellow-100',
//         textColor: 'text-yellow-800' 
//       },
//       { 
//         id: 'offerings', 
//         title: 'ของไหว้', 
//         bgColor: 'bg-orange-300', 
//         contentBgColor: 'bg-orange-200',
//         textColor: 'text-orange-800' 
//       },
//       { 
//         id: 'guidelines', 
//         title: 'ข้อห้าม / ข้อแนะนำ', 
//         bgColor: 'bg-orange-200', 
//         contentBgColor: 'bg-orange-100',
//         textColor: 'text-orange-800' 
//       }
//     ];
    
//     const renderSectionContent = (sectionId: string) => {
//       switch (sectionId) {
//         case 'worshipGuide':
//           return (
//             <div>
//               <ol className="list-decimal pl-6 space-y-3 mb-6">
//                 {information.worshipGuide.steps.map((step, index) => (
//                   <li key={index} className="text-gray-700">{step}</li>
//                 ))}
//               </ol>
              
//               <div className="bg-pink-50 p-4 rounded-lg">
//                 <div className="flex items-center mb-3">
//                   <svg className="w-6 h-6 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                   </svg>
//                   <h3 className="text-pink-700 font-medium">วิดีโอสาธิตการไหว้</h3>
//                 </div>
//                 <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
//                   <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           );
        
//         case 'chants':
//           return (
//             <div>
//               {information.chants.items.map((chant, index) => (
//                 <div key={index} className="mb-6">
//                   <h4 className="font-medium text-gray-800 mb-2">{chant.title}</h4>
//                   <div className="bg-yellow-50 p-4 rounded-lg">
//                     <p className="text-gray-700 whitespace-pre-line">{chant.text}</p>
//                     {/* {chant.transliteration && (
//                       <p className="text-gray-500 text-sm mt-2 italic whitespace-pre-line">{chant.transliteration}</p>
//                     )} */}
//                   </div>
//                 </div>
//               ))}
              
//               <div className="flex justify-center mt-4">
//                 <button className="bg-yellow-500 text-white rounded-full px-6 py-2 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-4.242a1 1 0 010 1.414m2.828-2.828a1 1 0 010 0m-2.828 2.828L9 16m5.414-5.414L15 10m-2.172 2.172L12 13" />
//                   </svg>
//                   ฟังบทสวด
//                 </button>
//               </div>
//             </div>
//           );
        
//         case 'offerings':
//           return (
//             <div>
//               <div className="grid grid-cols-1 gap-4 mb-6">
//                 {information.offerings.items.map((offering, index) => (
//                   <div key={index} className="bg-orange-50 p-4 rounded-lg flex items-center">
//                     <div className="w-16 h-16 mr-4">
//                       <img src={offering.image} alt={offering.name} className="w-full h-full object-cover rounded-lg" />
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-orange-800">{offering.name}</h4>
//                       <p className="text-gray-600 text-sm">{offering.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mt-6">
//                 <button className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                   </svg>
//                   สั่งซื้อของไหว้ออนไลน์
//                 </button>
//               </div>
//             </div>
//           );
        
//         case 'guidelines':
//           return (
//             <div>
//               <div className="mb-6">
//                 <div className="bg-orange-50 p-4 rounded-lg mb-4">
//                   <h4 className="font-medium text-orange-800 mb-3">{information.guidelines.dress.title}</h4>
//                   <img src={information.guidelines.dress.image} alt="การแต่งกาย" className="w-full h-auto rounded-lg mb-3" />
//                   <p className="text-gray-600 text-sm">{information.guidelines.dress.description}</p>
//                 </div>
                
//                 <div className="bg-orange-50 p-4 rounded-lg mb-4">
//                   <h4 className="font-medium text-orange-800 mb-3">{information.guidelines.behavior.title}</h4>
//                   <img src={information.guidelines.behavior.image} alt="การวางตัว" className="w-full h-auto rounded-lg mb-3" />
//                   <p className="text-gray-600 text-sm">{information.guidelines.behavior.description}</p>
//                 </div>
                
//                 <div className="bg-orange-50 p-4 rounded-lg">
//                   <h4 className="font-medium text-orange-800 mb-3">{information.guidelines.photography.title}</h4>
//                   <img src={information.guidelines.photography.image} alt="การถ่ายรูป" className="w-full h-auto rounded-lg mb-3" />
//                 <p className="text-gray-600 text-sm">{information.guidelines.photography.description}</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       default:
//         return <div>ไม่พบข้อมูลในส่วนนี้</div>;
//     }
//   };
  
//   if (isLoading || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-orange-500">กำลังโหลด...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <>
//       <Head>
//         <title>{information.name} - Nummu App</title>
//         <meta name="description" content={`ข้อมูลเกี่ยวกับ${information.name}`} />
//         <style jsx global>{`
//           @keyframes slideUp {
//             from {
//               transform: translateY(100%);
//             }
//             to {
//               transform: translateY(0);
//             }
//           }
          
//           @keyframes slideDown {
//             from {
//               transform: translateY(0);
//             }
//             to {
//               transform: translateY(100%);
//             }
//           }
          
//           .animate-slide-in {
//             animation: fadeIn 0.2s ease-out;
//           }
          
//           .animate-slide-out {
//             animation: fadeOut 0.2s ease-out;
//           }
          
//           @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//           }
          
//           @keyframes fadeOut {
//             from { opacity: 1; }
//             to { opacity: 0; }
//           }

//           .slide-up {
//             animation: slideUp 0.3s ease-out forwards;
//           }
          
//           .slide-down {
//             animation: slideDown 0.3s ease-out forwards;
//           }
//         `}</style>
//       </Head>
      
//       <div className="min-h-screen bg-gray-100 pb-20 max-w-[414px] mx-auto">
//         {/* Header Image */}
//         <div className="relative">
//           <img 
//             src="/api/placeholder/400/500" 
//             alt={information.name} 
//             className="w-full h-auto"
//           />
//           <div className="absolute top-4 left-4 z-10">
//             <button 
//               onClick={handleBackClick}
//               className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
//             >
//               <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//           </div>
          
//           <div className="absolute top-4 right-4 z-10">
//             <button className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md">
//               <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//             </button>
//           </div>
          
//           {/* Overlay gradient for better text readability */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
//           {/* Image caption */}
//           <div className="absolute bottom-4 left-4 right-4 text-white z-10">
//             <h1 className="text-2xl font-semibold drop-shadow-lg">{information.name}</h1>
//             <p className="text-sm opacity-90">{information.location}</p>
//           </div>
//         </div>
        
//         {/* Main Content */}
//         <div className="p-4 bg-white">
//           <div className="flex justify-between items-center mb-2">
//             <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
//               {information.type}
//             </div>
//             <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
//             {information.name}
//             </div>
//             <div className="text-sm text-gray-500 flex items-center">
//               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {information.openHours}
//             </div>
//           </div>
          
//           <div className="text-gray-700 text-sm mb-4">
//             <p>{information.description}</p>
//           </div>
          
//           <div className="mt-3 flex justify-center">
//             <button className="text-sm bg-blue-500 text-white px-6 py-2 rounded-full flex items-center">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//               อ่านเพิ่มเติม
//             </button>
//           </div>
//         </div>
        
//         {/* Expandable Sections */}
//         <div className="mt-2 px-2">
//           {sectionConfigs.map(section => (
//             <div key={section.id} 
//               className={`${section.bgColor} p-4 flex justify-between items-center cursor-pointer rounded-xl mb-2`}
//               onClick={() => handleOpenSection(section.id)}
//             >
//               <h3 className={`${section.textColor} font-medium`}>{section.title}</h3>
//               <svg 
//                 className={`w-5 h-5 ${section.textColor}`} 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24" 
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>
//           ))}
//         </div>
        
//         {/* Section Overlay */}
//         {(activeSection || sectionAnimation) && (
//           <div 
//             className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
//               sectionAnimation === 'entering' ? 'opacity-100' : 
//               sectionAnimation === 'leaving' ? 'opacity-0' : 'opacity-100'
//             }`}
//             style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
//           >
//             <div 
//               ref={sectionRef}
//               className={`bg-white rounded-t-3xl w-full max-w-[414px] max-h-[85vh] overflow-y-auto ${
//                 sectionAnimation === 'entering' ? 'slide-up' : 
//                 sectionAnimation === 'leaving' ? 'slide-down' : ''
//               }`}
//             >
//               {/* Section Header */}
//               <div className={`${
//                 activeSection === 'worshipGuide' ? 'bg-pink-100' :
//                 activeSection === 'chants' ? 'bg-yellow-100' :
//                 activeSection === 'offerings' ? 'bg-orange-200' :
//                 'bg-orange-100'
//               } p-4 rounded-t-3xl relative`}>
//                 <div className="absolute top-4 right-4">
//                   <button 
//                     onClick={handleCloseSection}
//                     className="w-8 h-8 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
//                   >
//                     <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//                 <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
//                 <h2 className={`text-xl font-medium ${
//                   activeSection === 'worshipGuide' ? 'text-pink-800' :
//                   activeSection === 'chants' ? 'text-yellow-800' :
//                   'text-orange-800'
//                 }`}>
//                   {sectionConfigs.find(s => s.id === activeSection)?.title}
//                 </h2>
//               </div>
              
//               {/* Section Content */}
//               <div className="p-4">
//                 {activeSection && renderSectionContent(activeSection)}
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Quick Buttons */}
//         {type === 'buddha' && (
//           <div className="fixed bottom-16 left-0 right-0 max-w-[414px] mx-auto bg-white border-t border-gray-200 p-4">
//             <div className="flex justify-center space-x-4">
//               <button className="flex-1 bg-pink-500 text-white rounded-full py-3 flex items-center justify-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 จองเวลานัดไหว้
//               </button>
//               <button className="flex-1 bg-orange-500 text-white rounded-full py-3 flex items-center justify-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 ขอพรออนไลน์
//               </button>
//             </div>
//           </div>
//         )}
        
//         <BottomNavigation activePage="profile" />
//       </div>
//     </>
//   );
// };

// export default InformationPage;