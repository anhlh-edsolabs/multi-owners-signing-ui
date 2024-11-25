import {
    type GetBalanceErrorType,
    type ReadContractsErrorType,
} from "@wagmi/core";
import { erc20Abi } from "viem";
import { useBalance, useReadContracts, type BaseError } from "wagmi";

export function useTokenBalance({
	address,
	token,
}: {
	address: `0x${string}`;
	token?: `0x${string}`;
}): {
	balance: bigint;
	decimals: number;
	symbol: string;
	isPending: boolean;
	error: BaseError | ReadContractsErrorType | GetBalanceErrorType | null;
} {
	const nativeBalance = useBalance({
		address: address,
		query: {
			enabled: !token,
		},
	});

	const erc20Balance = useReadContracts({
		allowFailure: false,
		contracts: [
			{
				address: token,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [address],
			},
			{
				address: token,
				abi: erc20Abi,
				functionName: "decimals",
			},
			{
				address: token,
				abi: erc20Abi,
				functionName: "symbol",
			},
		],
		query: {
			enabled: !!token,
		},
	});

	if (token) {
		if (erc20Balance.isError) {
			return {
				balance: BigInt(0),
				decimals: 0,
				symbol: "",
				isPending: erc20Balance.isPending,
				error: erc20Balance.error,
			};
		}

		return {
			balance: erc20Balance.data?.[0] as bigint,
			decimals: erc20Balance.data?.[1] as number,
			symbol: erc20Balance.data?.[2] as string,
			isPending: erc20Balance.isPending,
			error: erc20Balance.error,
		};
	} else {
		if (nativeBalance.isError) {
			return {
				balance: BigInt(0),
				decimals: 0,
				symbol: "",
				isPending: nativeBalance.isPending,
				error: nativeBalance.error,
			};
		}
		return {
			balance: (nativeBalance.data?.value as bigint) || BigInt(0),
			decimals: (nativeBalance.data?.decimals as number) || 0,
			symbol: (nativeBalance.data?.symbol as string) || "",
			isPending: nativeBalance.isPending,
			error: nativeBalance.error,
		};
	}
}
