import { useRef } from "react";
import {
	Group,
	JsonInput,
	Space,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";

import Constants from "../../common/constants";

import WriteContract from "./WriteContract";
import GenerateTypedDataButton from "./GenerateTypedDataButton";
import SignTypedDataButton from "./SignTypedDataButton";

import { SoftStakingFunctionProps } from "../../common/types/props";

import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";
import ClaimDataFromAPI from "./ClaimDataFromAPI";
import ReadContract from "./ReadContract";

const SoftStakingFunctionInput = ({
	multiSigs,
	special,
}: SoftStakingFunctionProps) => {
	const SPECIAL_FUNCTION = special,
		MULTI_SIG_FUNCTIONS = multiSigs;
	const form = useFunctionCallFormContext();

	const { selectedFunction, selectedFunctionABI, selectedFunctionType } =
		useFunctionSelectionStore();

	const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(
		[],
	);

	const handleInputValueChange = (index: number, value: string) => {
		try {
			const parsedValue = JSON.parse(value);

			form.setFieldValue(
				`params.${index}`,
				typeof parsedValue === "object" ? parsedValue : value,
			);
		} catch {
			console.log("Not a JSON");
			// form.setFieldValue(`params.${index}`, value?.toString());

			if (value || value !== "") {
				form.setFieldValue(`params.${index}`, value?.toString());
			} else {
				form.setFieldValue(`params.${index}`, null);
			}
		}

		console.log("Form values:", form.values);
	};

	return (
		<>
			{selectedFunction && (
				<Stack spacing="lg">
					<Space h="md" />
					<Title order={3}>
						Selected Function: {selectedFunction}
					</Title>
					<form>
						<Stack spacing="xs">
							{selectedFunction !== SPECIAL_FUNCTION &&
								selectedFunctionABI?.inputs.map(
									(input, index) => {
										if (
											input.type.startsWith("tuple") ||
											input.type.endsWith("[]")
										) {
											return (
												<JsonInput
													name="input-tuple"
													key={index}
													label={input.name}
													placeholder="Input tuple as arrays"
													withAsterisk
													validationError="Invalid JSON"
													onBlur={(event) =>
														handleInputValueChange(
															index,
															event.currentTarget
																.value,
														)
													}
													value={JSON.stringify(
														form.values.params[
															index
														],
													)}
													minRows={4}
													ref={(el) =>
														(inputRefs.current[
															index
														] = el)
													}
												/>
											);
										}
										return (
											<TextInput
												name={`params.${index}`}
												key={index}
												label={input.name}
												size="sm"
												withAsterisk
												value={
													form.getInputProps(
														`params.${index}`,
													).value || ""
												}
												onChange={(event) =>
													handleInputValueChange(
														index,
														event.currentTarget
															.value,
													)
												}
												ref={(el) =>
													(inputRefs.current[index] =
														el)
												}
											/>
										);
									},
								)}
							{selectedFunction === SPECIAL_FUNCTION && (
								<ClaimDataFromAPI />
							)}
							{MULTI_SIG_FUNCTIONS.includes(selectedFunction) ? (
								<Group grow>
									<GenerateTypedDataButton label="Create typed data for signing" />
									<SignTypedDataButton label="Sign typed data" />
								</Group>
							) : (
								<>
									{selectedFunctionType == "write" && (
										<WriteContract
											abi={
												Constants.SOFTSTAKING_CONTRACT_ABI
											}
											address={
												Constants.SOFTSTAKING_ADDRESS
											}
											funcName={selectedFunction}
											args={form.values.params}
										/>
									)}
									{selectedFunctionType == "read" && (
										<ReadContract
											abi={
												Constants.SOFTSTAKING_CONTRACT_ABI
											}
											address={
												Constants.SOFTSTAKING_ADDRESS
											}
											funcName={selectedFunction}
											args={form.values.params}
										/>
									)}
								</>
							)}
						</Stack>
					</form>
				</Stack>
			)}
		</>
	);
};

export default SoftStakingFunctionInput;
