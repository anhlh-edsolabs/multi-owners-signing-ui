/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionFragment } from "ethers";
import { FunctionInput } from "../types";

export const iterateFunctionInputs = (
	inputs: FunctionInput[],
	parentTypeIsTuple: boolean = false,
): string[] => {
	const result = inputs
		.map((input) => {
			if (input.type === "tuple" || input.type === "tuple[]") {
				const childResult = input.components
					? iterateFunctionInputs(input.components, true)
					: "";
				if (childResult !== "") {
					return `tuple(${childResult.join(",")})${
						input.type === "tuple[]" ? "[]" : ""
					}`;
				}
			} else {
				return parentTypeIsTuple
					? `${input.type} ${input.name}`
					: `${input.type}`;
			}
			return "";
		})
		.filter(Boolean);
	return result;
};

export const getFunction = (
	functionName: string,
	contractABI: any[],
) => {
	const functionAbi = contractABI.find(
		(item) => item.type === "function" && item.name === functionName,
	);

	if (!functionAbi) {
		return {
			functionAbi: null,
			selector: "",
		}
	}

	const selector = FunctionFragment.from(functionAbi).selector;

	return {
		functionAbi,
		selector
	}
};

// export const iterateFunctionInputs = (
// 	inputs: FunctionInput[],
// 	parentTypeIsTuple: boolean = false,
// ): string | string[] => {
// 	const result = [];

// 	for (const input of Object.values(inputs)) {
// 		if (input.type === "tuple" || input.type === "tuple[]") {
// 			const childResult = input.components
// 				? iterateFunctionInputs(input.components, true)
// 				: "";
// 			if (childResult != "") {
// 				result.push(
// 					`tuple(${childResult})` +
// 						(input.type === "tuple[]" ? "[]" : ""),
// 				);
// 			}
// 		} else {
// 			if (parentTypeIsTuple) {
// 				result.push(`${input.type} ${input.name}`);
// 			} else {
// 				result.push(`${input.type}`);
// 			}
// 		}
// 	}

// 	if (parentTypeIsTuple) {
// 		return result.join(",");
// 	} else {
// 		return result;
// 	}
// };

// function iterateInputs(inputs, parentTypeIsTuple = false) {
// 	const result = inputs
// 		.map((input) => {
// 			if (input.type === "tuple" || input.type === "tuple[]") {
// 				const childResult = input.components
// 					? iterateInputs(input.components, true)
// 					: "";
// 				if (childResult !== "") {
// 					return `tuple(${childResult.join(",")})${
// 						input.type === "tuple[]" ? "[]" : ""
// 					}`;
// 				}
// 			} else {
// 				return parentTypeIsTuple
// 					? `${input.type} ${input.name}`
// 					: `${input.type}`;
// 			}
// 			return "";
// 		})
// 		.filter(Boolean);
// 	return result;
// }

// let inputs = [
// 	{
// 		type: "uint256",
// 		name: "amount",
// 	},
// 	{
// 		type: "address",
// 		name: "recipient",
// 	},
// 	{
// 		type: "tuple",
// 		name: "data",
// 		components: [
// 			{ type: "address", name: "account" },
// 			{ type: "uint48", name: "timestamp" },
// 		],
// 	},
// 	{
// 		type: "tuple[]",
// 		name: "data",
// 		components: [
// 			{
// 				name: "account",
// 				type: "address",
// 			},
// 			{
// 				name: "claimableTimestamp",
// 				type: "uint48",
// 			},
// 			{
// 				name: "amount",
// 				type: "uint256",
// 			},
// 			{
// 				name: "accessKey",
// 				type: "bytes32",
// 			},
// 		],
// 	},
// ];
