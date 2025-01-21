import { create } from "zustand";
import { AbiItem } from "../../common/types";

interface FunctionSelectionStore {
	selectedFunction: string;
	selectedFunctionType: string;
	selectedFunctionABI: AbiItem | null;
	setSelectedFunction: (
		selectedFunction: string,
		selectedFunctionType: string,
		selectedFunctionABI?: AbiItem | null,
	) => void;
}

const useFunctionSelectionStore = create<FunctionSelectionStore>((set) => ({
	selectedFunction: "",
	selectedFunctionType: "",
	selectedFunctionABI: null,
	setSelectedFunction: (
		selectedFunction,
		selectedFunctionType,
		selectedFunctionABI,
	) => set({ selectedFunction, selectedFunctionType, selectedFunctionABI }),
}));

export { useFunctionSelectionStore };
