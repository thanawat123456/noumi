import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function NummuHome() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [cloudMargin, setCloudMargin] = useState("-mb-100");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width === 375 && height === 667) {
        setCloudMargin("-mb-63");
      } else if (width === 350 && height === 667) {
        setCloudMargin("-mb-63");
      } else if (width === 300 && height === 667) {
        setCloudMargin("-mb-53");
      } else if (width === 430 && height === 932) {
        setCloudMargin("-mb-110");
      } else if (width === 414 && height === 896) {
        setCloudMargin("-mb-105");
      } else if (width === 390 && height === 844) {
        setCloudMargin("-mb-95");
      } else {
        setCloudMargin("-mb-100"); // default
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <>
      <Head>
        <title>Welcome - Nummu App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
          }
        `}</style>
      </Head>

      <div className="fixed inset-0 flex items-center justify-center bg-[#FFDCE6]">
        <div className="w-full max-w-md h-screen rounded-3xl overflow-hidden relative">
          {/* Orange top section */}
          <div
            className="flex flex-col items-center justify-center bg-[#FF7A05] rounded-3xl px-8 pt-12 pb-40 relative"
            style={{
              backgroundImage: "url(/images/orange-bg-full.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "75%",
            }}
          >
            {/* Nummu logo */}
            <div className="w-45 h-50 mb-4 mt-4 z-20">
              <img
                src="/images/noumi.png"
                alt="Nummu Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Guide image */}
            <div className="w-25 h-12 mb-12 z-20">
              <img
                src="/images/nummu-guides.png"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Wat Suthat image */}
            <div className="w-40 h-12 -mb-63 absolute z-20">
              <img
                src="/images/wat-suthat.svg"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Cloud image with responsive positioning */}
            <div className={`w-125 h-full ${cloudMargin} absolute z-10`}>
              <img
                src="/temple-cld.png"
                className="w-full h-full object-contain opacity-60"
              />
            </div>

            {/* Pink bottom curve */}
            <div
              className="absolute bottom-0 left-0 right-0 h-18 bg-[#FFDCE6]"
              style={{ borderTopLeftRadius: "200px" }}
            ></div>
          </div>

          {/* Buttons */}
          <div className="absolute bottom-18 left-0 right-0 px-8 flex flex-col space-y-4 z-30">
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-[#FF8CB7] hover:bg-[#FF7A05] transition text-[#FFDCE6] rounded-full"
            >
              Log In
            </button>

            <button
              onClick={handleSignUp}
              className="w-full py-3 bg-[#FF8CB7] hover:bg-[#FF7A05] transition text-[#FFDCE6] rounded-full"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
