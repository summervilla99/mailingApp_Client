import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/lib/api";

function Badge({days}:{days:number|null}){
  if (days===null) return <span className="px-2 py-1 text-xs rounded-full bg-gray-200">미발송</span>;
  if (days>=60)  return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">{days}일</span>;
  if (days>=30)  return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">{days}일</span>;
  return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{days}일</span>;
}

const diffDays = (iso?:string|null)=> iso? Math.floor((Date.now()-new Date(iso).getTime())/86400000) : null;

export default function DashboardPage(){
  const { data: contacts=[] } = useQuery({queryKey:["contacts"], queryFn:getContacts});
  const never = contacts.filter(c=>!c.last_sent_at).length;
  const over30 = contacts.filter(c=>{ const d=diffDays(c.last_sent_at); return d!=null && d>=30 && d<60; }).length;
  const over60 = contacts.filter(c=>{ const d=diffDays(c.last_sent_at); return d!=null && d>=60; }).length;

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">🎬 Actors Mailing — Dashboard</h1>
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="px-3 py-2 rounded-full bg-white border">총 {contacts.length}</div>
        <div className="px-3 py-2 rounded-full bg-white border">미발송 {never}</div>
        <div className="px-3 py-2 rounded-full bg-white border">30일↑ {over30}</div>
        <div className="px-3 py-2 rounded-full bg-white border">60일↑ {over60}</div>
      </div>

      <h3 className="mt-8 mb-2 font-medium">최근 연락처</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {contacts.slice(0,6).map(c=>(
          <div key={c.id} className="bg-white border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name || c.email}</div>
              <div className="text-sm text-gray-500">{c.company} {c.role?`· ${c.role}`:''}</div>
            </div>
            <Badge days={diffDays(c.last_sent_at)}/>
          </div>
        ))}
      </div>
    </section>
  );
}