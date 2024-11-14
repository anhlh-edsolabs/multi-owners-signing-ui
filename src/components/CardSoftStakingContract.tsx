import {
	Card,
	Stack,
	Title,
	Text,
	Group,
	Select,
	Space,
	Button,
	TextInput,
	Table,
	JsonInput,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { IconTransitionRightFilled } from "@tabler/icons-react";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import {
	useSignTypedData,
	useReadContract,
	useChainId,
	useChains,
} from "wagmi";
import { useForm } from "@mantine/form";
import {
	ClaimData,
	ReadContractProps,
	FunctionCallFormData,
} from "../common/types/";
import { config } from "../common/config.ts";

import {
	SoftStakingDomain as domain,
	Constants,
	convertRawDataToClaimData,
	createFunctionCallTypedData,
	convertObjectListToArray,
} from "../common/libs/SoftStakingEIP712.ts";

import { getFunction } from "../common/libs/Utils.ts";

const SPECIAL_FUNCTIONS = ["createClaimDataMultiple"];

const WriteFunctions = Constants.SOFTSTAKING_CONTRACT_ABI.filter(
	(item) =>
		item.type === "function" &&
		item.stateMutability !== "view" &&
		item.stateMutability !== "pure",
);

const generateClaimDataList = (data: any): ClaimData[] => {
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

const ReadContract = ({
	funcName,
	children,
	args,
	onListening,
}: ReadContractProps) => {
	const { data, isSuccess } = useReadContract({
		abi: Constants.SOFTSTAKING_CONTRACT_ABI,
		address: Constants.SOFTSTAKING_ADDRESS,
		functionName: funcName,
		args: args,
	});
	console.log("Nonce after reading from contract:", data);

	useEffect(() => {
		if (isSuccess) {
			onListening?.(data);
		}
	}, [isSuccess, data, onListening]);
	return <>{children}</>;
};

const CardSoftStakingContract = () => {
	const chainId = useChainId();
	const chains = useChains({ config });

	const [connectedChain, setConnectedChain] = useState<any>(null);
	const [selectedFunction, setSelectedFunction] = useState<string | null>(
		null,
	);
	const [claimData, setClaimData] = useState<any[]>([]);
	const [claimDataList, setClaimDataList] = useState<any[][]>([]);
	const [typedData, setTypedData] = useState<any>(null);
	const [nonce, setNonce] = useState<any>(null);
	const [signature, setSignature] = useState<string | null>(null);

	const { signTypedDataAsync, data: signatureData } = useSignTypedData();

	useEffect(() => {
		if (chains && chainId) {
			const matchedChain = chains.find((chain) => chain.id === chainId);
			if (matchedChain) {
				setConnectedChain(matchedChain);
			}
		}
	}, [chains, chainId]);

	console.log("Chains: ", chains);
	console.log("Connected chain: ", connectedChain);

	const form = useForm<FunctionCallFormData>({
		initialValues: {
			functionName: "",
			params: [],
			nonce: null,
		},
	});

	console.log("Form: ", form.values);

	const handleFunctionSelect = (funcName: string) => {
		setSelectedFunction(funcName);
		form.setFieldValue("functionName", funcName);
		form.setFieldValue("params", []);
	};

	useEffect(() => {
		if (signatureData) {
			console.log("Signature: ", signatureData);
			setSignature(signatureData);
		}
	}, [signatureData]);

	useEffect(() => {
		if (SPECIAL_FUNCTIONS.includes(selectedFunction!)) {
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

		setSignature(null);
		setTypedData(null);
	}, [selectedFunction, nonce]);

	const handleTypedDataGeneration = (values: any) => {
		console.log("HandleTypedDataGeneration:", values.params);

		const paramValues =
			SPECIAL_FUNCTIONS.includes(selectedFunction!) &&
			claimDataList.length > 0
				? [claimDataList]
				: values.params;

		const typedData = createFunctionCallTypedData(
			domain,
			values.functionName,
			values.nonce,
			paramValues,
		);
		console.log("TypedData", typedData);
		setTypedData(typedData);
	};

	const handleInputValueChange = (index: number, value: string) => {
		// form.setFieldValue(`params.${index}`, value);
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
										`${connectedChain?.blockExplorers.default.url}/address/${Constants.SOFTSTAKING_ADDRESS}`,
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
									)?.selector
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
								{!SPECIAL_FUNCTIONS.includes(
									selectedFunction,
								) &&
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
												key={index}
												label={input.name}
												size="sm"
												{...form.getInputProps(
													`params.${index}`,
												)}
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
												(value: any, i) => (
													<td key={i}>{value}</td>
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
