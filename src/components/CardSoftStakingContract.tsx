import {
	Button,
	Card,
	Group,
	JsonInput,
	Select,
	Space,
	Stack,
	Table,
	Text,
	TextInput,
	Title,
} from "@mantine/core";

// import { useForm } from "@mantine/form";
import { Prism } from "@mantine/prism";
import { IconTransitionRightFilled } from "@tabler/icons-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { useSignTypedData } from "wagmi";

import {
	ClaimData,
	FunctionCallFormData,
	FunctionCallTypedData,
} from "../common/types/";

import {
	convertObjectListToArray,
	convertRawDataToClaimData,
	createFunctionCallTypedData,
	SoftStakingTypedDataDomain as domain,
} from "../common/libs/soft-staking-EIP712.ts";

import ReadContract from "./ReadContract";
import WriteContract from "./WriteContract";

import Constants from "../common/constants";
import { useFunctionCallForm } from "../hooks/useCustomForm.ts";
import { getFunction } from "../common/libs/utils";
import { useConnectedChain } from "../hooks/useConnectedChain.ts";
import { useSignatureStore } from "../hooks/useSignatureStore.ts";
import { useExecutionStore } from "../hooks/useExecutionStore.ts";
import { useFunctionSelectionStore } from "../hooks/useFunctionSelectionStore.ts";
import DisplayCombinedSignature from "./DisplayCombinedSignature.tsx";
// import { useExecutionStore } from "../hooks/useExecutionStore.ts";

const SPECIAL_FUNCTION = "createClaimDataMultiple";
const MULTI_SIG_FUNCTIONS = [
	"createClaimDataMultiple",
	"createClaimData",
	"changeOwner",
	"setSignerThreshold",
];

const WriteFunctions = Constants.SOFTSTAKING_CONTRACT_ABI.filter(
	(item) =>
		item.type === "function" &&
		item.stateMutability !== "view" &&
		item.stateMutability !== "pure",
);

const generateClaimDataList = (data: unknown): ClaimData[] => {
	const claimDataRawList = convertRawDataToClaimData(data);

	const accessKeys: string[] = [];
	const claimDataList: ClaimData[] = claimDataRawList.map((item) => {
		const accessKey = ethers.solidityPackedKeccak256(
			["address", "uint256", "uint256"],
			[item.claimer, item.claimableTimestamp, item.amount],
		);
		accessKeys.push(accessKey);

		return {
			...item,
			accessKey,
		};
	});
	return claimDataList;
};

const CardSoftStakingContract = () => {
	const connectedChain = useConnectedChain();

	const { selectedFunction, setSelectedFunction } =
		useFunctionSelectionStore();

	const [claimData, setClaimData] = useState<
		{
			year: string;
			month: string;
			wallet_address: string;
			amount_reward: string;
		}[]
	>([]);
	const [claimDataList, setClaimDataList] = useState<unknown[][]>([]);
	const [nonce, setNonce] = useState<string>("");
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [typedData, setTypedData] = useState<any>(null);
	// const [signature, setSignature] = useState<string | null>(null);

	const { signature, setSignature } = useSignatureStore();
	const {
		selector,
		calldata,
		combinedSignature,
		setExecutionData,
		setCombinedSignature,
	} = useExecutionStore();

	const { signTypedDataAsync, data: signatureData } = useSignTypedData();

	const form = useFunctionCallForm();

	console.log("Form: ", form.values);

	const handleFunctionSelect = (funcName: string) => {
		setSelectedFunction(funcName);
		form.setFieldValue("functionName", funcName);
		form.setFieldValue("params", []);
	};

	useEffect(() => {
		if (signatureData) {
			console.log("Signature: ", signatureData);
			// useSignatureStore((state) => state.setSignature(signatureData));
			setSignature(signatureData);
		}
	}, [setSignature, signatureData]);

	useEffect(() => {
		if (selectedFunction === SPECIAL_FUNCTION) {
			import("../common/data/soft_staking_data.json")
				.then((data) => {
					setClaimData(data.default);
					const claimDataRawList = generateClaimDataList(
						data.default,
					);
					// setClaimDataList(claimDataList);
					console.log(claimDataRawList);

					const claimDataList =
						convertObjectListToArray(claimDataRawList);
					console.log(claimDataList);
					setClaimDataList(claimDataList);
				})
				.catch((error) => console.error("Error loading data:", error));
		}
		form.setFieldValue("nonce", parseInt(nonce));

		setSignature("");
		setTypedData(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFunction, nonce]);

	const handleTypedDataGeneration = (values: FunctionCallFormData) => {
		// clear Execution store
		setExecutionData("", "");
		setCombinedSignature("");
		console.log("HandleTypedDataGeneration:", values.params);

		const paramValues =
			selectedFunction === SPECIAL_FUNCTION && claimDataList.length > 0
				? [claimDataList]
				: values.params;

		domain.chainId = connectedChain?.id;

		const typedData = createFunctionCallTypedData(
			domain,
			values.functionName,
			values.nonce ?? 0,
			paramValues,
		);
		// typedData.message.selector = typedData.message.selector || "";
		console.log("TypedData", typedData);
		setTypedData(typedData as FunctionCallTypedData);

		setExecutionData(
			typedData.message.selector,
			typedData.message.inputData,
		);
	};

	const handleInputValueChange = (index: number, value: string) => {
		console.log("Value before parsing:", value);
		try {
			const parsedValue = JSON.parse(value);

			form.setFieldValue(`params.${index}`, parsedValue);
		} catch {
			console.log("Not a JSON");
			form.setFieldValue(`params.${index}`, value);
		}

		console.log("Form values:", form.values);
	};

	const handlePopulateExecutionData = () => {
		form.setFieldValue("params.0", selector);
		form.setFieldValue("params.1", calldata);
		form.setFieldValue("params.2", combinedSignature);

		console.log("Form abc:", form);

		console.log("Populating execution data...");
		console.log("Selector:", form.getInputProps("params.0").value);
		console.log("Calldata:", form.getInputProps("params.1").value);
		console.log(
			"Combined signature:",
			form.getInputProps("params.2").value,
		);
	};

	return (
		<ReadContract
			funcName={"getNonce"}
			args={[
				getFunction(
					form.values.functionName,
					Constants.SOFTSTAKING_CONTRACT_ABI,
				).selector,
			]}
			onListening={setNonce}
		>
			<Card
				shadow="sm"
				padding="lg"
				radius="md"
				withBorder
				style={{ overflow: "visible" }}
			>
				<Stack spacing="lg">
					<Title transform="uppercase" order={3}>
						Soft Staking Multi-Owners contract
					</Title>
					<Text>
						Contract Address:{" "}
						<Text span size="sm" fw="bold" color="gray.8">
							<Button
								rightIcon={
									<IconTransitionRightFilled size="1rem" />
								}
								onClick={() =>
									window.open(
										`${connectedChain?.blockExplorers?.default.url}/address/${Constants.SOFTSTAKING_ADDRESS}`,
									)
								}
								variant="white"
								color="blue"
							>
								{Constants.SOFTSTAKING_ADDRESS}
							</Button>
						</Text>
					</Text>
					<Group grow>
						<Select
							name="function-select"
							dropdownPosition="bottom"
							label="Select Function"
							placeholder="Pick one"
							data={WriteFunctions.map((func) => ({
								value: func.name || "",
								label: `${func.name} (${
									getFunction(
										func.name || "",
										Constants.SOFTSTAKING_CONTRACT_ABI,
									).selector
								})`,
							}))}
							onChange={handleFunctionSelect}
						/>
					</Group>
				</Stack>
				{selectedFunction && (
					<Stack spacing="lg">
						<Space h="md" />
						<Title order={3}>
							Selected Function: {selectedFunction}
						</Title>
						<form>
							<Stack spacing="xs">
								{selectedFunction !== SPECIAL_FUNCTION &&
									WriteFunctions.find(
										(func) =>
											func.name === selectedFunction,
									)?.inputs.map((input, index) => {
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
													onChange={(value) =>
														handleInputValueChange(
															index,
															value,
														)
													}
													value={JSON.stringify(
														form.values.params[
															index
														],
													)}
													minRows={4}
												/>
											);
										}
										return (
											<TextInput
												name={`params.${index}`}
												// name={`params.${input.name}`}
												key={index}
												label={input.name}
												size="sm"
												withAsterisk
												value={
													form.getInputProps(
														`params.${index}`,
													).value
												}
												onChange={(event) =>
													handleInputValueChange(
														index,
														event.currentTarget
															.value,
													)
												}
											/>
										);
									})}
								{MULTI_SIG_FUNCTIONS.includes(
									selectedFunction,
								) ? (
									<Group grow>
										<Button
											name="generate-typed-data"
											type="button"
											onClick={() =>
												handleTypedDataGeneration(
													form.values,
												)
											}
										>
											Create typed data for signing
										</Button>
										<Button
											name="sign-typed-data"
											onClick={() =>
												signTypedDataAsync(typedData)
											}
										>
											Sign
										</Button>
									</Group>
								) : (
									<>
										{/* {selectedFunction ==
											EXECUTE_FUNCTION && (
											<Group grow align="center">
												<Stack align="center">
													<Button
														name="call-function"
														type="button"
														px="xl"
														onClick={
															handlePopulateExecutionData
														}
													>
														Populate execution data
													</Button>
												</Stack>
											</Group>
										)} */}
										<WriteContract
											funcName={selectedFunction}
											args={form.values.params}
											customHandler={
												handlePopulateExecutionData
											}
										/>
									</>
								)}
							</Stack>
						</form>
						{typedData && (
							<Stack spacing="lg">
								<Space h="md" />
								<Title order={3}>Typed Data</Title>
								<Prism language="json" withLineNumbers>
									{JSON.stringify(typedData, null, 2)}
								</Prism>
								<Space h="md" />
								<Title order={3}>Function selector</Title>
								<Prism language="bash">
									{typedData.message.selector}
								</Prism>
								<Space h="md" />
								<Title order={3}>Input data</Title>
								<Prism language="json">
									{typedData.message.inputData}
								</Prism>
								<Space h="md" />
								<Title order={3}>Typed data struct hash</Title>
								<Prism language="json">
									{ethers.TypedDataEncoder.hashStruct(
										typedData.primaryType,
										typedData.types,
										typedData.message,
									)}
								</Prism>
								<Space h="md" />
								<Title order={3}>
									Digest hash (for on-chain verification)
								</Title>
								<Prism language="json">
									{ethers.TypedDataEncoder.hash(
										typedData.domain,
										typedData.types,
										typedData.message,
									)}
								</Prism>
							</Stack>
						)}
						{signature && (
							<Stack spacing="lg">
								<Space h="md" />
								<Title order={3}>Signature</Title>
								<Prism language="json">{signature}</Prism>
							</Stack>
						)}
						<DisplayCombinedSignature />
					</Stack>
				)}

				{selectedFunction === "createClaimDataMultiple" &&
					claimData.length > 0 && (
						<Stack spacing="lg">
							<Space h="md" />
							<Table
								id="claim-data-multiple"
								fontSize="sm"
								striped
								highlightOnHover
								withBorder
							>
								<thead>
									<tr>
										{Object.keys(claimData[0]).map(
											(key) => (
												<th key={key}>{key}</th>
											),
										)}
									</tr>
								</thead>
								<tbody>
									{claimData.map((row, index) => (
										<tr key={index}>
											{Object.values(row).map(
												(value: unknown, i) => (
													<td key={i}>
														{
															value as React.ReactNode
														}
													</td>
												),
											)}
										</tr>
									))}
								</tbody>
							</Table>
						</Stack>
					)}
			</Card>
		</ReadContract>
	);
};

export default CardSoftStakingContract;
