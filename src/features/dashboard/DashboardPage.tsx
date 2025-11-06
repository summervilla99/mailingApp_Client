// src/features/dashboard/DashboardPage.tsx
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/lib/api";

export default function DashboardPage() {
  const { data: contacts = [] } = useQuery({ queryKey: ["contacts"], queryFn: getContacts });
  const total = contacts.length;
  const sentOver30 = contacts.filter(c => {
    if (!c.last_sent_at) return false;
    const days = (Date.now() - new Date(c.last_sent_at).getTime()) / 86400000;
    return days >= 30;
  }).length;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">대시보드</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card card-pad shadow-sm hover:shadow-md transition">
          <div className="text-gray-500 text-sm mb-1">총 연락처</div>
          <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="card card-pad shadow-sm hover:shadow-md transition">
          <div className="text-gray-500 text-sm mb-1">최근 발송 수</div>
          <div className="text-2xl font-semibold">0</div>
        </div>
        <div className="card card-pad shadow-sm hover:shadow-md transition">
          <div className="text-gray-500 text-sm mb-1">1개월 이상 미발송</div>
          <div className="text-2xl font-semibold">{sentOver30}</div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="text-gray-600 text-sm mb-3">최근 보낸 메일</div>
        <ul className="divide-y divide-gray-100">
          <li className="py-2 text-sm text-gray-700">최근 발송 내역 없음</li>
        </ul>
      </div>
    </section>
  );
}