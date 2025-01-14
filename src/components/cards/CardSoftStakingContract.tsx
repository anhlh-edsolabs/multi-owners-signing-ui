import { Card, Space, Stack, Table } from "@mantine/core";

import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { APIRewardDataAdapter, ClaimData } from "../../common/types";

import getSoftStakingData from "../../common/data/soft-staking-data";

import {
	convertObjectListToArray,
	convertRawDataToClaimData,
} from "../../common/libs/soft-staking-EIP712";

import Constants from "../../common/constants";
import { getFunction } from "../../common/libs/utils";
import { useClaimDataStore } from "../../hooks/stores/useClaimDataStore";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
import {
	FunctionCallFormProvider,
	useFunctionCallForm,
} from "../../hooks/useFunctionCallForm";

import ContractInfo from "../controls/ContractInfo";
import ReadContract from "../controls/ReadContract";
import ContractFunctions from "../controls/ContractFunctions";
import SoftStakingFunctionInput from "../controls/SoftStakingFunctionInput";
import TypedDataView from "../controls/TypedDataView";

const CONTRACT_TITLE = "Soft Staking Multi-Owners contract";
const SPECIAL_FUNCTION = "createClaimDataMultiple";
const MULTI_SIG_FUNCTIONS = [
	"createClaimDataMultiple",
	"createClaimData",
	"changeOwner",
	"setSignerThreshold",
	"setRewardThreshold",
];

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
	const { selectedFunction } = useFunctionSelectionStore();

	const [claimData, setClaimData] = useState<APIRewardDataAdapter[]>([]);
	const { setClaimDataList } = useClaimDataStore();

	const [nonce, setNonce] = useState<string>("");

	const { setTypedData } = useTypedDataStore();
	const { setSignature } = useSignatureStore();

	const form = useFunctionCallForm({
		initialValues: {
			functionName: "",
			params: [],
			nonce: null,
		},
	});

	console.log("Form initial values: ", form.values);

	useEffect(() => {
		if (selectedFunction === SPECIAL_FUNCTION) {
			getSoftStakingData(2024, 6)
				.then((data) => {
					setClaimData(data);
					const claimDataRawList = generateClaimDataList(data);

					console.log("claimDataRawList:", claimDataRawList);

					const claimDataList =
						convertObjectListToArray(claimDataRawList);

					console.log("claimDataList:", claimDataList);

					setClaimDataList(claimDataList);
					form.setFieldValue("params", [claimDataList]);
				})
				.catch((error) => console.error("Error:", error));
		}
		form.setFieldValue("nonce", parseInt(nonce));

		setSignature("");
		setTypedData(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFunction, nonce]);

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
					<SoftStakingFunctionInput
						multiSigs={MULTI_SIG_FUNCTIONS}
						special={SPECIAL_FUNCTION}
					/>
					<TypedDataView />
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
