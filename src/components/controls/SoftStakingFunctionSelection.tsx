import { useEffect, useState } from "react";
import { Group, Radio, Select } from "@mantine/core";
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

	const ReadFunction = abi.filter(
		(item: AbiItem) =>
			item.type === "function" &&
			(item.stateMutability === "view" ||
				item.stateMutability === "pure"),
	);

	const { setSelectedFunction } = useFunctionSelectionStore();

	const form = useFunctionCallFormContext();
	const [selector, setSelector] = useState<string>("");

	const [functionType, setFunctionType] = useState<string>("read");
	const [functionList, setFunctionList] = useState<AbiItem[]>(ReadFunction);
	const [selectValue, setSelectValue] = useState<string>("");

	const handleFunctionTypeSelect = (value: string) => {
		setFunctionType(value);

		if (value === "read") {
			setFunctionList(ReadFunction);
		} else {
			setFunctionList(WriteFunctions);
		}

		setSelectValue("");
		setSelectedFunction("", "", null);
	};

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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, nonce]);

	const handleFunctionSelect = async (funcName: string) => {
		if (!funcName) return;

		const functionABI = functionList.find((func) => func.name === funcName);
		setSelectedFunction(funcName, functionType, functionABI);
		setSelectValue(funcName);

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
		</>
	);
};

export default SoftStakingFunctionSelection;
