/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, TypedDataDomain } from "ethers";
import Constants from "../constants";
import { ClaimData, APIRewardDataAdapter } from "../types";
import { getFunction, iterateFunctionInputs } from "./utils";

export const SoftStakingTypedDataDomain: TypedDataDomain = {
	name: "SoftStaking",
	version: "1",
	verifyingContract: Constants.SOFTSTAKING_ADDRESS,
};

export const convertRawDataToClaimData = (
	data: APIRewardDataAdapter[],
): ClaimData[] => {
	const convertedData: ClaimData[] = data.map((item: any) => ({
		claimer: item.walletAddress,
		claimableTimestamp: item.claimableTimestamp,
		amount: ethers.parseEther(item.amountReward).toString(10),
	}));
	return convertedData;
};

export const createFunctionCallTypedData = (
	domain: TypedDataDomain,
	functionName: string,
	nonce: number,
	inputValues: unknown[],
) => {
	const FunctionCallType = {
		FunctionCall: [
			{ name: "nonce", type: "uint256" },
			{ name: "selector", type: "bytes4" },
			{ name: "inputData", type: "bytes" },
		],
	};

	const { functionAbi, selector } = getFunction(
		functionName,
		Constants.SOFTSTAKING_CONTRACT_ABI,
	);

	if (!functionAbi) {
		throw new Error(`Function ABI for ${functionName} not found`);
	}
	const inputs = functionAbi.inputs || [];
	const types = iterateFunctionInputs(inputs);
	const values = processInputValues(inputValues);

	console.log("Processed values:", values);

	const inputData = ethers.AbiCoder.defaultAbiCoder().encode(types, values);

	const message = {
		nonce,
		selector,
		inputData,
	};

	return {
		domain,
		types: FunctionCallType,
		primaryType: Object.keys(FunctionCallType)[0],
		message,
	};
};

export const processInputValues = (inputValues: unknown[]) => {
	const values = inputValues.map((inputValue) => {
		if (typeof inputValue === "object" && inputValue !== null) {
			return Object.values(inputValue);
		}
		return inputValue;
	});

	return values;
};

export const convertObjectListToArray = (
	objectList: Record<string, unknown>[],
): unknown[][] => {
	return objectList.map((object) => Object.values(object));
};

export {};
