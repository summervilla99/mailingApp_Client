import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Mail, Menu } from "lucide-react";
import { useMemo, useState } from "react";

const links = [
  { to: "/",         label: "Dashboard", icon: LayoutDashboard },
  { to: "/contacts", label: "Contacts",  icon: Users },
  { to: "/compose",  label: "Mail",      icon: Mail },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => links.map(l => ({ ...l, active: pathname === l.to })),
    [pathname]
  );

  return (
    <>
      {/* 모바일 햄버거 */}
      <div className="md:hidden fixed left-4 top-4 z-50">
        <button
          onClick={() => setOpen(v => !v)}
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 shadow-sm bg-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ✅ 사이드바 자체가 스크롤 컨테이너 + 항상 흰색 + 전체 높이 */}
      <aside
        className={[
          // 모바일: 오프캔버스
          "fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          // 데스크톱: 항상 보이도록 sticky + 뷰포트 높이
          "md:translate-x-0 md:sticky md:top-0 md:h-screen",
          // 배경/보더
          "bg-white border-r [border-color:rgba(84,72,64,.16)]",
          // 스크롤은 aside가 담당
          "overflow-y-auto",
        ].join(" ")}
      >
        {/* 내부 컨텐츠: ❌ h-full/overflow 제거 */}
        <div className="px-5 pt-16 md:pt-6 pb-4">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-3 mb-6 hover:opacity-80">
            <div
              className="h-9 w-9 rounded-2xl grid place-items-center text-xs font-semibold"
              style={{ backgroundColor: "rgb(var(--accent))", color: "#fff" }}
            >
              AM
            </div>
            <div>
              <div className="text-sm font-semibold leading-5">castMail</div>
              <div className="text-xs opacity-70 leading-4">Actors Mailing</div>
            </div>
          </Link>

          {/* 내비 */}
          <nav className="flex flex-col gap-1">
            {items.map(({ to, label, icon: Icon, active }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={[
                "flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-150",
                active
                    ? "bg-[rgba(var(--accent),.16)] text-[rgba(var(--ink),.95)] font-semibold border-[rgba(var(--hair),.15)]"
                    : "border-transparent text-[rgba(var(--ink),.70)] hover:bg-[rgba(var(--accent),.10)] hover:text-[rgba(var(--ink),1)] hover:border-[rgba(var(--hair),.10)]",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(33,30,27,.3)] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
