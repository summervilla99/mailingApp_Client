import axios from "axios";
import type { Contact, MailingDraft } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

// CSRF: csrftoken 쿠키 → X-CSRFToken
api.interceptors.request.use((config) => {
  const m = document.cookie.match(/(^|; )csrftoken=([^;]+)/);
  if (m) config.headers["X-CSRFToken"] = decodeURIComponent(m[2]);
  return config;
});

/** 연락처 목록 */
export async function getContacts(): Promise<Contact[]> {
  const { data } = await api.get("/contacts/");
  return data; // Contact[]
}

/** 연락처 엑셀 업로드(서버 파싱) */
export async function uploadContacts(file: File): Promise<{created:number; updated:number}> {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/contacts/upload/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // {created,updated}
}

/** 연락처 일괄 저장(인라인 수정 반영) */
export async function saveContacts(list: Contact[]): Promise<void> {
  await api.put("/contacts/save/", { contacts: list });
}

/** 메일 작성 → 첨부 업로드 → 발송 */
export async function sendMail(draft: MailingDraft, recipients: string[], files: File[]) {
  // 1) Mailing 생성
  const { data: m } = await api.post("/mailings/", draft); // {id}
  const mailingId = m.id as number;

  // 2) 첨부 업로드 (여러 파일)
  for (const f of files) {
    const fd = new FormData();
    fd.append("file", f);
    await api.post(`/mailings/${mailingId}/upload/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // 3) 발송
  const { data: result } = await api.post(`/mailings/${mailingId}/send/`, {
    recipients,
  });
  return result as { sent: number; failed: number };
}
