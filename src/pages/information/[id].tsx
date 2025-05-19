import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InformationPage from '@/components/information/InformationPage';

const InformationDetailPage = () => {
  const router = useRouter();
  const { id, type } = router.query;
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (router.isReady && id) {
      setIsReady(true);
    }
  }, [router.isReady, id]);
  
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }
  
  if (!type || (type !== 'temple' && type !== 'buddha')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-red-500 mb-2">ข้อมูลไม่ถูกต้อง</h1>
          <p className="text-gray-600 mb-4">ไม่พบประเภทข้อมูลที่ต้องการแสดงผล</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-500 text-white rounded-full"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }
  
  return <InformationPage type={type as 'temple' | 'buddha'} id={id} />;
};

export default InformationDetailPage;