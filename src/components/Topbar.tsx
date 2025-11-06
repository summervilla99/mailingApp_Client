import { Link, useLocation } from "react-router-dom";
import { Search, Plus } from "lucide-react";

export default function Topbar() {
  const { pathname } = useLocation();
  const title =
    pathname === "/contacts" ? "Contacts" :
    pathname === "/compose"  ? "Mail" :
    "Dashboard";

  return (
    <header className="topbar sticky top-0 z-50 border-b [border-color:rgba(84,72,64,.16)]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10 h-16 flex items-center justify-between">
        {/* 좌측: 타이틀 + 검색 */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="text-lg md:text-xl font-semibold tracking-tight"
            style={{
                color: "rgba(var(--accent-dark)",
                transform: "translateX(-11px)",
                cursor: "default",
            }}
            >
            {title}
            </div>


          <div
            data-role="top-search"
            className="hidden md:flex items-center gap-2 rounded-xl border px-3 py-2"
          >
            <Search className="h-4 w-4 opacity-60" />
            <input
              placeholder="Search…"
              className="outline-none text-sm bg-transparent placeholder:opacity-60"
            />
          </div>
        </div>

        {/* 우측: New Mail 버튼 + 아바타 */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/compose"
            title="Compose new mail"
            className={[
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
              "text-white shadow-sm transition",
              "[background:rgb(var(--accent))] hover:opacity-95 active:opacity-90",
              "focus:outline-none focus:ring-2 [--tw-ring-color:rgba(0,0,0,.08)]",
            ].join(" ")}
          >
            <Plus className="h-4 w-4" />
            New Mail
          </Link>

          <div
            className="h-9 w-9 rounded-full"
            style={{ background: "linear-gradient(135deg,#e9e2dc,#d7cfc9)" }}
            aria-hidden
          />
        </div>
      </div>
    </header>
  );
}
