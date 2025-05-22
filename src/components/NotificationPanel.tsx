import React from 'react';
import Link from 'next/link'; 
import type { JSX } from 'react';

interface Notification {
  id: number;
  date: string;
  time: string;
  title: string;
  description: string;
  icon: 'calendar' | 'edit' | 'document' | 'chat';
}

const NotificationPanel: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: 1,
      date: 'Today',
      time: '2M',
      title: 'Scheduled Appointment',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'calendar',
    },
    {
      id: 2,
      date: 'Today',
      time: '2H',
      title: 'Scheduled Change',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'edit',
    },
    {
      id: 3,
      date: 'Today',
      time: '2H',
      title: 'Medical Notes',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'document',
    },
    {
      id: 4,
      date: 'Yesterday',
      time: '1D',
      title: 'Scheduled Appointment',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'calendar',
    },
    {
      id: 5,
      date: '15 April',
      time: '5D',
      title: 'Medical History Update',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'chat',
    },
    {
      id: 6,
      date: '15 April',
      time: '5D',
      title: 'Medical History Update',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'chat',
    },
  ];

  const getIcon = (iconType: Notification['icon']) => {
    const icons: { [key in Notification['icon']]: JSX.Element } = {
      calendar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      edit: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      document: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      chat: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    };
    return icons[iconType] || icons['calendar'];
  };

  const translateTitle = (title: string): string => {
    const translations: { [key: string]: string } = {
      'Scheduled Appointment': 'นัดหมายที่กำหนด',
      'Scheduled Change': 'การเปลี่ยนแปลงที่กำหนด',
      'Medical Notes': 'บันทึกทางการแพทย์',
      'Medical History Update': 'การอัปเดตประวัติทางการแพทย์',
    };
    return translations[title] || title;
  };

  return (
    <div className="w-full max-w-[414px] mx-auto bg-[#FFF0F4] min-h-screen">
      <div className="bg-orange-500 h-[150px]  text-white px-4 pt-4 pb-6 rounded-t-30xl rounded-bl-[80px] flex items-center justify-between relative">
        <Link href="/" passHref>
          <button className="w-10 h-8 rounded-fullflex items-center justify-center">
            <svg className="w-10 h-5 text-white-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>
        <h2 className="text-xl font-semibold text-center flex-1">การแจ้งเตือน</h2>
      </div>
      <div className="p-4 text-orange-500">
        {Object.entries(
          notifications.reduce((acc: { [key: string]: Notification[] }, notification: Notification) => {
            if (!acc[notification.date]) acc[notification.date] = [];
            acc[notification.date].push(notification);
            return acc;
          }, {})
        ).map(([date, dateNotifications]: [string, Notification[]]) => (
          <div key={date} className="mb-4">
            <h1 className="mr-6 text-orange-500 ">{date}</h1>
            {dateNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-[#FFDCE6] p-4 mb-2 rounded-lg flex items-start"
              >
                <div className="mr-4 text-orange-500">{getIcon(notification.icon)}</div>
                <div>
                  <h4 className="font-medium text-orange-500">{translateTitle(notification.title)}</h4>
                  <p className="text-gray-600 text-sm">{notification.description}</p>
                  <span className="text-gray-500 text-xs">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;