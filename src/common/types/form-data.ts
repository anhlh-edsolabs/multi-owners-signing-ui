/* eslint-disable @typescript-eslint/no-explicit-any */

export type FunctionCallFormData = {
	functionName: string;
	params: any[];
	nonce: number | null;
};

export type SignaturesFormData = {
	signature1: string;
	signature2: string;
	signature3: string;
};
