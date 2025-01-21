/* eslint-disable @typescript-eslint/no-explicit-any */


export type ContractInfoProps = {
	title: string;
	address: string;
};

export type ContractFunctionProps = {
	abi: any[];
	address: `0x${string}`;
	functionWithNonces?: string[];
};

export type WriteContractProps = {
	abi: any[];
	address: `0x${string}`;
	funcName: string;
	args?: any[];
};

export type ReadContractProps = WriteContractProps & {
	onListening?: (data: any) => void;
}

export type SoftStakingFunctionProps = {
	multiSigs: string[];
	special: string;
};

export type GenerateTypedDataButtonProps = {
	label: string;
};

export type SignTypedDataButtonProps = {
	label: string;
};
