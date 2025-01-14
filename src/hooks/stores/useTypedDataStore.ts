import { create } from "zustand";
import { FunctionCallTypedData } from "../../common/types/typed-data";

interface TypedDataStore {
	typedData: FunctionCallTypedData | undefined;
	setTypedData: (typedData: FunctionCallTypedData | undefined) => void;
}

const useTypedDataStore = create<TypedDataStore>((set) => ({
	typedData: {
		domain: {
			name: "",
			version: "",
			chainId: 0,
			verifyingContract: "0x",
		},
		types: {
			FunctionCall: [],
		},
		primaryType: "",
		message: {
			nonce: 0,
			selector: "",
			inputData: "",
		},
	},
	setTypedData: (typedData) => set({ typedData }),
}));

export { useTypedDataStore };
