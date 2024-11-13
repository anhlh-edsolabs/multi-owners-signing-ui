/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InputAbi {
	internalType: string;
	name: string;
	type: string;
	indexed?: boolean;
}

export interface AbiDecode {
	type: "function" | "event" | "constructor";
	name?: string;
	stateMutability?: "nonpayable" | "pure" | "view";
	inputs: Array<InputAbi>;
	outputs?: Array<InputAbi>;
	anonymous?: boolean;
}

export type FunctionInput = {
	internalType: string;
	name: string;
	type: string;
	components?: { internalType: string; name: string; type: string }[];
};

export type ClaimDataRaw = {
	claimer: string;
	claimableTimestamp: number;
	amount: bigint;
};

export type ClaimData = {
	claimer: string;
	claimableTimestamp: number;
	amount: bigint;
	accessKey: string;
};

export type ReadContractProps = {
	funcName: string;
	children?: React.ReactNode;
	args?: any;
	onListening?: (data: any) => void;
};

export type FunctionCallFormData = {
	functionName: string;
	params: Array<any>;
	nonce: number | null;
};