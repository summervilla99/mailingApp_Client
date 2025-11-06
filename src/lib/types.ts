export type Contact = {
  id: number;
  name?: string;
  company?: string;
  role?: string;
  email: string;
  is_active_project: boolean;
  notes?: string;
  last_sent_at: string | null; // ISO
};

export type MailingDraft = { subject: string; body_html: string; };