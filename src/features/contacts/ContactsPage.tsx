import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContacts, uploadContacts, saveContacts } from "@/lib/api";
import type { Contact } from "@/lib/types";
import { useRecipientStore } from "@/lib/store";

export default function ContactsPage(){
  const qc = useQueryClient();
  const { data: contacts=[] } = useQuery({ queryKey:["contacts"], queryFn: getContacts });
  const [rows, setRows] = useState<Contact[]>([]);
  const { setSelected } = useRecipientStore();
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(()=>{ setRows(contacts); },[contacts]);

  const upMut = useMutation({
    mutationFn: uploadContacts,
    onSuccess: ()=> qc.invalidateQueries({queryKey:["contacts"]})
  });
  const saveMut = useMutation({
    mutationFn: saveContacts,
    onSuccess: ()=> qc.invalidateQueries({queryKey:["contacts"]})
  });

  const onUpload = async (file: File)=>{
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      alert("엑셀(xlsx/xls) 또는 CSV 파일을 업로드해 주세요."); return;
    }
    try{
      await upMut.mutateAsync(file);
      alert("업로드/병합 완료");
    }catch(e:any){
      alert("업로드 실패: " + (e?.response?.data?.detail || e.message));
    }
  };

  const toggle = (id: number, key: keyof Contact, value: any)=>{
    setRows(prev => prev.map(r => r.id===id ? ({...r, [key]: value}) : r));
  };

  const selectedEmails = useMemo(
    ()=> rows.filter(r=>checked[r.id]).map(r=>r.email),
    [rows, checked]
  );

  return (
    <section>
      <h2 className="text-xl font-semibold">연락망</h2>

      <div className="mt-3 flex items-center gap-2">
        <label className="px-3 py-2 border rounded-full bg-white cursor-pointer">
          <input type="file" className="hidden" onChange={e=> e.target.files?.[0] && onUpload(e.target.files[0])}/>
          엑셀 업로드(서버 파싱)
        </label>
        <button onClick={()=>saveMut.mutate(rows)} className="px-3 py-2 border rounded-full bg-black text-white">
          변경사항 저장
        </button>
        <button
          onClick={()=>{ setSelected(selectedEmails); window.location.hash = "#/compose"; }}
          className="px-3 py-2 border rounded-full bg-white"
          disabled={selectedEmails.length===0}
        >
          보낼 대상 불러오기 ({selectedEmails.length})
        </button>
      </div>

      <div className="mt-4 overflow-auto bg-white border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2"></th>
              <th className="p-2 text-left">이름</th>
              <th className="p-2 text-left">회사</th>
              <th className="p-2 text-left">역할</th>
              <th className="p-2 text-left">이메일</th>
              <th className="p-2 text-left">진행작</th>
              <th className="p-2 text-left">비고</th>
              <th className="p-2 text-left">마지막 발송</th>
              <th className="p-2 text-left">지난 일수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>{
              const days = r.last_sent_at ? Math.floor((Date.now()-new Date(r.last_sent_at).getTime())/86400000) : null;
              return (
                <tr key={r.id} className="border-t">
                  <td className="p-2">
                    <input type="checkbox" checked={!!checked[r.id]} onChange={e=>setChecked(prev=>({...prev,[r.id]: e.target.checked}))}/>
                  </td>
                  <td className="p-2"><input className="input" value={r.name||""} onChange={e=>toggle(r.id,"name",e.target.value)}/></td>
                  <td className="p-2"><input className="input" value={r.company||""} onChange={e=>toggle(r.id,"company",e.target.value)}/></td>
                  <td className="p-2"><input className="input" value={r.role||""} onChange={e=>toggle(r.id,"role",e.target.value)}/></td>
                  <td className="p-2"><input className="input" value={r.email} onChange={e=>toggle(r.id,"email",e.target.value)}/></td>
                  <td className="p-2"><input type="checkbox" checked={!!r.is_active_project} onChange={e=>toggle(r.id,"is_active_project",e.target.checked)}/></td>
                  <td className="p-2"><input className="input" value={r.notes||""} onChange={e=>toggle(r.id,"notes",e.target.value)}/></td>
                  <td className="p-2 text-gray-500">{r.last_sent_at ? new Date(r.last_sent_at).toLocaleString() : "-"}</td>
                  <td className="p-2">
                    {days==null ? <span className="px-2 py-1 text-xs rounded-full bg-gray-200">미발송</span> :
                      days>=60 ? <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">{days}일</span> :
                      days>=30 ? <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">{days}일</span> :
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{days}일</span>}
                  </td>
                </tr>
              );
            })}
            {rows.length===0 && (
              <tr><td colSpan={9} className="p-6 text-center text-gray-500">연락처가 없습니다. 엑셀을 업로드해보세요.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}