import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileSlideMenu from '@/components/ProfileSlideMenu';

// ข้อมูลธาตุประจำราศี (12 ราศี) - ข้อมูลสมบูรณ์
const zodiacElementsData = {
  'Aries': { 
    name: 'ราศีเมษ', 
    element: 'ธาตุไฟ',
    image: '/images/profile/element/เมษา.png',
    color: '#e74c3c', 
    bgColor: '#AA2427',
    personality: 'คนที่มีพลังงานมาก กระตือรือร้น มีเสน่ห์ และมักมีความเข้มงวด',
    strength: 'มีสติปัญญาเฉียบแหลม มีความรู้สึกอย่างเข้มงวดและตัดสินใจอย่างรวดเร็ว'
  },
  'Taurus': { 
    name: 'ราศีพฤษภ', 
    element: 'ธาตุดิน',
    image: '/images/profile/element/พฤษภ.png',
    color: '#2ecc71', 
    bgColor: '#9891C6',
    personality: 'มีความเข้มงวดและมั่นคง มีความเคร่งครัดและเสมอภาค ชอบความเรียบง่ายและเป็นระเบียบ',
    strength: ' มีความรับผิดชอบและเน้นการปฏิบัติตามกฎเกณฑ์ มีความระมัดระวัง และ ประสานงานได้ดี'
  },
  'Gemini': { 
    name: 'ราศีเมถุน', 
    element: 'ธาตุลม',
    image: '/images/profile/element/มิถุ.png',

    color: '#f1c40f', 
    bgColor: '#FA7A3E',
    personality: 'เป็นคนที่ใจใหญ่ควักเงินง่าย ชอบการคิดวิเคราะห์ และมักทำให้คนรอบข้างมีความสุข',
    strength: 'มีความคิดสร้างสรรค์และหลากหลาย มีความสามารถในการเรียนรู้และแก้ปัญหา'
  },
  'Cancer': { 
    name: 'ราศีกรกฎ', 
    element: 'ธาตุน้ำ',
    image: '/images/profile/element/กรก.png',

    color: '#3498db', 
    bgColor: '#7CB2DF',
    personality: 'มีความอ่อนไหวและใส่ใจผู้อื่น รักครอบครัว มีสัญชาตญาณที่แม่นยำ เป็นคนที่มีความเมตตาและเห็นอกเห็นใจ รักความปลอดภัยและความอบอุ่น',
    strength: 'มีความเข้าใจผู้อื่นลึกซึ้ง เป็นคนใจดีและมีความเมตตา มีสัญชาตญาณที่ดีในการดูแลผู้อื่น เป็นเพื่อนที่ไว้ใจได้และมีความจงรักภักดี'
  },
  'Leo': { 
    name: 'ราศีสิงห์', 
    element: 'ธาตุไฟ',
    image: '/images/profile/element/สิง.png',

    color: '#f39c12', 
    bgColor: '#E8C238',
    personality: 'คนที่มีพลังงานมาก กระตือรือร้น มีเสน่ห์ และมักมีความเข้มงวด',
    strength: 'มีสติปัญญาเฉียบแหลม มีความรู้สึกอย่างเข้มงวดและตัดสินใจอย่างรวดเร็ว'
  },
  'Virgo': { 
    name: 'ราศีกันย์', 
    element: 'ธาตุุดิน',
    image: '/images/profile/element/กันยา.png',

    color: '#8e44ad', 
    bgColor: '#82503A',
    personality: 'มีความเข้มงวดและมั่นคง มีความเคร่งครัดและเสมอภาค ชอบความเรียบง่ายและเป็นระเบียบ',
    strength: ' มีความรับผิดชอบและเน้นการปฏิบัติตามกฎเกณฑ์ มีความระมัดระวัง และ ประสานงานได้ดี'
  },
  'Libra': { 
    name: 'ราศีตุลย์', 
    element: 'ธาตุลม',
    image: '/images/profile/element/ตุลา.png',

    color: '#1abc9c', 
    bgColor: '#F5B7CE',
    personality: 'เป็นคนที่ใจใหญ่ควักเงินง่าย ชอบการคิดวิเคราะห์ และมักทำให้คนรอบข้างมีความสุข',
    strength: 'มีความคิดสร้างสรรค์และหลากหลาย มีความสามารถในการเรียนรู้และแก้ปัญหา'
  },
  'Scorpio': { 
    name: 'ราศีพิจิก', 
    element: 'ธาตุน้ำ',
    image: '/images/profile/element/พฤศ.png',

    color: '#c0392b', 
    bgColor: '#774A8F',
    personality: 'มีความลึกลับและมีอำนาจ มีความมุ่งมั่นสูง มีสัญชาตญาณที่แม่นยำ เป็นคนที่มีความเข้มแข็งทางจิตใจ มีความภักดีและความจริงใจสูง',
    strength: 'มีความมุ่งมั่นและไม่ยอมแพ้ มีความเข้าใจในเรื่องลึกๆ มีพลังในการเปลี่ยนแปลงและฟื้นฟู มีความสามารถในการมองเห็นสิ่งที่ซ่อนอยู่'
  },
  'Sagittarius': { 
    name: 'ราศีธนู', 
    element: 'ธาตุไฟ',
    image: '/images/profile/element/ธันวา.png',

    color: '#2980b9', 
    bgColor: '#3D7953',
    personality: 'คนที่มีพลังงานมาก กระตือรือร้น มีเสน่ห์ และมักมีความเข้มงวด',
    strength: 'มีสติปัญญาเฉียบแหลม มีความรู้สึกอย่างเข้มงวดและตัดสินใจอย่างรวดเร็ว'
  },
  'Capricorn': { 
    name: 'ราศีมังกร', 
    element: 'ธาตุดิน',
    image: '/images/profile/element/มกรา.png',

    color: '#7f8c8d', 
    bgColor: '#998D75',
    personality: 'มีความเข้มงวดและมั่นคง มีความเคร่งครัดและเสมอภาค ชอบความเรียบง่ายและเป็นระเบียบ',
    strength: ' มีความรับผิดชอบและเน้นการปฏิบัติตามกฎเกณฑ์ มีความระมัดระวัง และ ประสานงานได้ดี'
  },
  'Aquarius': { 
    name: 'ราศีกุมภ์', 
    element: 'ธาตุลม',
    image: '/images/profile/element/กุมภา.png',

    color: '#9b59b6', 
    bgColor: '#517DEE',
     personality: 'เป็นคนที่ใจใหญ่ควักเงินง่าย ชอบการคิดวิเคราะห์ และมักทำให้คนรอบข้างมีความสุข',
    strength: 'มีความคิดสร้างสรรค์และหลากหลาย มีความสามารถในการเรียนรู้และแก้ปัญหา'
  },
  'Pisces': { 
    name: 'ราศีมีน', 
    element: 'ธาตุน้ำ',
    image: '/images/profile/element/มีนา.png',

    color: '#16a085', 
    bgColor: '#1ABAC5',
   personality: 'มีความเข้มงวดและมั่นคง มีความเคร่งครัดและเสมอภาค ชอบความเรียบง่ายและเป็นระเบียบ',
    strength: ' มีความรับผิดชอบและเน้นการปฏิบัติตามกฎเกณฑ์ มีความระมัดระวัง และ ประสานงานได้ดี'
  },
};

// ข้อมูลสถานที่ท่องเที่ยวประจำราศี - อัปเดตใหม่
const zodiacTravelDestinationsData = {
  'Aries': [
    {
      name: 'เทวสถานสำหรับพระนคร ท้าวเวสสุวรรณ ',
      image: '/images/profile/travel/ท้าวเวสุวรรณ.jpeg',
      mapLink: '',
      description: 'ท่านช่วยให้การเริ่มต้นนั้นมีความมั่นคง และปกป้องจากสิ่งไม่ดี เป็นช่วงเวลาที่ดีในการสร้างเสริมความสำเร็จ โดยเฉพาะการเงิน',
      category: 'การเงินธุรกิจ'
    },
    {
      name: 'เทวสถานสำหรับพระนคร พระพรหม',
      image: '/images/profile/travel/รูปพระพรหม.webp',
      mapLink: '',
      description: 'องค์เทพศิลปะสุโขทัย ท่านเป็นเทพแห่งการประทานความสุขและความสมบูรณ์ในชีวิตให้แก่ผู้ที่มากราบไหว้ ขอพร',
      category: 'ครอบครัว\nมิตรภาพ'
    },
  ],
  'Taurus': [
    {
      name: 'วัดสุทัศนเทพวราราม พระพุทธศรีศากยมุนี',
      image: '/images/profile/travel/พระศรีศากยมุนี.jpeg',
      mapLink: '',
      description: 'ท่านเป็นองคืพระปรางที่รับความเชื่อว่าช่วยในเรื่องการป้องกันอันตราย และเสริมความเป็นสิริมงคล',
      category: 'ภาพรวมทั่วไป'
    },
    {
      name: 'เทวสถานสำหรับพระนคร พระพิฆเนศ',
      image: '/images/profile/travel/พระพิฆเนศ.jpeg',
      mapLink: '',
      description: 'ท่านเป็นเทพแห่งการขจัดคราบและเริ่มต้นสิ่งใหม่ ๆ ในเรื่องใหม่ ๆ ในส่วนของงานการเงิน การเงินและเสริมโชคลาภในชีวิต',
      category: 'การเรียน\nการงาน'
    },
   
  ],
  'Gemini': [
    {
      name: 'วัดเทพมณเฑียร พระแม่ลักษมี',
      image: '/images/profile/travel/พระแม่ลักษมี.jpg',
      mapLink: '',
      description: 'สถานที่แนะนำประจำเดือนเกิดวัดเทพมณเฑียรพระแม่ลักษมีเป็นเทพเจ้าประทานพรให้สมหวังในเรื่องความรัก ความสัมพันธ์ที่มั่นคง และความเมตตาจากคนรอบข้าง อีกทั้งยังช่วยเสริมความเจริญรุ่งเรืองในชีวิต',
      category: 'ความรัก\nคู่ครอง'
    },
    {
      name: 'เทวสถานสำหรับพระนคร พระพิฆเนศ',
      image: '/images/profile/travel/พระพิฆเนศ.jpeg',
      mapLink: '',
      description: 'ท่านเป็นเทพแห่งการขจัดคราบและเริ่มต้นสิ่งใหม่ ๆ ในเรื่องใหม่ ๆ ในส่วนของงานการเงิน การเงินและเสริมโชคลาภในชีวิต',
      category: 'การเรียน\nการงาน'
    },
    
  ],
  'Cancer': [
    {
      name: 'วัดสุทัศนเทพวราราม ท้าวเวสสุวรรณ',
      image: '/images/profile/travel/ท้าวเวสุวรรณ.jpeg',
      mapLink: '',
      description: 'ท่านช่วยให้การเริ่มต้นนั้นมีความมั่นคง และปกป้องจากสิ่งไม่ดี เป็นช่วงเวลาที่ดีในการสร้างเสริมความสำเร็จ โดยเฉพาะการเงิน',
      category: 'ธุรกิจ\nการเงิน'
    },
    {
      name: 'วัดสุทัศนเทพวราราม พระสุนทรี วาณี',
      image: '/images/profile/travel/พระสุนทรีวาณี.jpeg',
      mapLink: '',
      description: 'เป็นองค์พระประทานที่ช่วยให้พรในด้านการเรียน หากได้กราบไหว้ หรือขอพร จะช่วยทำให้มีความจำ สติปัญญาดี และประสำความสำเร็จ ',
      category: 'การเรียน\nการงาน'
    },
  
  ],
  'Leo': [
    {
      name: 'ศาลเจ้าพ่อเสือ เจ้าพ่อเสือ',
      image: '/images/profile/travel/ศาสเจ้าพ่อเสือ.jpeg',
      mapLink: '',
      description: 'เป็นเทพเจ้าสายจีน จะช่วยเสริมดวงเรื่องความเมตตา การงานและการสนับสนุนให้พบกับความเจริญรุ่งเรืองในชีวิต',
      category: 'ภาพรวมทั่วไป'
    },
    {
      name: 'วัดเทพมณเฑียร พระแม่ลักษมี',
      image: '/images/profile/travel/พระแม่ลักษมี.jpg',
      mapLink: '',
      description: 'สถานที่แนะนำประจำเดือนเกิดวัดเทพมณเฑียรพระแม่ลักษมีเป็นเทพเจ้าประทานพรให้สมหวังในเรื่องความรัก ความสัมพันธ์ที่มั่นคง และความเมตตาจากคนรอบข้าง อีกทั้งยังช่วยเสริมความเจริญรุ่งเรืองในชีวิต',
      category: 'ความรัก\nคู่ครอง'
    },
   
  ],
  'Virgo': [
    {
      name: 'วัดสุทัศนเทพวราราม ท้าวเวสสุวรรณ',
      image: '/images/profile/travel/ท้าวเวสุวรรณ.jpeg',
      mapLink: '',
      description: 'ท่านช่วยให้การเริ่มต้นนั้นมีความมั่นคง และปกป้องจากสิ่งไม่ดี เป็นช่วงเวลาที่ดีในการสร้างเสริมความสำเร็จ โดยเฉพาะการเงิน',
      category: 'ธุรกิจ\nการเงิน'
    },
    
   
  ],
  'Libra': [
    {
      name: 'วัดสุทัศนเทพวราราม พระสุนทรี วาณี',
      image: '/images/profile/travel/พระสุนทรีวาณี.jpeg',
      mapLink: '',
      description: 'เป็นองค์พระประทานที่ช่วยให้พรในด้านการเรียน หากได้กราบไหว้ หรือขอพร จะช่วยทำให้มีความจำ สติปัญญาดี และประสำความสำเร็จ ',
      category: 'การเรียน\nการงาน'
    },
    {
      name: 'วัดเทพมณเฑียร พระแม่ลักษมี',
      image: '/images/profile/travel/พระแม่ลักษมี.jpg',
      mapLink: '',
      description: 'สถานที่แนะนำประจำเดือนเกิดวัดเทพมณเฑียรพระแม่ลักษมีเป็นเทพเจ้าประทานพรให้สมหวังในเรื่องความรัก ความสัมพันธ์ที่มั่นคง และความเมตตาจากคนรอบข้าง อีกทั้งยังช่วยเสริมความเจริญรุ่งเรืองในชีวิต',
      category: 'ความรัก\nคู่ครอง'
    },
   
  ],
  'Scorpio': [
    {
      name: 'วัดสุทัศนเทพวราราม พระกริ่งใหญ่',
      image: '/images/profile/travel/พระกริ่งใหญ่.jpeg',
      mapLink: '',
      description: 'เป็นองค์พระประทานที่ช่วยในด้านสุขภาพ โรคภัย ไข้เจ็บ',
      category: 'สุขภาพ\nโรคภัย'
    },
   
    
  ],
  'Sagittarius': [
    {
      name: 'วัดสุทัศนเทพวราราม พระพุทธตรีโลกเชษฐ์',
      image: '/images/profile/travel/พระพุทธตรีโลกเชษฐ์.jpeg',
      mapLink: '',
      description: 'เป็นองค์พระประทานที่ช่วยให้พรในด้านการให้โชคลาภ เรื่องของชื่อเสียงบุญวาสนากับผู้ที่ขอ',
      category: 'โชคลาภ\nวาสนา'
    },
    
  ],
  'Capricorn': [
    {
      name: 'วัดเทพมณเฑียร พระแม่ลักษมี',
      image: '/images/profile/travel/พระแม่ลักษมี.jpg',
      mapLink: '',
      description: 'สถานที่แนะนำประจำเดือนเกิดวัดเทพมณเฑียรพระแม่ลักษมีเป็นเทพเจ้าประทานพรให้สมหวังในเรื่องความรัก ความสัมพันธ์ที่มั่นคง และความเมตตาจากคนรอบข้าง อีกทั้งยังช่วยเสริมความเจริญรุ่งเรืองในชีวิต',
      category: 'ความรัก\nคู่ครอง'
    },
    {
      name: 'เทวสถานสำหรับพระนคร พระพิฆเนศ',
      image: '/images/profile/travel/พระพิฆเนศ.jpeg',
      mapLink: '',
      description: 'ท่านเป็นเทพแห่งการขจัดคราบและเริ่มต้นสิ่งใหม่ ๆ ในเรื่องใหม่ ๆ ในส่วนของงานการเงิน การเงินและเสริมโชคลาภในชีวิต',
      category: 'การเรียน\nการงาน'
    },
  ],
  'Aquarius': [
    {
      name: 'ศาลเจ้าพ่อเสือ เจ้าพ่อเสือ',
      image: '/images/profile/travel/ศาสเจ้าพ่อเสือ.jpeg',
      mapLink: '',
      description: 'เป็นเทพเจ้าสายจีน จะช่วยเสริมดวงเรื่องความเมตตา การงานและการสนับสนุนให้พบกับความเจริญรุ่งเรืองในชีวิต',
      category: 'ภาพรวมทั่วไป'
    },
    {
      name: 'เทวสถานสำหรับพระนคร พระพิฆเนศ',
      image: '/images/profile/travel/พระพิฆเนศ.jpeg',
      mapLink: '',
      description: 'เป็นเทพเจ้าประทานพรให้สมหวังในเรื่องความรัก ความสัมพันธ์ที่มั่นคง และความเมตตาจากคนรอบข้าง อีกทั้งยังช่วยเสริมความเจริญรุ่งเรืองในชีวิต',
      category: 'การเงิน\nธุรกิจ'
    },
   
  ],
  'Pisces': [
    {
      name: 'วัดสุทัศนเทพวราราม พระพุทธศรีศากยมุนี',
      image: '/images/profile/travel/พระศรีศากยมุนี.jpeg',
      mapLink: '',
      description: 'ท่านเป็นองคืพระปรางที่รับความเชื่อว่าช่วยในเรื่องการป้องกันอันตราย และเสริมความเป็นสิริมงคล',
      category: 'ภาพรวมทั่วไป'
    },
    {
      name: 'ศาลเจ้าพ่อเสือ เจ้าพ่อเสือ',
      image: '/images/profile/travel/ศาสเจ้าพ่อเสือ.jpeg',
      mapLink: '',
      description: 'เป็นเทพเจ้าสายจีน จะช่วยเสริมดวงเรื่องความเมตตา การงานและการสนับสนุนให้พบกับความเจริญรุ่งเรืองในชีวิต',
      category: 'ภาพรวมทั่วไป'
    }
    
  ],
};

// ฟังก์ชันแปลง hex เป็น rgba
const hexToRgba = (hex: string, opacityPercentage: number) => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const alpha = opacityPercentage / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// กำหนดเลขมงคลประจำราศี
const luckyNumbersByZodiac = {
  'Capricorn': [3, 8, 9],
  'Aquarius': [6, 8, 9],
  'Pisces': [3, 7, 8],
  'Aries': [6, 8, 9],
  'Taurus': [1, 4, 5],
  'Gemini': [5, 1, 9],
  'Cancer': [1, 5, 6],
  'Leo': [4, 6, 8],
  'Virgo': [2, 4, 6],
  'Libra': [3, 6, 5],
  'Scorpio': [1, 2, 4],
  'Sagittarius': [5, 6, 9],
};

// ฟังก์ชันสุ่มสีมงคล (อิงราศี)
const getLuckyColorsByZodiac = (zodiacSign: string) => {
  const colorMap = {
    'Capricorn': ['red', 'gray'],
    'Aquarius': ['pink', 'gray'],
    'Pisces': ['red', 'white'],
    'Aries': ['gray', 'blue'],
    'Taurus': ['gray', 'green'],
    'Gemini': ['yellow', 'white'],
    'Cancer': ['white', 'red'],
    'Leo': ['green', 'blue'],
    'Virgo': ['white', 'blue'],
    'Libra': ['yellow', 'blue'],
    'Scorpio': ['green', 'white'],
    'Sagittarius': ['blue', 'orange'],
  };
  const defaultColors = ['yellow', 'pink', 'blue'];
  return colorMap[zodiacSign as keyof typeof colorMap] || defaultColors;
};

// ฟังก์ชันแปลงวันเกิดเป็นราศี
const getZodiacSign = (birthDate: string | undefined) => {
  if (!birthDate) return "Aries";
  try {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return "Aries";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return "Aries";
  }
};

const formatBirthDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${getMonthName(month)} ${year}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return '';
  }
};

const getMonthName = (monthNum: string) => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months[parseInt(monthNum) - 1] || 'JAN';
};



export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [luckyColors, setLuckyColors] = useState<string[]>([]);
  const [zodiacSign, setZodiacSign] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bgStyles, setBgStyles] = useState({
    gradient: '#f0f0f0',
    textColor: '#7f8c8d',
    opacity: 100
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      const userZodiac = user.zodiacSign || (user.birthDate ? getZodiacSign(user.birthDate) : 'Aries');
      setZodiacSign(userZodiac);

      const zodiacInfo = zodiacElementsData[userZodiac as keyof typeof zodiacElementsData] || zodiacElementsData['Aries'];
      setBgStyles({
        gradient: zodiacInfo.bgColor,
        textColor: zodiacInfo.color,
        opacity: 60 // 60% สำหรับพื้นหลังหลัก
      });

      const destinationData = zodiacTravelDestinationsData[userZodiac as keyof typeof zodiacTravelDestinationsData] || zodiacTravelDestinationsData['Aries'];
      setDestinations(destinationData);

      const numbers = luckyNumbersByZodiac[userZodiac as keyof typeof luckyNumbersByZodiac] || luckyNumbersByZodiac['Aries'];
      setLuckyNumbers(numbers);

      const colors = getLuckyColorsByZodiac(userZodiac);
      setLuckyColors(colors);
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">กรุณาเข้าสู่ระบบ</div>;
  }

  const colorStyles = {
    yellow: { bg: '#FFD700', text: 'เหลือง' },
    pink: { bg: '#FFC0CB', text: 'ชมพู' },
    blue: { bg: '#87CEEB', text: 'ฟ้า' },
    white: { bg: '#FFFFFF', text: 'ขาว' },
    red: { bg: '#FF6347', text: 'แดง' },
    green: { bg: '#98FB98', text: 'เขียว' },
    cream: { bg: '#FFFDD0', text: 'ครีม' },
    orange: { bg: '#FFA500', text: 'ส้ม' },
    brown: { bg: '#A0522D', text: 'น้ำตาล' },
    purple: { bg: '#DDA0DD', text: 'ม่วง' },
    black: { bg: '#696969', text: 'ดำ' },
    'light blue': { bg: '#ADD8E6', text: 'ฟ้าอ่อน' },
    'dark blue': { bg: '#00008B', text: 'น้ำเงินเข้ม' },
  };
  
  const avatarUrl = user.avatar || '/images/profile/travel/Profile.jpeg';
  const userName = user.fullName || user.email.split('@')[0];
  const formattedBirthDate = user.birthDate ? formatBirthDate(user.birthDate) : '';
  
  return (
    <>
      <Head>
        <title>โปรไฟล์ - NUMMU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center shadow-sm relative z-10">
          <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-white p-2 rounded-full"
              style={{ 
                color: hexToRgba(bgStyles.gradient, 100) 
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          <div 
            className="font-bold text-xl ml-9" 
            style={{ 
              color: hexToRgba(bgStyles.gradient, 100)
            }}
          >
            NUMMU
          </div>
          <div className="flex space-x-2">
          <Link href="/notifications" passHref>
            <button className=" text-white p-2 rounded-full"
              style={{ 
                backgroundColor: hexToRgba(bgStyles.gradient, 100) 
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            </Link>
          
            <button className=" text-white p-2 rounded-full"
              style={{ 
                backgroundColor: hexToRgba(bgStyles.gradient, 100) 
                
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
          </div>
        </header>

        <div className="bg-white relative pb-24">
          {/* Profile Avatar - Positioned to overlap */}
          <div className="absolute bottom-0 left-8 transform translate-y-1/2 z-20">
            <div className="w-32 h-32 rounded-full overflow-hidden border-6 border-white bg-gray-200 shadow-lg">
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/profile/travel/Profile.jpeg';
                }}
              />
            </div>
          </div>
        </div>

        {/* Colored Background Section - Content Area */}
        <div 
          className="flex-1 relative pb-20"
          style={{ 
            backgroundColor: hexToRgba(bgStyles.gradient, bgStyles.opacity), // 60%
            borderTopRightRadius: '180px'
          }}
        >
          {/* User Info - positioned to the right of profile picture */}
          <div className="pt-8 pl-48 pr-8 ">
            <h2 className="text-white text-3xl font-semibold">
              {userName}
            </h2>
            {formattedBirthDate && (
              <p className="text-white text-xl mt-2 opacity-90">
                {formattedBirthDate}
              </p>
            )}
          </div>
          <div className="px-6 pt-8">
            {/* Lucky Numbers and Colors Section */}
            <div 
              className="mb-6 bg-opacity-95 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
              style={{ 
                backgroundColor: hexToRgba(bgStyles.gradient, 80), // 80%
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex">
                <div className="w-1/2 pr-4">
                  <h3 className="text-white text-sm mb-4 opacity-80">เลขมงคล</h3>
                  <div className="text-white text-5xl font-bold leading-tight">
                    {luckyNumbers && luckyNumbers.length >= 3 ? (
                      <>
                        <div className="mb-2">{luckyNumbers[0]} {luckyNumbers[1]} {luckyNumbers[2]}</div>
                      </>
                    ) : (
                      <div>-- --<br />-- --</div>
                    )}
                  </div>
                </div>
                
                {/* Lucky Colors - Right Side */}
                <div className="w-1/2 pl-4">
                  <h3 className="text-white text-sm mb-4 opacity-80">สีมงคล</h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex h-16 rounded-2xl overflow-hidden shadow-sm">
                      {luckyColors && luckyColors.length > 0 ? (
                        luckyColors.slice(0, 2).map((color, index) => (
                          <div 
                            key={index}
                            className="flex-1" 
                            style={{ 
                              backgroundColor: colorStyles[color as keyof typeof colorStyles]?.bg || '#CCCCCC' 
                            }}
                          />
                        ))
                      ) : (
                        <div className="w-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-white opacity-80">
                      {luckyColors && luckyColors.length > 0 ? (
                        luckyColors.slice(0, 2).map((color, index) => (
                          <span key={index}>
                            {colorStyles[color as keyof typeof colorStyles]?.text || color}
                          </span>
                        ))
                      ) : (
                        <><span>แดง</span><span>เทา</span></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Zodiac Chart Section */}
            <div 
              className="mb-6 rounded-3xl p-6 shadow-lg"
              style={{ 
                backgroundColor: hexToRgba(bgStyles.gradient, 80), // 80%
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">
                ธาตุประจำตัว
              </h3>
              
              <img  
  className="h-38 object-cover mx-auto"
  src={zodiacElementsData[zodiacSign as keyof typeof zodiacElementsData]?.image}
/>

              
              <div className="space-y-3 text-white">
                <h3 className="text-white text-lg font-semibold mb-4">
                  {zodiacElementsData[zodiacSign as keyof typeof zodiacElementsData]?.element || 'ราศีไฟ'}
                </h3>
                <p className="text-base">
                  <span className="font-medium">บุคลิก :</span> {zodiacElementsData[zodiacSign as keyof typeof zodiacElementsData]?.personality || 'คนที่มีไฟลุกจำมาก กระตือรือร้น มีเสน่ห์ และปกป้องความเป็นของจริง'}
                </p>
                <p className="text-base">
                  <span className="font-medium">จุดเด่น :</span> {zodiacElementsData[zodiacSign as keyof typeof zodiacElementsData]?.strength || 'มีสติปัญญาเฉียบแหลม มีความรู้สึกอ่อนไหวและติดสินใจอย่างรวดเร็ว'}
                </p>
              </div>
            </div>
            
            {/* Travel Destinations Section */}
            <div 
              className="mb-8 rounded-3xl p-6 shadow-lg"
              style={{ 
                backgroundColor: hexToRgba(bgStyles.gradient, 55), // 55%
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3 className="text-white text-lg font-semibold mb-6">
                สถานที่แนะนำ<br />ประจำราศี
              </h3>
              
              {destinations && destinations.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex overflow-x-hidden space-x-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
                    {destinations.map((destination: any, index: number) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 w-80 relative"
                        style={{ scrollSnapAlign: 'start' }}
                        onClick={() => router.push(`/information/${destination.id}?type=buddha`)}
                      >
                        <img 
                          src={destination.image} 
                          alt={destination.name} 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/profile/travel/default.jpg";
                          }}
                        />
                        {/* Content below image instead of overlay */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-semibold text-white-800">{destination.name}</h4>
                            <span className="bg-[#40B828] text-white-800 px-3 py-1 rounded-full text-xs font-medium text-center">
                              {destination.category}
                            </span>
                          </div>
                          <p className="font-medium">
                            {destination.description}
                            
                          </p>
                          <a 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium"
                          >
                            Google Map
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center space-x-2 mt-4">
                    {destinations.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-yellow-400' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-white opacity-75">
                  ไม่พบข้อมูลสถานที่ท่องเที่ยว กรุณาระบุวันเกิดในโปรไฟล์
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation Bar */}
        <BottomNavigation activePage="profile" />
        <ProfileSlideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </>
  );
}