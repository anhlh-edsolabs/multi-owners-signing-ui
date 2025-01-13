import {
	Button,
	Card,
	Group,
	JsonInput,
	Space,
	Stack,
	Table,
	TextInput,
	Title,
} from "@mantine/core";

// import { useForm } from "@mantine/form";
import { Prism } from "@mantine/prism";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { useSignTypedData } from "wagmi";

import {
	ClaimData,
	APIRewardDataAdapter,
	FunctionCallFormData,
	FunctionCallTypedData,
} from "../../common/types/index.ts";

import getSoftStakingData from "../../common/data/soft-staking-data";

import {
	convertObjectListToArray,
	convertRawDataToClaimData,
	createFunctionCallTypedData,
	SoftStakingTypedDataDomain as domain,
} from "../../common/libs/soft-staking-EIP712.ts";

import ContractInfo from "../controls/ContractInfo.tsx";
import ReadContract from "../controls/ReadContract.tsx";
import WriteContract from "../controls/WriteContract.tsx";

import Constants from "../../common/constants.ts";
import { getFunction } from "../../common/libs/utils.ts";
import { useConnectedChain } from "../../hooks/useConnectedChain.ts";
import { useExecutionStore } from "../../hooks/useExecutionStore.ts";
import {
	FunctionCallFormProvider,
	useFunctionCallForm,
} from "../../hooks/useFunctionCallForm.ts";
import { useFunctionSelectionStore } from "../../hooks/useFunctionSelectionStore.ts";
import { useSignatureStore } from "../../hooks/useSignatureStore.ts";
import CombinedSignature from "../controls/CombinedSignature.tsx";
import ContractFunctions from "../controls/ContractFunctions.tsx";
// import { useExecutionStore } from "../hooks/useExecutionStore.ts";

const CONTRACT_TITLE = "Soft Staking Multi-Owners contract";
const SPECIAL_FUNCTION = "createClaimDataMultiple";
const MULTI_SIG_FUNCTIONS = [
	"createClaimDataMultiple",
	"createClaimData",
	"changeOwner",
	"setSignerThreshold",
	"setRewardThreshold",
];

const WriteFunctions = Constants.SOFTSTAKING_CONTRACT_ABI.filter(
	(item) =>
		item.type === "function" &&
		item.stateMutability !== "view" &&
		item.stateMutability !== "pure",
);

const generateClaimDataList = (data: APIRewardDataAdapter[]): ClaimData[] => {
	const claimDataRawList = convertRawDataToClaimData(data);

	const accessKeys: string[] = [];
	const claimDataList: ClaimData[] = claimDataRawList.map((item) => {
		const accessKey = ethers.solidityPackedKeccak256(
			["address", "uint48", "uint256"],
			[
				item.claimer,
				item.claimableTimestamp,
				ethers.parseEther(item.amount),
			],
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

	const { selectedFunction } = useFunctionSelectionStore();

	const [claimData, setClaimData] = useState<APIRewardDataAdapter[]>([]);
	const [claimDataList, setClaimDataList] = useState<unknown[][]>([]);
	const [nonce, setNonce] = useState<string>("");
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [typedData, setTypedData] = useState<any>(null);
	// const [signature, setSignature] = useState<string | null>(null);

	const { signature, setSignature } = useSignatureStore();
	const { setExecutionData, setCombinedSignature } = useExecutionStore();

	const { signTypedDataAsync, data: signatureData } = useSignTypedData();

	const form = useFunctionCallForm({
		initialValues: {
			functionName: "",
			params: [],
			nonce: null,
		},
	});

	console.log("Form initial values: ", form.values);

	useEffect(() => {
		if (signatureData) {
			console.log("Signature: ", signatureData);
			// useSignatureStore((state) => state.setSignature(signatureData));
			setSignature(signatureData);
		}
	}, [setSignature, signatureData]);

	useEffect(() => {
		if (selectedFunction === SPECIAL_FUNCTION) {
			getSoftStakingData(2024, 12)
				.then((data) => {
					setClaimData(data);
					const claimDataRawList = generateClaimDataList(data);

					console.log("claimDataRawList:", claimDataRawList);
					const claimDataList =
						convertObjectListToArray(claimDataRawList);
					console.log("claimDataList:", claimDataList);
					setClaimDataList(claimDataList);
				})
				.catch((error) => console.error("Error:", error));
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

			form.setFieldValue(
				`params.${index}`,
				typeof parsedValue === "object" ? parsedValue : value,
			);
		} catch {
			console.log("Not a JSON");
			form.setFieldValue(`params.${index}`, value?.toString());
		}

		console.log("Form values:", form.values);
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
				<FunctionCallFormProvider form={form}>
					<Stack spacing="lg">
						<ContractInfo
							title={CONTRACT_TITLE}
							address={Constants.SOFTSTAKING_ADDRESS}
						/>
						<ContractFunctions
							abi={Constants.SOFTSTAKING_CONTRACT_ABI}
						/>
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
												input.type.startsWith(
													"tuple",
												) ||
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
																event
																	.currentTarget
																	.value,
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
													signTypedDataAsync(
														typedData,
													)
												}
											>
												Sign
											</Button>
										</Group>
									) : (
										<WriteContract
											funcName={selectedFunction}
											args={form.values.params}
										/>
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
									<Title order={3}>
										Typed data struct hash
									</Title>
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
							<CombinedSignature />
						</Stack>
					)}

					{selectedFunction === SPECIAL_FUNCTION &&
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
				</FunctionCallFormProvider>
			</Card>
		</ReadContract>
	);
};

export default CardSoftStakingContract;
