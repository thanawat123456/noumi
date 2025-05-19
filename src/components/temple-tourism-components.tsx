// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '../contexts/AuthContext';

// // Define interfaces for component props
// interface MainLayoutProps {
//   children: React.ReactNode;
// }

// interface CategoryButtonProps {
//   icon: React.ReactNode;
//   label: string;
//   onClick: () => void;
// }

// interface NavButtonProps {
//   icon: React.ReactNode;
//   isActive: boolean;
// }

// interface Temple {
//   id: number;
//   name: string;
//   image: string;
//   highlighted: boolean;
// }

// interface BuddhaStatue {
//   id: number;
//   name: string;
//   location: string;
//   image: string;
//   tags: string[];
// }

// // Main App Layout Component
// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Fixed Header */}
//       <header className="bg-orange-500 text-white p-4 rounded-b-3xl">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 rounded-full overflow-hidden">
//               <img
//                 src={user?.avatar || '/api/placeholder/48/48'}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-white text-sm">สวัสดี,ยินดีต้อนรับ</p>
//               <h3 className="text-white text-xl font-medium">
//                 {user?.fullName || 'Praewwy :)'}
//               </h3>
//             </div>
//           </div>
//           <div className="flex space-x-3">
//             <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
//               <svg
//                 className="w-6 h-6 text-orange-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                 />
//               </svg>
//             </button>
//             <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
//               <svg
//                 className="w-6 h-6 text-orange-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="mt-4">
//           <h2 className="text-white text-lg">
//             Nummu นำใจ นำพาคุณ<br />
//             ตามหาแหล่งที่พึ่งพาทางจิตใจและเข้าถึง<br />
//             การไหว้พระ ขอพร ที่สะดวก ง่าย ในที่เดียว
//           </h2>
//         </div>

//         {/* Search Bar */}
//         <div className="mt-6 relative">
//           <div className="flex items-center bg-white rounded-full px-4 py-2">
//             <svg
//               className="w-6 h-6 text-orange-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//             <input
//               type="text"
//               placeholder="ค้นหา..."
//               className="flex-1 bg-transparent border-none focus:outline-none px-3"
//             />
//             <svg
//               className="w-6 h-6 text-orange-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="mt-8 grid grid-cols-4 gap-4 pb-4">
//           <CategoryButton
//             icon={
//               <svg
//                 className="w-12 h-12 text-orange-200"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//             }
//             label="สถานที่ศักดิ์สิทธิ์"
//             onClick={() => {}}
//           />

//           <CategoryButton
//             icon={
//               <svg
//                 className="w-12 h-12 text-orange-200"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//                 />
//               </svg>
//             }
//             label="สถานที่ขอดวงพร"
//             onClick={() => {}}
//           />

//           <CategoryButton
//             icon={
//               <svg
//                 className="w-12 h-12 text-orange-200"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             }
//             label="สถานที่พิธีกรรม"
//             onClick={() => {}}
//           />

//           <CategoryButton
//             icon={
//               <svg
//                 className="w-12 h-12 text-orange-200"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <circle
//                   cx="9"
//                   cy="7"
//                   r="4"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M23 21v-2a4 4 0 00-3-3.87"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M16 3.13a4 4 0 010 7.75"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             }
//             label="สถานที่กิจกรรม"
//             onClick={() => {}}
//           />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="px-4 py-6">{children}</main>

//       {/* Navigation */}
//       <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3">
//         <NavButton
//           icon={
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//               />
//             </svg>
//           }
//           isActive={true}
//         />
//         <NavButton
//           icon={
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           }
//           isActive={false}
//         />
//         <NavButton
//           icon={
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//               />
//             </svg>
//           }
//           isActive={false}
//         />
//         <NavButton
//           icon={
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//           }
//           isActive={false}
//         />
//       </nav>
//     </div>
//   );
// };

// // Category Button Component
// const CategoryButton: React.FC<CategoryButtonProps> = ({ icon, label, onClick }) => {
//   return (
//     <button
//       className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
//       onClick={onClick}
//     >
//       <div className="mb-2">{icon}</div>
//       <p className="text-orange-500 text-center text-sm font-medium">{label}</p>
//     </button>
//   );
// };

// // Navigation Button Component
// const NavButton: React.FC<NavButtonProps> = ({ icon, isActive }) => {
//   return (
//     <button className={`p-2 rounded-full ${isActive ? 'text-pink-500' : 'text-gray-400'}`}>
//       {icon}
//     </button>
//   );
// };

// // Temple List Screen Component
// const TempleListScreen: React.FC = () => {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<string>('ทั้งหมด');

//   const tabs = ['ทั้งหมด', 'นิยม', 'ใหม่'];

//   const temples: Temple[] = [
//     {
//       id: 1,
//       name: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/300/200',
//       highlighted: true,
//     },
//     {
//       id: 2,
//       name: 'ศาลเจ้าหัวเวียง',
//       image: '/api/placeholder/300/200',
//       highlighted: false,
//     },
//     {
//       id: 3,
//       name: 'วัดพระแก้วมณีศรี',
//       image: '/api/placeholder/300/200',
//       highlighted: false,
//     },
//     {
//       id: 4,
//       name: 'หอสวดมหาสมัครธรรม',
//       image: '/api/placeholder/300/200',
//       highlighted: false,
//     },
//   ];

//   const handleTempleClick = (templeId: number) => {
//     router.push(`/temple/${templeId}`);
//   };

//   return (
//     <div className="pb-16">
//       {/* Header */}
//       <div className="bg-orange-500 text-white p-4 rounded-b-3xl -mx-4 -mt-6">
//         <div className="flex items-center mb-4">
//           <button className="mr-4">
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           <h2 className="text-2xl font-semibold">สถานที่</h2>
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="ค้นหาชื่อวัด..."
//             className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
//           />
//           <svg
//             className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex space-x-2 mt-4 mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-6 py-2 rounded-full text-sm font-medium ${
//               activeTab === tab ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-600'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Temple List */}
//       <div className="space-y-4">
//         {temples.map((temple) => (
//           <div
//             key={temple.id}
//             className={`rounded-xl overflow-hidden ${
//               temple.highlighted ? 'bg-yellow-300' : 'bg-gray-200'
//             }`}
//             onClick={() => handleTempleClick(temple.id)}
//           >
//             <div className="flex h-24">
//               <div className="flex-1 p-4 flex flex-col justify-center">
//                 <h3
//                   className={`font-medium text-lg ${
//                     temple.highlighted ? 'text-orange-600' : 'text-gray-600'
//                   }`}
//                 >
//                   {temple.highlighted ? 'วัดสุทัศน์เทพวราราม' : temple.name}
//                 </h3>
//               </div>
//               <div className="w-1/2">
//                 <img
//                   src={temple.image}
//                   alt={temple.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Buddha Statues List Screen Component
// const BuddhaStatuesScreen: React.FC = () => {
//   const router = useRouter();
//   const { id: templeId } = router.query as { id: string };
//   const [activeTab, setActiveTab] = useState<string>('ทั้งหมด');

//   const tabs = ['ทั้งหมด', 'ที่นิยม'];

//   const buddhaStatues: BuddhaStatue[] = [
//     {
//       id: 1,
//       name: 'พระศรีศากยมุนี',
//       location: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/150/150',
//       tags: ['ภาพรวมถึงบ้าน'],
//     },
//     {
//       id: 2,
//       name: 'พระสุนทรี วาณี',
//       location: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/150/150',
//       tags: ['การงานการเรียน'],
//     },
//     {
//       id: 3,
//       name: 'พระพุทธรังสีมุนราชัย',
//       location: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/150/150',
//       tags: ['โชคลาภวาสนา'],
//     },
//     {
//       id: 4,
//       name: 'ต้นพระศรีมหาโพธิ์',
//       location: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/150/150',
//       tags: ['ภาพรวมถึงบ้าน'],
//     },
//     {
//       id: 5,
//       name: 'พระพุทธรังเล็กนอย',
//       location: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/150/150',
//       tags: ['สุขภาพโรคภัย'],
//     },
//     {
//       id: 6,
//       name: 'พระเพทรสมณภูมิ',
//       location: 'วัดสุทัศน์เทพวราราม',
//       image: '/api/placeholder/150/150',
//       tags: ['ความมงคล'],
//     },
//   ];

//   const handleBuddhaStatueClick = (statueId: number) => {
//     router.push(`/temple/${templeId}/statue/${statueId}`);
//   };

//   return (
//     <div className="pb-16">
//       {/* Header */}
//       <div className="bg-orange-500 text-white p-4 rounded-b-3xl -mx-4 -mt-6">
//         <div className="flex items-center mb-4">
//           <button className="mr-4" onClick={() => router.back()}>
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           <h2 className="text-2xl font-semibold">วัดสุทัศน์เทพวราราม</h2>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex space-x-2 mt-4 mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-6 py-2 rounded-full text-sm font-medium ${
//               activeTab === tab ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-600'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Buddha Statues List */}
//       <div className="space-y-6">
//         {buddhaStatues.map((statue) => (
//           <div
//             key={statue.id}
//             className="flex items-center border-b border-gray-200 pb-6"
//             onClick={() => handleBuddhaStatueClick(statue.id)}
//           >
//             <div className="w-24 h-24 overflow-hidden rounded-lg">
//               <img
//                 src={statue.image}
//                 alt={statue.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="ml-4 flex-1">
//               <h3 className="font-medium text-lg text-orange-600">{statue.name}</h3>
//               <p className="text-sm text-gray-500">{statue.location}</p>
//               <p className="text-sm text-gray-500 mt-1">เยี่ยมชม</p>
//             </div>
//             <div>
//               <div className="bg-yellow-100 text-yellow-800 rounded-full px-4 py-1 text-sm">
//                 {statue.tags[0]}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // App Component to demonstrate screens
// const TempleTourismApp: React.FC = () => {
//   const [currentScreen, setCurrentScreen] = useState<'home' | 'temples' | 'buddhaStatues'>('home');
//   const [selectedTempleId, setSelectedTempleId] = useState<number | null>(null);

//   const handleTempleSelect = (id: number) => {
//     setSelectedTempleId(id);
//     setCurrentScreen('buddhaStatues');
//   };

//   const handleBackToTemples = () => {
//     setCurrentScreen('temples');
//   };

//   const handleShowTemples = () => {
//     setCurrentScreen('temples');
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       <div className="flex space-x-4 justify-center">
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={() => setCurrentScreen('home')}
//         >
//           Show Home
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={handleShowTemples}
//         >
//           Show Temples
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={() => setCurrentScreen('buddhaStatues')}
//         >
//           Show Buddha Statues
//         </button>
//       </div>

//       <div className="border border-gray-300 rounded-lg overflow-hidden max-w-md mx-auto shadow-lg">
//         <MainLayout>
//           {currentScreen === 'home' && (
//             <div className="mt-4">
//               <h2 className="text-2xl font-bold text-orange-500 mb-4">ข่าวสาร</h2>

//               <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
//                 <button className="px-6 py-2 rounded-full text-sm font-medium bg-pink-100 text-pink-500 whitespace-nowrap">
//                   ALL
//                 </button>
//                 <button className="px-6 py-2 rounded-full text-sm font-medium bg-pink-400 text-white whitespace-nowrap">
//                   FESTIVAL
//                 </button>
//                 <button className="px-6 py-2 rounded-full text-sm font-medium bg-pink-100 text-pink-500 whitespace-nowrap">
//                   TRIVIA
//                 </button>
//                 <button className="px-6 py-2 rounded-full text-sm font-medium bg-pink-100 text-pink-500 whitespace-nowrap">
//                   เกี่ยวกับเรา
//                 </button>
//               </div>

//               <p onClick={handleShowTemples} className="text-blue-500 underline cursor-pointer">
//                 คลิกที่นี่เพื่อไปยังหน้าวัดทั้งหมด
//               </p>
//             </div>
//           )}

//           {currentScreen === 'temples' && <TempleListScreen />}

//           {currentScreen === 'buddhaStatues' && <BuddhaStatuesScreen />}
//         </MainLayout>
//       </div>
//     </div>
//   );
// };

// export default TempleTourismApp;