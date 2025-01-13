export type ClaimData = {
	claimer: `0x${string}`;
	claimableTimestamp: number;
	amount: string;
	accessKey?: string;
};

export type APIRewardDataAdapter = {
    walletAddress: `0x${string}`;
    claimableTimestamp: number;
    amountReward: string;
    month: number;
    year: number;
}

export type APISoftStakingRawData = {
    success: boolean;
    data: APIRewardData[];
}

export type APIRewardData = {
    month: number;
    year: number;
    amountReward: string;
    claimableTimestamp: number;
    status: number;
    user: APIUserDetails;
}

export type APIUserDetails = {
    id: number;
    username?: string;
    walletAddress: `0x${string}`;
    apyRate: string;
}