import { Suspense } from "react";
import AppRoutes from "@/routes";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col relative z-10">
          <Topbar />
          <main className="px-4 md:px-8 lg:px-10 py-6 pt-8">
            <div className="page-surface rounded-3xl p-4 md:p-6 hair-border">
              <div className="mx-auto w-full max-w-7xl">
                <Suspense fallback={<div className="text-sm opacity-60">Loading…</div>}>
                  <AppRoutes />
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}