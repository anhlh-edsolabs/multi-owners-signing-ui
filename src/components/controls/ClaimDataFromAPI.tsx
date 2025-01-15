import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { APIRewardDataAdapter, ClaimData } from "../../common/types";
import getSoftStakingData from "../../common/data/soft-staking-data";
import {
	convertObjectListToArray,
	convertRawDataToClaimData,
} from "../../common/libs/soft-staking-EIP712";

import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
import { useClaimDataStore } from "../../hooks/stores/useClaimDataStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";
import { Stack, Space, Table } from "@mantine/core";

const ClaimDataFromAPI = () => {
	const { selectedFunction } = useFunctionSelectionStore();
	const { setSignature } = useSignatureStore();
	const [claimData, setClaimData] = useState<APIRewardDataAdapter[]>([]);
	const { setClaimDataList } = useClaimDataStore();
	const { setTypedData } = useTypedDataStore();

	const form = useFunctionCallFormContext();

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
		// if (selectedFunction === SPECIAL_FUNCTION) {
		// 	getSoftStakingData(2024, 6)
		// 		.then((data) => {
		// 			setClaimData(data);
		// 			const claimDataRawList = generateClaimDataList(data);

		// 			console.log("claimDataRawList:", claimDataRawList);

		// 			const claimDataList =
		// 				convertObjectListToArray(claimDataRawList);

		// 			console.log("claimDataList:", claimDataList);

		// 			setClaimDataList(claimDataList);
		// 			form.setFieldValue("params", [claimDataList]);
		// 		})
		// 		.catch((error) => console.error("Error:", error));
		// }
		// form.setFieldValue("nonce", parseInt(nonce));

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

		setSignature("");
		setTypedData(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFunction]);

	return (
		<>
			{claimData.length > 0 && (
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
				</Stack>
			)}
		</>
	);
};

export default ClaimDataFromAPI;
