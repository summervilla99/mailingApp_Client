import { create } from "zustand";

type State = {
  selectedEmails: string[];
  setSelected: (emails: string[]) => void;
  clear: () => void;
};

export const useRecipientStore = create<State>((set) => ({
  selectedEmails: [],
  setSelected: (emails) => set({ selectedEmails: emails }),
  clear: () => set({ selectedEmails: [] }),
}));