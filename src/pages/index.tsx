import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function NummuHome() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

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

      <div className="fixed inset-0 flex items-center justify-center bg-[#FF7A05]">
        <div className="w-full max-w-md h-screen overflow-hidden relative pb-20">
          <div
            className="flex flex-col items-center justify-center bg-[#FF7A05] px-8 pt-12 pb-40 relative"
            style={{
              backgroundImage: "url(/images/orange-bg-full.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "75%",
            }}
          >
            <div className="w-45 h-48 mb-4 mt-4 z-20">
              <img
                src="/images/noumi.png"
                alt="Nummu Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-25 h-12 mb-12 z-20">
              <img
                src="/images/nummu-guides.png"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-40 h-12 -mb-63 absolute z-20">
              <img
                src="/images/wat-suthat.svg"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 z-10 w-[500px]">
              <img
                src="/temple-cld.png"
                className="w-full h-auto object-bottom opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFDCE6] rounded-tl-[100px] absolute bottom-0 left-0 right-0 px-8 -mt-20 flex flex-col space-y-4 z-30 pt-20 pb-22">
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
    </>
  );
}
