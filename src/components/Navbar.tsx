import { Link, useLocation } from "react-router-dom";

export default function Navbar(){
  const { pathname } = useLocation();
  const btn = (to:string,label:string)=>(
    <Link to={to} className={`px-3 py-2 rounded-full hover:bg-gray-100 ${pathname===to?'bg-black text-white hover:bg-black':''}`}>
      {label}
    </Link>
  );
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2">
        {btn("/", "Dashboard")}
        {btn("/contacts", "Contacts")}
        {btn("/compose", "Compose")}
      </div>
    </nav>
  );
}