"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <main className="bg-[#FAFAFA] min-h-screen flex items-center justify-center w-full">
        {children}
      </main>
      <Toaster />
    </NextUIProvider>
  );
}
