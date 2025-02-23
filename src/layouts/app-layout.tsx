"use client";

import { AppFooter, AppNavbar } from "@/components/layouts/app";
import { ColorBubbles } from "@/helpers/color-bubbles";
import { AppProvider } from "@/providers";

export const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AppProvider>
      <div
        className='w-screen h-screen overflow-hidden inset-0 flex flex-col justify-center items-center bg-gradient-to-br 
      from-purple-600 via-pink-600 to-blue-600
    relative bg-black'>
        <ColorBubbles />

        <AppNavbar />
        <div className='w-full h-full overflow-hidden z-10'>{children}</div>
        <AppFooter />
      </div>
    </AppProvider>
  );
};
