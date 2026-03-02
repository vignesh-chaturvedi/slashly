import { create } from "zustand";
import { EmailThread } from "@/lib/gmail";

interface EmailStore {
    threads: EmailThread[];
    selectedThread: EmailThread | null;
    isLoading: boolean;
    error: string | null;
    category: string;
    searchQuery: string;
    isComposing: boolean;
    showAIDraft: boolean;
    aiDraft: string;
    aiDraftLoading: boolean;
    sidebarCollapsed: boolean;

    setThreads: (threads: EmailThread[]) => void;
    selectThread: (thread: EmailThread | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
    setComposing: (composing: boolean) => void;
    setShowAIDraft: (show: boolean) => void;
    setAIDraft: (draft: string) => void;
    setAIDraftLoading: (loading: boolean) => void;
    toggleSidebar: () => void;
    markThreadRead: (threadId: string) => void;
    removeThread: (threadId: string) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
    threads: [],
    selectedThread: null,
    isLoading: false,
    error: null,
    category: "primary",
    searchQuery: "",
    isComposing: false,
    showAIDraft: false,
    aiDraft: "",
    aiDraftLoading: false,
    sidebarCollapsed: false,

    setThreads: (threads) => set({ threads }),
    selectThread: (thread) => set({ selectedThread: thread, showAIDraft: false, aiDraft: "" }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setCategory: (category) => set({ category, selectedThread: null }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setComposing: (isComposing) => set({ isComposing }),
    setShowAIDraft: (showAIDraft) => set({ showAIDraft }),
    setAIDraft: (aiDraft) => set({ aiDraft }),
    setAIDraftLoading: (aiDraftLoading) => set({ aiDraftLoading }),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    markThreadRead: (threadId) =>
        set((state) => ({
            threads: state.threads.map((t) =>
                t.id === threadId ? { ...t, isRead: true } : t
            ),
        })),
    removeThread: (threadId) =>
        set((state) => ({
            threads: state.threads.filter((t) => t.id !== threadId),
            selectedThread:
                state.selectedThread?.id === threadId ? null : state.selectedThread,
        })),
}));
