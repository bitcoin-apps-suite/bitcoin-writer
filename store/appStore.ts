import { create } from 'zustand';

// Define types for the state
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  setAuthenticated: (status: boolean, user?: any) => void;
}

interface PaymentState {
  balance: number;
  transactions: any[];
  updateBalance: (balance: number) => void;
  addTransaction: (transaction: any) => void;
}

interface AppState {
  theme: string;
  settings: any;
  setTheme: (theme: string) => void;
  updateSettings: (settings: any) => void;
}

// Combine all states into a single store
interface GlobalState extends AuthState, PaymentState, AppState {}

const useAppStore = create<GlobalState>((set) => ({
  // Auth State
  isAuthenticated: false,
  user: null,
  setAuthenticated: (status, user) => set({ isAuthenticated: status, user }),

  // Payment State
  balance: 0,
  transactions: [],
  updateBalance: (balance) => set({ balance }),
  addTransaction: (transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),

  // App State
  theme: 'light',
  settings: {},
  setTheme: (theme) => set({ theme }),
  updateSettings: (settings) => set({ settings }),
}));

export default useAppStore;
