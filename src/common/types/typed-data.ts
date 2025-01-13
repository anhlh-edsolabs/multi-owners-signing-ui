import { TypedDataDomain } from "ethers";

export type FunctionCallTypedData = {
	domain: TypedDataDomain;
	types: {
		FunctionCall: {
			name: string;
			type: string;
		}[];
	};
	primaryType: string;
	message: {
		nonce: number;
		selector: string | "";
		inputData: string;
	};
};
