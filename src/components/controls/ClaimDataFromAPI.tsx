import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { IconCalendar } from "@tabler/icons-react";

import { Group, Select, Space, Stack, Table } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";

import getSoftStakingData from "../../common/data/soft-staking-data";
import {
	convertObjectListToArray,
	convertRawDataToClaimData,
} from "../../common/libs/soft-staking-EIP712";
import { APIRewardDataAdapter, ClaimData } from "../../common/types";

import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";

import { useClaimDataStore } from "../../hooks/stores/useClaimDataStore";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";

const ClaimDataFromAPI = () => {
	const { selectedFunction } = useFunctionSelectionStore();
	const { setSignature } = useSignatureStore();
	const [claimData, setClaimData] = useState<APIRewardDataAdapter[]>([]);
	const { setClaimDataList } = useClaimDataStore();
	const { setTypedData } = useTypedDataStore();

	const form = useFunctionCallFormContext();

	const getLatestRewardMonth = () => {
		// get the previous month of current year,
		// if the current month is January, get the December of previous year
		const today = new Date();
		let month = today.getMonth() - 1;
		let year = today.getFullYear();
		if (month < 0) {
			month = 11;
			year -= 1;
		}
        
		return new Date(year, month, 1);
	};

	const [rewardMonth, setRewardMonth] = useState<Date>(
		getLatestRewardMonth(),
	);
	const [ledgerStatus, setLedgerStatus] = useState<string | null>(null);

	const generateClaimDataList = (
		data: APIRewardDataAdapter[],
	): ClaimData[] => {
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

	useEffect(() => {
		getSoftStakingData(
			rewardMonth.getFullYear(),
			rewardMonth.getMonth() + 1,
			ledgerStatus ? parseInt(ledgerStatus) : 0,
		)
			.then((data) => {
				console.log("Data:", data);
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

		setSignature("");
		setTypedData(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFunction, rewardMonth, ledgerStatus]);

	return (
		<>
			<Stack spacing="lg">
				<Group grow align="flex-start">
					<MonthPickerInput
						name="reward-month"
						valueFormat="MM/YYYY"
						icon={<IconCalendar size="1.1rem" stroke={1.5} />}
						// placeholder="Pick a month"
						value={rewardMonth}
						onChange={(value) => {
							if (value) {
								setRewardMonth(value);
							}
						}}
						mx="auto"
					/>
					<Select
						name="select-status"
						placeholder="Select status"
						defaultValue={ledgerStatus}
						data={[
							{ value: "0", label: "Pending" },
							{ value: "1", label: "Pushed" },
							{ value: "2", label: "Claimed" },
						]}
						onChange={setLedgerStatus}
					/>
				</Group>
				{claimData.length > 0 && (
					<>
						<Table
							id="claim-data-multiple"
							fontSize="sm"
							striped
							highlightOnHover
							withBorder
						>
							<thead>
								<tr>
									{Object.keys(claimData[0]).map((key) => (
										<th key={key}>{key}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{claimData.map((row, index) => (
									<tr key={index}>
										{Object.values(row).map(
											(value: unknown, i) => (
												<td key={i}>
													{value as React.ReactNode}
												</td>
											),
										)}
									</tr>
								))}
							</tbody>
						</Table>
                        <Space h="md" />
					</>
				)}
			</Stack>
		</>
	);
};

export default ClaimDataFromAPI;
