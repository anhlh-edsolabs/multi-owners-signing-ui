import { create } from "zustand";

interface FunctionSelectionStore {
	selectedFunction: string;
	setSelectedFunction: (selectedFunction: string) => void;
}

const useFunctionSelectionStore = create<FunctionSelectionStore>((set) => ({
	selectedFunction: "",
	setSelectedFunction: (selectedFunction) => set({ selectedFunction }),
}));

export { useFunctionSelectionStore };
