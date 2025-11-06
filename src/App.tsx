import Navbar from "@/components/Navbar";
import AppRoutes from "@/routes";

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AppRoutes/>
      </div>
    </div>
  );
}
