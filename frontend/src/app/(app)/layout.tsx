import Rail from "@/components/Rail";
import TopBar from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Rail />
      <div className="flex-1 min-h-screen" style={{ marginLeft: "var(--shell-rail-w)" }}>
        <TopBar />
        <main className="px-6 pb-10 pt-2 max-w-[1280px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}