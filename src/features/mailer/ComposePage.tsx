import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRecipientStore } from "@/lib/store";
import { sendMail } from "@/lib/api";
import { useState } from "react";

const schema = z.object({
  subject: z.string().min(2),
  body_html: z.string().min(2),
  extra_emails: z.string().optional(), // a@x.com, b@y.com
});
type FormValues = z.infer<typeof schema>;

export default function ComposePage(){
  const {selectedEmails, clear} = useRecipientStore();
  const [files, setFiles] = useState<File[]>([]);
  const {register, handleSubmit, watch, formState:{errors, isSubmitting}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "[프로필] 배우 남율 — 프로필 전달드립니다",
      body_html: "<p>안녕하세요, 캐스팅 디렉터님.</p><p>배우 남율입니다. 최근 작업 및 이력을 첨부 프로필로 전달드립니다.<br/>궁금하신 점은 언제든 회신 부탁드립니다.</p><p>감사합니다.<br/>남율 드림</p>",
    }
  });

  const onSubmit = async (v: FormValues)=>{
    const extras = (v.extra_emails||"").split(",").map(s=>s.trim()).filter(Boolean);
    const recipients = Array.from(new Set([...selectedEmails, ...extras]));
    if (!recipients.length) { alert("수신자가 비어 있습니다."); return; }

    // 파일 검증
    for (const f of files) {
      if (!/\.(pdf|pptx)$/i.test(f.name)) { alert("PDF/PPTX만 허용합니다."); return; }
      if (f.size > 20*1024*1024) { alert("파일이 너무 큽니다(최대 20MB)."); return; }
    }

    const res = await sendMail({subject:v.subject, body_html: v.body_html}, recipients, files);
    alert(`발송 결과: 성공 ${res.sent} / 실패 ${res.failed}`);
    clear();
    window.location.hash = "#/"; // 대시보드로 이동
  };

  const body = watch("body_html");

  return (
    <section>
      <h2 className="text-xl font-semibold">메일 작성</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">제목</label>
            <input {...register("subject")} className="w-full border rounded-xl px-3 py-2 bg-white"/>
            {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">첨부 (PDF/PPTX)</label>
            <input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
            <div className="text-xs text-gray-500 mt-1">첨부: {files.map(f=>f.name).join(", ")||"없음"}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">본문 (HTML)</label>
          <textarea {...register("body_html")} rows={10} className="w-full border rounded-xl px-3 py-2 bg-white"></textarea>
          {errors.body_html && <p className="text-red-600 text-sm mt-1">{errors.body_html.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">보낼 대상</div>
              <div className="text-sm text-gray-500">{selectedEmails.length}명</div>
            </div>
            <div className="mt-2 max-h-48 overflow-auto text-sm text-gray-700">
              {selectedEmails.length ? selectedEmails.map(e=>(
                <div key={e} className="py-1 border-b last:border-b-0">{e}</div>
              )) : <div className="text-gray-400">Contacts에서 체크해 주세요.</div>}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">추가 이메일 (쉼표 , 로 구분)</label>
            <input {...register("extra_emails")} className="w-full border rounded-xl px-3 py-2 bg-white" placeholder="a@x.com, b@y.com"/>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-2xl p-3">
            <div className="font-medium">미리보기</div>
            <div className="prose prose-sm max-w-none mt-2" dangerouslySetInnerHTML={{__html: body}}/>
          </div>
          <div className="flex items-end">
            <button disabled={isSubmitting} className="px-4 py-2 rounded-full bg-black text-white">
              {isSubmitting ? "발송 중..." : "발송"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}