import { useState } from "react";
import { sendMail } from "@/lib/api";

export default function ComposePage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    const recipients = to
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    if (!recipients.length) {
      alert("받는 사람을 입력해주세요.");
      return;
    }

    const draft = { subject, body };

    try {
      setSending(true);
      const result = await sendMail(draft, recipients, files);
      alert(`메일 발송 완료 (성공: ${result.sent}, 실패: ${result.failed})`);
    } catch (e: any) {
      console.error(e);
      alert("메일 발송 실패: " + e.message);
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-10 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ───────────── 왼쪽: 메일 작성 폼 ───────────── */}
        <div className="flex-1 space-y-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">메일 작성</h2>

          {/* 수신자 */}
          <div>
            <label className="label">받는 사람 (쉼표로 구분)</label>
            <input
              className="input"
              placeholder="director@studio.com, cd@agency.com"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="label">제목</label>
            <input
              className="input"
              placeholder="메일 제목을 입력하세요"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          {/* 본문 */}
          <div>
            <label className="label">본문</label>
            <textarea
              className="input min-h-[240px] resize-y font-sans leading-relaxed"
              placeholder={`자기소개나 최근 활동 소식 등을 입력하세요.\n엔터키로 줄바꿈하면 그대로 메일에 반영됩니다.`}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          {/* 파일 업로드 */}
          <div>
            <label className="label">프로필 파일 (PDF/PPTX)</label>
            <input
              type="file"
              multiple
              accept=".pdf,.pptx"
              className="input"
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {files.map(f => (
                  <li key={f.name}>📎 {f.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={sending}
            className={`btn-primary w-full py-3 text-center ${
              sending ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {sending ? "발송 중..." : "발송하기 ✉️"}
          </button>
        </div>

        {/* ───────────── 오른쪽: 실시간 미리보기 ───────────── */}
        <div className="flex-1">
          <div className="sticky top-20">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              실시간 미리보기
            </h3>
            <div className="card card-pad whitespace-pre-line text-gray-800 min-h-[400px] leading-relaxed">
              {body ? body : "작성 중인 메일 내용이 여기에 표시됩니다."}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
