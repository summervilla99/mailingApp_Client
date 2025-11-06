// src/features/contacts/ContactsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContacts, uploadContacts, saveContacts } from "@/lib/api";
import type { Contact } from "@/lib/types";
import { useRecipientStore } from "@/lib/store";

export default function ContactsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { setSelected } = useRecipientStore();

  // ✅ data 기본값을 구조분해에서 만들지 않는다 (매 렌더마다 새 배열 생성 방지)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    retry: 0,                    // 개발 중 서버 미기동 시 무한 재시도 방지
    refetchOnWindowFocus: false, // 탭 전환 시 재요청 방지(개발 편의)
  });

  const [rows, setRows] = useState<Contact[]>([]);
  const [initialized, setInitialized] = useState(false); // ✅ 최초 1회만 data → rows 반영
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!initialized && Array.isArray(data)) {
      setRows(data);
      setInitialized(true);
    }
  }, [data, initialized]);

  const upMut = useMutation({
    mutationFn: uploadContacts,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });

  const saveMut = useMutation({
    mutationFn: saveContacts,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });

  const onUpload = async (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      alert("엑셀(xlsx/xls) 또는 CSV 파일을 업로드해 주세요.");
      return;
    }
    try {
      await upMut.mutateAsync(file);
      alert("업로드/병합 완료");
      setInitialized(false); // ✅ 새 데이터 반영을 위해 다음 쿼리 응답을 다시 초기화에 사용
    } catch (e: any) {
      alert("업로드 실패: " + (e?.response?.data?.detail || e.message));
    }
  };

  const toggle = (id: number, key: keyof Contact, value: any) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const selectedEmails = useMemo(
    () => rows.filter(r => checked[r.id]).map(r => r.email),
    [rows, checked]
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* 엑셀 업로드 */}
        <label className="btn cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
          엑셀 업로드(서버 파싱)
        </label>

        {/* 변경사항 저장 */}
        <button
          onClick={() => saveMut.mutate(rows)}
          className="btn"
          disabled={saveMut.isPending || !rows.length}
          title={rows.length ? "" : "저장할 내용이 없습니다"}
        >
          {saveMut.isPending ? "저장 중…" : "변경사항 저장"}
        </button>

        {/* 보낼 대상 불러오기 → /compose */}
        <button
          onClick={() => {
            setSelected(selectedEmails);
            navigate("/compose");
          }}
          className="btn"
          disabled={selectedEmails.length === 0}
          title={selectedEmails.length ? "" : "체크한 대상이 없습니다"}
        >
          보낼 대상 불러오기 ({selectedEmails.length})
        </button>
      </div>

      {/* 상태 안내 (개발 편의용) */}
      {isLoading && <div className="text-sm opacity-60">연락처 불러오는 중…</div>}
      {isError && (
        <div className="text-sm text-red-600">
          연락처를 불러오지 못했습니다. (개발 중이라면 Django 서버가 꺼져 있을 수 있어요)
        </div>
      )}

      <div className="table-wrap scroll-slim">
        <table className="table">
          <thead>
            <tr>
              <th className="th w-10"></th>
              <th className="th">이름</th>
              <th className="th">회사</th>
              <th className="th">역할</th>
              <th className="th">이메일</th>
              <th className="th">진행작</th>
              <th className="th">비고</th>
              <th className="th">마지막 발송</th>
              <th className="th">지난 일수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const days = r.last_sent_at
                ? Math.floor((Date.now() - new Date(r.last_sent_at).getTime()) / 86400000)
                : null;
              return (
                <tr key={r.id} className="row">
                  <td className="td">
                    <input
                      type="checkbox"
                      checked={!!checked[r.id]}
                      onChange={e =>
                        setChecked(prev => ({ ...prev, [r.id]: e.target.checked }))
                      }
                    />
                  </td>
                  <td className="td">
                    <input
                      className="input"
                      value={r.name || ""}
                      onChange={e => toggle(r.id, "name", e.target.value)}
                    />
                  </td>
                  <td className="td">
                    <input
                      className="input"
                      value={r.company || ""}
                      onChange={e => toggle(r.id, "company", e.target.value)}
                    />
                  </td>
                  <td className="td">
                    <input
                      className="input"
                      value={r.role || ""}
                      onChange={e => toggle(r.id, "role", e.target.value)}
                    />
                  </td>
                  <td className="td">
                    <input
                      className="input"
                      value={r.email}
                      onChange={e => toggle(r.id, "email", e.target.value)}
                    />
                  </td>
                  <td className="td">
                    <input
                      type="checkbox"
                      checked={!!r.is_active_project}
                      onChange={e => toggle(r.id, "is_active_project", e.target.checked)}
                    />
                  </td>
                  <td className="td">
                    <input
                      className="input"
                      value={r.notes || ""}
                      onChange={e => toggle(r.id, "notes", e.target.value)}
                    />
                  </td>
                  <td className="td opacity-70">
                    {r.last_sent_at ? new Date(r.last_sent_at).toLocaleString() : "-"}
                  </td>
                  <td className="td">
                    {days == null ? (
                      <span className="badge">미발송</span>
                    ) : days >= 60 ? (
                      <span className="badge badge-red">{days}일</span>
                    ) : days >= 30 ? (
                      <span className="badge badge-amber">{days}일</span>
                    ) : (
                      <span className="badge badge-green">{days}일</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="td text-center opacity-60">
                  연락처가 없습니다. 엑셀을 업로드해보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
