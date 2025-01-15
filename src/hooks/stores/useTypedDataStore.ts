import { create } from "zustand";
import { FunctionCallTypedData } from "../../common/types/typed-data";

interface TypedDataStore {
	typedData: FunctionCallTypedData | undefined;
	setTypedData: (typedData: FunctionCallTypedData | undefined) => void;
}

const useTypedDataStore = create<TypedDataStore>((set) => ({
	typedData: undefined,
	setTypedData: (typedData) => set({ typedData }),
}));

export { useTypedDataStore };
