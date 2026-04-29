import Sidebar from "@/components/Sidebar";
import type { PropsWithChildren } from "react";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8f2ff_0%,#fbfbff_42%,#fffdf7_100%)] p-2 sm:p-4 lg:p-5">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 lg:flex-row lg:gap-4">
        <Sidebar />
        <main className="min-w-0 flex-1 rounded-[28px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] p-4 shadow-[0_18px_56px_rgba(110,88,209,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
