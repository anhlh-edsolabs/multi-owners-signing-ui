/* eslint-disable @typescript-eslint/no-explicit-any */

export type ContractInfoProps = {
	title: string;
	address: string;
};

export type ContractFunctionProps = {
	abi: any[];
};

export type ReadContractProps = {
	funcName: string;
	children?: React.ReactNode;
	args?: any;
	onListening?: (data: any) => void;
};

export type WriteContractProps = {
	funcName: string;
	args?: any[];
};

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
