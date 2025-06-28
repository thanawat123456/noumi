import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import WhiteHeaderProfile from "../header-profile/white-header";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "../BottomNavigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { styled } from "@mui/material/styles";
// import { PickersDay } from "@mui/x-date-pickers/PickersDay";

const CustomCalendarWrapper = styled("div")({
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "20px",
  width: "100%",
  maxWidth: "360px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  boxSizing: "border-box",
});

const specialDays = {
  6: { text: "ขอขมากรรม", bgColor: "#9F95D6" },
  13: { text: "ขอขมากรรม", bgColor: "#9F95D6" },
  28: { text: "ตักบาตรเทโว", bgColor: "#9F95D6" },
  29: { text: "ตักบาตรเทโว", bgColor: "#9F95D6" },
};

export default function CeremonyCalendarPanel() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  // const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // ฟังก์ชันสำหรับปุ่มย้อนกลับ
  const handleBackClick = () => {
    router.push("/ceremonies");
  };

  useEffect(() => {
    dayjs.locale('th');
  }, []);

  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // const isSpecialDay = (day: Dayjs) => {
  //   const dayOfMonth = day.date();
  //   return specialDays[dayOfMonth as keyof typeof specialDays];
  // };

  // แสดงการโหลด
  if (isLoading) {
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
        <title>พิธีกรรม - Nummu App</title>
        <meta name="description" content="พิธีกรรมต่างๆ ในพุทธศาสนา" />
      </Head>

      <div className="bg-white text-white rounded-b-3xl">
        <WhiteHeaderProfile />
        <div className="bg-[#FF7A05] flex items-center justify-between relative pt-8 pb-20 pl-4 mt-10 rounded-tl-[50px]">
          <div className="flex items-center space-x-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleBackClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold absolute left-1/2 -translate-x-1/2">
            พิธีกรรม
          </h2>
        </div>

        {/* Tabs */}
        <div className="bg-yellow-100 min-h-screen flex flex-col items-center pt-6 -mt-10 z-10 relative rounded-t-[35px] w-full">
          <div className="flex justify-around w-full max-w-md mb-4 text-orange-500 font-semibold text-lg">
            <div>ขอขมากรรม</div>
            <div>ตารางกิจกรรม</div>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
            <div className="flex justify-center w-full px-4">
              <CustomCalendarWrapper>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{
                    "& .MuiPickersCalendarHeader-label": {
                      backgroundColor: "#FF5A1F",
                      color: "white",
                      borderRadius: "10px",
                      padding: "4px 16px",
                      fontWeight: "bold",
                    },
                    "& .MuiPickersDay-root": {
                      fontSize: "1rem",
                      width: 42,
                      height: 42,
                      margin: "0 4px",
                      borderRadius: "50%",
                    },
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#FF5A1F",
                      color: "#fff",
                    },
                    "& .MuiPickersDay-root:hover": {
                      backgroundColor: "#FF5A1F",
                      color: "#fff",
                    },
                    // วันที่ 6 และ 13 - ทำวัตรใหญ่
                    "& .MuiPickersDay-root[aria-label*='6,'], & .MuiPickersDay-root[aria-label*='13,']":
                      {
                        backgroundColor: "#9F95D6 !important",
                        color: "white !important",
                        fontWeight: "bold !important",
                        "&:hover": {
                          backgroundColor: "#8A7BC8 !important",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#9F95D6 !important",
                        },
                      },
                    // วันที่ 28 และ 29 - ตักบาตรเทโว
                    "& .MuiPickersDay-root[aria-label*='28,'], & .MuiPickersDay-root[aria-label*='29,']":
                      {
                        backgroundColor: "#9F95D6 !important",
                        color: "white !important",
                        fontWeight: "bold !important",
                        "&:hover": {
                          backgroundColor: "#8A7BC8 !important",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#9F95D6 !important",
                        },
                      },
                  }}
                />
              </CustomCalendarWrapper>
            </div>
          </LocalizationProvider>

          {/* ภาพ temple อยู่ด้านล่าง */}
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
            <img
              src="/temple-cld.png"
              alt="Temple"
              className="w-100 h-auto"
              style={{ maxHeight: "200px" }}
            />
          </div>

          {/* แสดงข้อมูลวันที่เลือกเฉพาะเมื่อเป็นวันพิเศษ - ทับภาพ temple */}
          {selectedDate &&
            specialDays[selectedDate.date() as keyof typeof specialDays] && (
              <div className="fixed bottom-35 left-1/2 transform -translate-x-1/2 px-4 w-full max-w-md z-20 px-15">
                <h3 className="text-lg font-bold text-center text-gray-700 mb-4">
                  วันสำคัญที่เลือก
                </h3>
                <div
                  className="p-4 rounded-xl shadow text-center text-white text-xl font-bold"
                  style={{
                    backgroundColor:
                      specialDays[
                        selectedDate.date() as keyof typeof specialDays
                      ].bgColor,
                  }}
                >
                  วันที่ {selectedDate.date()} -{" "}
                  {
                    specialDays[selectedDate.date() as keyof typeof specialDays]
                      .text
                  }
                </div>
              </div>
            )}
        </div>

        <BottomNavigation />
      </div>
    </>
  );
}
