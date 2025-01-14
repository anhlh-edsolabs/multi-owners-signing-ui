import axios from "axios";
import {
	APISoftStakingRawData,
	APIRewardData,
	APIRewardDataAdapter,
} from "../types/claim-data";
import Constants from "../constants";

async function getSoftStakingData(
	year: number,
	month: number,
): Promise<APIRewardDataAdapter[]> {
	const url = Constants.SOFTSTAKING_DATA_ENDPOINT;
	const params = {
		month,
		year,
		typedata: 1,
		status: 1,
	};

	try {
		const response = await axios.get<APISoftStakingRawData>(url, {
			params,
		});

		if (response.data.success) {
			return response.data.data.map((item: APIRewardData) => ({
                walletAddress: item.user.walletAddress,
                claimableTimestamp: item.claimableTimestamp,
                amountReward: parseFloat(item.amountReward).toString(),
				month: item.month,
				year: item.year,
            }));
		} else {
			throw new Error("Failed to fetch data");
		}
	} catch (err: unknown) {
		console.error("Error:", err);
		throw new Error("Failed to fetch data");
	}
}

export default getSoftStakingData;
