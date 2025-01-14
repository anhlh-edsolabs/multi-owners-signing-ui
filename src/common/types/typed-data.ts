import { TypedDataField } from "ethers";

export type FunctionCallTypedData = {
	domain: TypedDataDomain;
	types: Record<string, TypedDataField[]>;
	primaryType: string;
	message: FunctionCallData;
};

export type TypedDataDomain = {
    chainId?: number | undefined;
    name?: string;
    salt?: `0x${string}`;
    verifyingContract?: `0x${string}`;
    version?: string;
}

export type FunctionCallType = {
    FunctionCall: Record<string, TypedDataField[]>;
}

export type FunctionCallData = {
    nonce: number;
    selector: string | "";
    inputData: string;
}