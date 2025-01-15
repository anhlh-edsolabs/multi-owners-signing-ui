import { useEffect, useState } from "react";
import { Group, Select } from "@mantine/core";
import { useReadContract } from "wagmi";
import { getFunction } from "../../common/libs/utils";
import { AbiItem, ContractFunctionProps } from "../../common/types";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";

const SoftStakingFunctionSelection = ({
	abi,
	address,
	functionWithNonces,
}: ContractFunctionProps) => {
	const WriteFunctions = abi.filter(
		(item: AbiItem) =>
			item.type === "function" &&
			item.stateMutability !== "view" &&
			item.stateMutability !== "pure",
	);

	const { setSelectedFunction } =
		useFunctionSelectionStore();

	const form = useFunctionCallFormContext();
	const [selector, setSelector] = useState<string>("");

	const { data, isSuccess } = useReadContract({
		abi,
		address,
		functionName: selector != "" ? "getNonce" : "",
		args: [selector],
	});

	const nonce = data != undefined ? parseInt(data.toString()) : null;

	useEffect(() => {
		if (isSuccess) {
			form.setFieldValue("nonce", nonce);
		}
		// console.log(`Function ${selectedFunction} Nonce: ${nonce}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, nonce]);

	const handleFunctionSelect = async (funcName: string) => {
		if (!funcName) return;

		setSelectedFunction(funcName);

		try {
			const functionDetails = getFunction(funcName, abi);
			form.setFieldValue("functionName", funcName);
			form.setFieldValue("params", []);

			if (functionWithNonces?.includes(funcName)) {
				setSelector(functionDetails.selector);
			} else {
				form.setFieldValue("nonce", null);
			}
		} catch (error) {
			console.error(
				`Error fetching nonce for function ${funcName}:`,
				error,
			);
		}
	};

	return (
		<Group grow>
			<Select
				name="function-select"
				dropdownPosition="bottom"
				label="Select Function"
				placeholder="Pick one"
				data={WriteFunctions.map((func: AbiItem) => ({
					value: func.name || "",
					label: `${func.name} (${
						getFunction(func.name || "", abi).selector
					})`,
				}))}
				onChange={handleFunctionSelect}
			/>
		</Group>
	);
};

export default SoftStakingFunctionSelection;
