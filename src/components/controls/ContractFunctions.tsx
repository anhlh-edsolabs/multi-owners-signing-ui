import { Group, Select } from "@mantine/core";
import { getFunction } from "../../common/libs/utils.ts";
import { AbiDecode, ContractFunctionProps } from "../../common/types/index.ts";
import { useFunctionSelectionStore } from "../../hooks/useFunctionSelectionStore.ts";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm.ts";

const ContractFunctions = ({ abi }: ContractFunctionProps) => {
	const WriteFunctions = abi.filter(
		(item: AbiDecode) =>
			item.type === "function" &&
			item.stateMutability !== "view" &&
			item.stateMutability !== "pure",
	);

	const { setSelectedFunction } = useFunctionSelectionStore();

	const form = useFunctionCallFormContext();

	console.log("Form in Contract Function Select:", form.values);

	const handleFunctionSelect = (funcName: string) => {
		setSelectedFunction(funcName);
		form.setFieldValue("functionName", funcName);
		form.setFieldValue("params", []);
	};

	return (
		<Group grow>
			<Select
				name="function-select"
				dropdownPosition="bottom"
				label="Select Function"
				placeholder="Pick one"
				data={WriteFunctions.map((func: AbiDecode) => ({
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

export default ContractFunctions;
