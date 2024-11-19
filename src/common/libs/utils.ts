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