import { create } from "zustand";

interface SignatureStore {
    signature: string,
    setSignature: (signature: string) => void
}

const useSignatureStore = create<SignatureStore>((set) => ({
	signature: "",
	setSignature: (signature: string) => set({ signature }),
}));

export { useSignatureStore };
