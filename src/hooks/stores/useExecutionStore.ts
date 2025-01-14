import { create } from "zustand";

interface ExecutionStore {
	selector: string;
	calldata: string;
	combinedSignature: string;
	setExecutionData: (selector: string, calldata: string) => void;
	setCombinedSignature: (combinedSignature: string) => void;
}

const useExecutionStore = create<ExecutionStore>((set) => ({
	selector: "",
	calldata: "",
	combinedSignature: "",
	setExecutionData: (selector, calldata) => set({ selector, calldata }),
	setCombinedSignature: (combinedSignature) => set({ combinedSignature }),
}));

export { useExecutionStore };
