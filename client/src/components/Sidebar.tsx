import sidebarImage from "@/assets/sidebar-image.webp";
import { useAppSession } from "@/contexts/AppSessionContext";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { BookOpen, FolderOpen, Sparkles, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { appUser } = useAppSession();

  const navigationItems = [
    {
      href: "/",
      label: "New Batch Run",
      icon: Sparkles,
      active: location === "/",
    },
    {
      href: "/runs",
      label: "Runs",
      icon: FolderOpen,
      active: location.startsWith("/runs"),
    },
    ...(appUser?.role === "admin"
      ? [
          {
            href: "/team",
            label: "Team",
            icon: Users,
            active: location.startsWith("/team"),
          },
        ]
      : []),
  ];

  return (
    <aside className="w-full lg:max-w-[18rem] lg:min-w-[18rem]">
      <div className="relative flex h-full min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-[28px] border border-white/85 bg-white/82 p-4 shadow-[0_18px_56px_rgba(119,94,226,0.12)] backdrop-blur-xl lg:min-h-[calc(100vh-2rem)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.17),_transparent_33%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.08),_transparent_26%)]" />

        <div className="relative flex items-center gap-3 px-2 pb-6 pt-1">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#8358ff_0%,#6f46ec_45%,#a56eff_100%)] text-white shadow-[0_12px_24px_rgba(122,83,242,0.28)]">
            <BookOpen className="h-6 w-6" />
            <span className="absolute -right-1 top-1 h-2 w-2 rounded-full bg-white/95" />
            <span className="absolute left-1 top-0 h-2.5 w-2.5 rounded-full bg-[#ffd98a]" />
          </div>
          <div>
            <h1 className="text-[1.72rem] font-extrabold leading-none tracking-[-0.04em] text-[#20154f]">
              Kids Book
            </h1>
            <p className="mt-1 text-[0.95rem] font-semibold leading-none text-[#7447ef]">
              Automation
            </p>
          </div>
        </div>

        <nav className="relative mt-1 space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[16px] border px-4 py-3.5 text-left text-[0.97rem] font-semibold transition-all duration-200",
                  item.active
                    ? "border-transparent bg-[linear-gradient(90deg,#7346f3_0%,#985cff_100%)] text-white shadow-[0_14px_28px_rgba(120,79,244,0.28)]"
                    : "border-[#ede7f8] bg-white/84 text-[#241a59] shadow-[0_8px_18px_rgba(51,40,99,0.04)] hover:-translate-y-0.5 hover:border-[#dccfff] hover:bg-[#fbf8ff]"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative mt-4 flex flex-1 flex-col overflow-hidden rounded-[24px]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(236,239,255,0.62)_45%,rgba(224,230,255,0.9)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[74%] rounded-[26px] bg-[radial-gradient(circle_at_25%_28%,rgba(204,220,255,0.92),transparent_26%),radial-gradient(circle_at_72%_76%,rgba(255,229,173,0.32),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(226,231,255,0.82)_52%,rgba(214,222,255,0.96)_100%)]" />
          <div className="pointer-events-none absolute inset-x-[-1rem] bottom-4 h-48 rounded-full bg-[radial-gradient(circle,rgba(196,204,255,0.42),transparent_68%)] blur-2xl" />
          <span className="absolute left-4 top-[12.7rem] h-1.5 w-1.5 rounded-full bg-[#ffd870]" />
          <span className="absolute left-8 top-[13.4rem] h-2 w-2 rounded-full bg-[#ffc9dd]" />
          <span className="absolute right-7 top-[13rem] h-2.5 w-2.5 rounded-full bg-[#ffcf6d]" />
          <span className="absolute right-12 top-[15rem] h-1.5 w-1.5 rounded-full bg-[#d9a7ff]" />
          <span className="absolute right-5 bottom-24 h-2 w-2 rounded-full bg-[#f8b2d0]" />
          <img
            src={sidebarImage}
            alt="Child reading with a dog"
            className="relative mt-auto h-auto w-full object-cover object-bottom [mask-image:linear-gradient(to_top,black_72%,transparent_100%)]"
          />
        </div>

        <div className="relative mt-4 flex items-center gap-3 rounded-[18px] border border-[#e9e1fb] bg-white/90 px-4 py-3.5 shadow-[0_10px_22px_rgba(81,57,155,0.06)]">
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.92rem] font-bold text-[#1e1748]">
              {appUser?.fullName || "Loading user"}
            </p>
            <p className="truncate text-[0.82rem] text-[#756c97]">
              {appUser?.email || ""}
            </p>
          </div>
          <span className="rounded-full bg-[#f3edff] px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#6f43ee]">
            {appUser?.role || "member"}
          </span>
        </div>
      </div>
    </aside>
  );
}
