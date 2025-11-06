import { Link, useLocation } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

const NavItem = ({to, label, icon}: {to:string; label:string; icon: JSX.Element})=>{
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
      ${active ? "bg-black text-white" : "hover:bg-gray-100"}`}>
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-gray-200 bg-white p-4 flex flex-col gap-4">
        <div className="px-2 pt-2 pb-4">
          <div className="text-xl font-semibold tracking-tight">cast<span className="text-gray-400">Mail</span></div>
          <div className="text-xs text-gray-500 mt-1">Actors Mailing Automation</div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavItem to="/" label="Dashboard" icon={<svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
          <NavItem to="/contacts" label="Contacts" icon={<svg viewBox="0 0 24 24" fill="none"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11ZM5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
          <NavItem to="/compose" label="Compose" icon={<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="m16.5 3.9 3.6 3.6-9.6 9.6-4.4.8.8-4.4 9.6-9.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        </nav>
        <div className="mt-auto px-2">
          <a href="https://example.com" target="_blank" className="text-xs text-gray-400 hover:text-gray-600">v0.1 · prototype</a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="text-sm text-gray-500">Seamless, tasteful, fast ✨</div>
            <div className="flex items-center gap-2">
              <Link to="/compose" className="btn btn-primary">New mailing</Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto w-full p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
