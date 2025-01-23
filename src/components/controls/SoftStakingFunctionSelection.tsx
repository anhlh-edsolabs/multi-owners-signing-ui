import { useCallback, useMemo, useState } from "react";

import { Group, Radio, Select } from "@mantine/core";
import { readContract, type ReadContractErrorType } from "@wagmi/core";
import { type BaseError } from "wagmi";

import { wagmiConfig } from "../../common/config";
import { getFunction, toObject } from "../../common/libs/utils";
import { AbiItem, ContractFunctionProps } from "../../common/types";

import ErrorAlert from "./ErrorAlert";

import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";

const SoftStakingFunctionSelection = ({
	abi,
	address,
	functionWithNonces,
}: ContractFunctionProps) => {
	const { setSelectedFunction } = useFunctionSelectionStore();
	const form = useFunctionCallFormContext();

	const [functionType, setFunctionType] = useState<string>("read");
	// const [functionList, setFunctionList] = useState<AbiItem[]>(ReadFunction);
	const [selectValue, setSelectValue] = useState<string>("");
	const [error, setError] = useState<ReadContractErrorType | null>(null);

	const filteredFunctions = useMemo(() => {
		const writeFunctions = abi.filter(
			(item: AbiItem) =>
				item.type === "function" &&
				item.stateMutability !== "view" &&
				item.stateMutability !== "pure",
		);

		const readFunction = abi.filter(
			(item: AbiItem) =>
				item.type === "function" &&
				(item.stateMutability === "view" ||
					item.stateMutability === "pure"),
		);

		return { writeFunctions, readFunction };
	}, [abi]);

	const functionList =
		functionType === "read"
			? filteredFunctions.readFunction
			: filteredFunctions.writeFunctions;

	const handleFunctionTypeSelect = (value: string) => {
		setFunctionType(value);
		setSelectValue("");
		setSelectedFunction("", "", null);
	};

	const getNonceBySelector = useCallback(
		async (selector: string): Promise<number | null> => {
			if (selector === "") return null;

			try {
				const result = await readContract(wagmiConfig, {
					abi,
					address,
					functionName: "getNonce",
					args: [selector],
				});

				const nonce = parseInt(toObject(result));
				return nonce;
			} catch (err) {
				setError(err as ReadContractErrorType);
				return null;
			}
		},
		[abi, address],
	);

	const handleFunctionSelect = async (funcName: string) => {
		if (!funcName) return;

		const functionABI = functionList.find((func) => func.name === funcName);
		setSelectedFunction(funcName, functionType, functionABI);
		setSelectValue(funcName);

		try {
			const functionDetails = getFunction(funcName, abi);
			form.setFieldValue("functionName", funcName);
			form.setFieldValue("params", []);

			const nonce = functionWithNonces?.includes(funcName)
				? await getNonceBySelector(functionDetails.selector)
				: null;

			form.setFieldValue("nonce", nonce);
		} catch (error) {
			console.error(
				`Error fetching nonce for function ${funcName}:`,
				error,
			);
		}
	};

	return (
		<>
			<Group>
				<Radio.Group
					name="function-type"
					color="blue"
					value={functionType}
					onChange={handleFunctionTypeSelect}
				>
					<Group mt="xs">
						<Radio value="read" label="Read contract" />
						<Radio value="write" label="Write contract" />
					</Group>
				</Radio.Group>
			</Group>
			<Group grow>
				<Select
					name="function-select"
					dropdownPosition="bottom"
					label="Select Function"
					placeholder="Pick one"
					value={selectValue}
					data={functionList.map((func: AbiItem) => ({
						value: func.name || "",
						label: `${func.name} (${
							getFunction(func.name || "", abi).selector
						})`,
					}))}
					onChange={handleFunctionSelect}
				/>
			</Group>
			{error && (
				<ErrorAlert
					message={
						(error as unknown as BaseError).shortMessage ||
						error.message
					}
				/>
			)}
		</>
	);
};

export default SoftStakingFunctionSelection;
