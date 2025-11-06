import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ContactsPage from "@/features/contacts/ContactsPage";
import ComposePage from "@/features/mailer/ComposePage";

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<DashboardPage/>} />
      <Route path="/contacts" element={<ContactsPage/>} />
      <Route path="/compose" element={<ComposePage/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
